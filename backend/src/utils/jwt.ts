import jwt from 'jsonwebtoken';

export function signToken(payload: any) {
    return jwt.sign(payload, process.env.TOKEN_SECRET!, {
        expiresIn: '7 days',
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET!);
}
