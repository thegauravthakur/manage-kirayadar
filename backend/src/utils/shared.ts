import { Response } from 'express';
import { z } from 'zod';
import { CorsOptions } from 'cors';
import * as Sentry from '@sentry/node';

export function sendError(res: Response, error: unknown, errorMessage: string) {
    if (error instanceof z.ZodError) {
        res.status(400).json({
            errorMessage: error.issues[0].message,
            data: null,
        });
    } else {
        Sentry.captureException(error);
        res.status(500).json({ errorMessage, data: null });
    }
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
    'https://manage-kirayadar.herokuapp.com',
];
export const corsOptions: CorsOptions = {
    origin: whitelist,
};
