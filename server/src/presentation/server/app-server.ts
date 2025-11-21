import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from '../../infrastructure/database/mongodb/connection/mongoose';
import { connectRedis } from '../../infrastructure/database/redis/connection/redis';
import { env } from '../../infrastructure/config/env';
import { logger } from '../../infrastructure/config/logger';
import { SocketServer } from '../../infrastructure/external-services/socket/socket-server';

import { AuthRouter } from '../routes/auth-router';
import { CompanyRouter } from '../routes/company-router';
import { AdminRouter } from '../routes/admin-router';
import { SeekerRouter } from '../routes/seeker-router';
import { PublicRouter } from '../routes/public-router';
import { authenticateToken } from '../middleware/auth.middleware';
import { errorHandler } from '../middleware/error-handler';
import { UserBlockedMiddleware } from '../middleware/user-blocked.middleware';
import { userRepository } from '../../infrastructure/di/authDi';
import { notificationRouter } from '../../infrastructure/di/notificationDi';
import { DateTimeUtil } from '../../shared/utils/datetime.utils';

export class AppServer {
  private _app: express.Application;
  private _port: number;
  private _httpServer: ReturnType<typeof createServer>;
  private _socketServer: SocketServer | null = null;

  constructor() {
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
        origin: env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      }),
    );

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