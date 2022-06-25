import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { verifyToken } from '../utils/jwt';

export function auth(req: Request, res: Response, next: NextFunction) {
    const { access_token } = req.cookies;
    try {
        z.string().parse(access_token);
        const isAuthenticated = verifyToken(access_token);
        if (!isAuthenticated)
            return res.status(401).send(['user not authenticated!']);
        next();
    } catch (error) {
        return res.status(401).send(['user not authenticated!']);
    }
}
