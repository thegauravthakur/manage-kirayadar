import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { verifyToken } from '../utils/jwt';
import { User } from '../types';

export function getUserFromToken(req: Request) {
    const authHeader = req.headers['authorization'];
    const access_token = authHeader && authHeader.split(' ')[1];
    if (!access_token) return null;
    try {
        z.string().parse(access_token);
        const user = verifyToken(access_token);
        if (!user) return null;
        return user as User;
    } catch (error) {
        return null;
    }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await getUserFromToken(req);
        if (!user)
            return res.status(401).json({ error: 'unauthorized!', data: null });
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'unauthorized!', data: null });
    }
}
