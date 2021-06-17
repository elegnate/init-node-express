import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const logDir = './logs';
const logFormat = winston.format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 14,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${logDir}/error`,
            filename: `%DATE%.error.log`,
            maxFiles: 28,
            zippedArchive: true,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss.SSS',
                }),
                logFormat,
            ),
        }),
    );
}
