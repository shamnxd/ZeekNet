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
import { APP_ROUTES } from 'src/shared/constants/routes';


import { AuthRouter } from 'src/presentation/routes/auth-router';
import { CompanyRouter } from 'src/presentation/routes/company-router';
import { AdminRouter } from 'src/presentation/routes/admin-router';
import { SeekerRouter } from 'src/presentation/routes/seeker-router';
import { PublicRouter } from 'src/presentation/routes/public-router';
import { ChatRouter } from 'src/presentation/routes/chat-router';
import { errorHandler } from 'src/presentation/middleware/error-handler';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { NotificationRouter } from 'src/presentation/routes/notification-router';
import { StripeWebhookController } from 'src/presentation/controllers/payment/stripe-webhook.controller';

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
    this._configureRoutes();
  }

  private configureMiddlewares(): void {
    this._app.use(helmet());
    this._app.use(
      cors({
        origin: env.FRONTEND_URL || 'https://zeeknet.shamnadt.in',
        credentials: true,
      }),
    );

    this._app.use(APP_ROUTES.WEBHOOK_STRIPE, express.raw({ type: '*/*' }));


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

  private _configureRoutes(): void {

    this._app.get('/health', (req, res) =>
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      }),
    );

    this._app.use(APP_ROUTES.AUTH.BASE, new AuthRouter().router);
    this._app.use(APP_ROUTES.ADMIN.BASE, new AdminRouter().router);
    this._app.use(APP_ROUTES.COMPANY.BASE, new CompanyRouter().router);
    this._app.use(APP_ROUTES.SEEKER.BASE, new SeekerRouter().router);
    this._app.use(APP_ROUTES.PUBLIC.BASE, new PublicRouter().router);
    const notificationRouter = container.get<NotificationRouter>(TYPES.NotificationRouter);
    this._app.use(APP_ROUTES.NOTIFICATIONS.BASE, notificationRouter.router);
    this._app.use(APP_ROUTES.CHAT.BASE, new ChatRouter().router);


    const stripeWebhookController = container.get<StripeWebhookController>(TYPES.StripeWebhookController);
    this._app.post(APP_ROUTES.WEBHOOK_STRIPE, stripeWebhookController.handleWebhook);
    logger.info(`Stripe webhook endpoint configured at ${APP_ROUTES.WEBHOOK_STRIPE}`);


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
