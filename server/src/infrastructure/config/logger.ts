import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { env } from 'src/infrastructure/config/env';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_RETENTION_DAYS = Number(env.LOG_RETENTION_DAYS) || 30;

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }),
);

const createDailyRotateFileTransport = (
  filename: string,
  level: string,
): DailyRotateFile => {
  return new DailyRotateFile({
    filename: path.join(logsDir, `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: `${LOG_RETENTION_DAYS}d`, 
    level,
    format: logFormat,
    auditFile: path.join(logsDir, `.${filename}-audit.json`),
    zippedArchive: true, 
  });
};

const transports: winston.transport[] = [
  
  createDailyRotateFileTransport('error', 'error'),

  createDailyRotateFileTransport('combined', 'info'),
];

if (env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: `${LOG_RETENTION_DAYS}d`,
      format: logFormat,
      auditFile: path.join(logsDir, '.exceptions-audit.json'),
      zippedArchive: true,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: `${LOG_RETENTION_DAYS}d`,
      format: logFormat,
      auditFile: path.join(logsDir, '.rejections-audit.json'),
      zippedArchive: true,
    }),
  ],
});
