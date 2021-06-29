import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpError } from 'routing-controllers';
import { env } from '../config';
import { UserModel } from '../models/UserModel';

export interface ITokenBody {
    id: string;
    name: string;
    auth: string;
    loginAt: Date;
}

export const generateAuthToken = (user: UserModel): Promise<string> => {
    return new Promise((resolve, reject) => {
        const body: ITokenBody = {
            id: user.id,
            name: user.name,
            auth: user.auth,
            loginAt: new Date(),
        };
        jwt.sign(
            body,
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

export const getAuthTokenBody = (req: Request, throwing = false): ITokenBody => {
    const token: string = extractAuthToken(req);
    try {
        const payload = jwt.verify(token, env.jwtSecret, { issuer: 'seco' });
        return typeof payload === 'string' ? JSON.parse(payload as string) : payload;
    } catch (e) {
        if (throwing) throw e;
    }
    return null;
};

export const compareAuthToken = (req: Request, res: Response, next: NextFunction = null): void => {
    try {
        const tokenBody: ITokenBody = getAuthTokenBody(req, true);
        res.locals.jwtPayload = tokenBody;
        res.locals.token = extractAuthToken(req);
    } catch (e) {
        throw new HttpError(401, 'INVALID_TOKEN');
    }
    if (next) next();
};
