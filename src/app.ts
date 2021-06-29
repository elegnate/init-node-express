import 'reflect-metadata';
import * as express from 'express';
import * as compression from 'compression';
import Container from 'typedi';
import { createServer, Server } from 'http';
import { useContainer, createExpressServer } from 'routing-controllers';
import { env } from './config';
import { createDatabaseConnection } from './database';
import { logger } from './utils/logger';

export const app: express.Application = createExpressServer({
    controllers: [`${__dirname}/controllers/*{.js,.ts}`],
    middlewares: [`${__dirname}/middlewares/**/*{.js,.ts}`],
    routePrefix: env.prefix,
    cors: {
        origin: `http://localhost`,
    },
    defaultErrorHandler: false,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// gzip HTTP Content
app.use(
    compression({
        filter: (req: express.Request, res: express.Response): boolean => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        },
    }),
);

/*
let isKeepAlive = true;
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!isKeepAlive) {
        res.set('Connection', 'close');
        logger.warn(`Connection closing for process message recevied SIGINT`);
    }
    next();
});
*/
useContainer(Container);

createDatabaseConnection()
    .then(() => {
        logger.info('Database connected.');

        const httpServer: Server = createServer(app);
        httpServer.listen(env.port, () => {
            if (env.isCluster) process.send('ready');
            app.emit('started');
            logger.info(`Express running on port : ${env.port}`);
        });

        process.on('SIGINT', function () {
            logger.warn(`Express app : Receive SIGINT`);
            //isKeepAlive = false;
            httpServer.close(function (): void {
                logger.warn(`Express closing`);
                process.exit(0);
            });
        });
    })
    .catch(e => {
        logger.error(`Express running failure : ${e}`);
        console.log(e);
    });
