/**
 * Logger Domain Interface
 * 
 * Defines logging contract for the domain and application layers
 * Infrastructure layer provides concrete implementation
 */
export interface ILogger {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}
