import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { verifyToken } from '../utils/jwt';

export function auth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const access_token = authHeader && authHeader.split(' ')[1];
    if (!access_token) return res.sendStatus(401);

    try {
        z.string().parse(access_token);
        const user = verifyToken(access_token);
        if (!user)
            return res.status(401).json({ error: 'unauthorized!', data: null });
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'unauthorized!', data: null });
    }
}
