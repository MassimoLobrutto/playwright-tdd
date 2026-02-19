import { createLogger, format, transports } from 'winston';

const logLevel = 'info';

export const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] ${message}`;
    })
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'test-run.log' })],
});
