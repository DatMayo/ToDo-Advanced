import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    exitOnError: false,
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
        new transports.Console({ level: 'info' }),
    ],
});
