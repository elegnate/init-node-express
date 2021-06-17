import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

/**
 * Express Application Error Handler
 */
@Service()
@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction): void {
        logger.error(
            `Middelware Handler - ${req.method} ${req.url}\n${JSON.stringify(req.body)}\n${error}`,
        );
        const message = {
            code: error.httpCode || 500,
            name: error.name,
            message: error.message,
            errors: [],
        };
        if ('errors' in error) {
            for (const e of error.errors) {
                const constraints =
                    'constraints' in e
                        ? Object.keys(e.constraints || {}).map(k => e.constraints[k])
                        : [];
                message.errors.push({
                    property: e.property || '',
                    constraints: constraints,
                });
            }
        }

        res.status(message.code).send(message);
        next(error);
    }
}
