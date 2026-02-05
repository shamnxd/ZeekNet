import 'dotenv/config';
import 'reflect-metadata';
import { AppServer } from 'src/presentation/server/app-server';
import { logger } from 'src/infrastructure/config/logger';

async function start() {
  try {
    const server = new AppServer();
    logger.info('Server initialization started');
    logger.info('CI/CD Deployment Verified v1.0');
    await server.start();
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();
