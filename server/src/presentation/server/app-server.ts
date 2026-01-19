import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from 'src/infrastructure/persistence/mongodb/connection/mongoose';
import { connectRedis } from 'src/infrastructure/persistence/redis/connection/redis';
import { env } from 'src/infrastructure/config/env';
import { logger } from 'src/infrastructure/config/logger';
import { SocketServer } from 'src/infrastructure/external-services/socket/socket-server';

import { AuthRouter } from 'src/presentation/routes/auth-router';
import { CompanyRouter } from 'src/presentation/routes/company-router';
import { AdminRouter } from 'src/presentation/routes/admin-router';
import { SeekerRouter } from 'src/presentation/routes/seeker-router';
import { PublicRouter } from 'src/presentation/routes/public-router';
import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { errorHandler } from 'src/presentation/middleware/error-handler';
import { UserBlockedMiddleware } from 'src/presentation/middleware/user-blocked.middleware';
import { userRepository } from 'src/infrastructure/di/authDi';
import { notificationRouter } from 'src/infrastructure/di/notificationDi';
import { chatRouter } from 'src/infrastructure/di/chatDi';
import { DateTimeUtil } from 'src/shared/utils/core/datetime.utils';
import { stripeWebhookController } from 'src/infrastructure/di/companyDi';

export class AppServer {
  private _app: express.Application;
  
  static {
    logger.info('AppServer class definition loading...');
  }
  private _port: number;
  private _httpServer: ReturnType<typeof createServer>;
  private _socketServer: SocketServer | null = null;

  constructor() {
    logger.info('AppServer constructor start');
    this._app = express();
    this._port = Number(env.PORT ?? 4000);
    this._httpServer = createServer(this._app);
  }

  public init(): void {
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this._app.use(helmet());

    this._app.use(
      cors({
        origin: env.FRONTEND_URL || 'http://localhost:5174',
        credentials: true,
      }),
    );

    this._app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

    this._app.use(express.json({ limit: '10mb' }));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());

    this._setLoggingMiddleware();
  }

  private _setLoggingMiddleware(): void {
    
    const morganStream = {
      write: (message: string) => {
        logger.info(message.trim());
      },
    };

    if (env.NODE_ENV === 'development') {
      this._app.use(morgan('dev', { stream: morganStream }));
    } else if (env.NODE_ENV === 'production') {
      this._app.use(morgan('combined', { stream: morganStream }));
    }
  }

  private configureRoutes(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(userRepository);

    this._app.get('/health', (req, res) =>
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }),
    );

    this._app.get('/home', authenticateToken, userBlockedMiddleware.checkUserBlocked, (req, res) => res.json({ message: 'Welcome to ZeekNet Job Portal API' }));

    this._app.use('/api/auth', new AuthRouter().router);
    this._app.use('/api/admin', new AdminRouter().router);
    this._app.use('/api/company', new CompanyRouter().router);
    this._app.use('/api/seeker', new SeekerRouter().router);
    this._app.use('/api/public', new PublicRouter().router);
    this._app.use('/api/notifications', notificationRouter.router);
    this._app.use('/api/chat', chatRouter.router);

    this._app.post('/api/webhook/stripe', stripeWebhookController.handleWebhook);
    logger.info('Stripe webhook endpoint configured at /api/webhook/stripe');

    this._app.use(errorHandler);
  }

  public async connectDatabase(): Promise<void> {
    try {
      await connectToDatabase(env.MONGO_URI as string);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }

    try {
      await connectRedis();
      logger.info('Connected to Redis');
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      await this.connectDatabase();
      this.init();

      this._socketServer = new SocketServer(this._httpServer);

      this._httpServer.listen(this._port, () => {
        logger.info(`Server running on http://localhost:${this._port}`);
        logger.info(`Health check: http://localhost:${this._port}/health`);
        logger.info('Socket.IO server initialized');
      });
    } catch (error) {
      logger.error('Server startup failed:', error);
      throw error;
    }
  }
}


