import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { verifyToken } from '../../utils/jwt';

export function currentUser(req: Request, res: Response) {
    const { access_token } = req.cookies;
    try {
        z.string().parse(access_token);
        const user = verifyToken(access_token);
        if (!user) return res.status(401).send({ user: null });
        return res.send({ user });
    } catch (error) {
        return res.status(401).send({ user: null });
    }
}
