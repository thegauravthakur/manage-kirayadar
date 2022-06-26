import { Request, Response } from 'express';
import { z } from 'zod';
import { verifyToken } from '../../utils/jwt';

export function currentUser(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const access_token = authHeader && authHeader.split(' ')[1];
    if (!access_token) return res.sendStatus(401);

    try {
        z.string().parse(access_token);
        const user = verifyToken(access_token);
        if (!user)
            return res.status(401).json({ error: 'unauthorized!', data: null });
        const { iat, exp, ...filteredUser } = user as any;
        return res.json({ data: { user: filteredUser }, error: null });
    } catch (error) {
        return res.status(401).json({ error: 'unauthorized!', data: null });
    }
}
