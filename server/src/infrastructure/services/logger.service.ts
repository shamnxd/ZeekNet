import { ILogger } from '../../domain/interfaces/services/ILogger';
import { logger as winstonLogger } from '../config/logger';

/**
 * Logger Service
 * 
 * Implements ILogger domain interface
 * Wraps Winston logger to decouple infrastructure from domain/application layers
 */
export class LoggerService implements ILogger {
  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    if (error instanceof Error) {
      winstonLogger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      winstonLogger.error(message, { error, ...meta });
    }
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, meta);
  }
}
