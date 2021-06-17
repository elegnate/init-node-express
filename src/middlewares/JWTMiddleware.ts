import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpError } from 'routing-controllers';
import { env } from '../config';
import { UserModel } from '../models/UserModel';

export const generateAuthToken = (user: UserModel): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                id: user.id,
                name: user.name,
                auth: user.auth,
                loginAt: new Date(),
            },
            env.jwtSecret,
            {
                algorithm: 'HS256',
                expiresIn: '30m',
                issuer: 'seco',
            },
            (e, token: string) => {
                if (e) reject(e);
                resolve(token);
            },
        );
    });
};

const extractAuthToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};

export const compareAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    const token: string = extractAuthToken(req);

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        const tokenBody = typeof payload === 'string' ? JSON.parse(payload as string) : payload;

        res.locals.jwtPayload = tokenBody;
        res.locals.token = token;
    } catch (e) {
        throw new HttpError(401, 'INVALID_TOKEN');
    }
    next();
};
