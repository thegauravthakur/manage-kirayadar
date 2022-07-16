import { Response } from 'express';
import { z } from 'zod';

export function sendError(res: Response, error: unknown, errorMessage: string) {
    if (error instanceof z.ZodError) {
        res.status(400).json({
            errorMessage: error.issues[0].message,
            data: null,
        });
    } else res.status(500).json({ errorMessage, data: null });
}

type ENV = 'development' | 'production';
export const env: 'development' | 'production' =
    (process.env.NODE_ENV as ENV) || 'development';
