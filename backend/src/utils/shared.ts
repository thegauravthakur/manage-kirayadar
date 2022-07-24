import { Response } from 'express';
import { z } from 'zod';
import { CorsOptions } from 'cors';

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

export function getFileExtension(name: string) {
    let last_dot = name.lastIndexOf('.');
    return name.slice(last_dot + 1);
}

const whitelist = [
    'http://localhost:3000',
    'https://manage-kirayadar.vercel.app',
];
export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin && whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
