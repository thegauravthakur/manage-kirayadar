import jwt from 'jsonwebtoken';

export function signToken(payload: any) {
    return jwt.sign(payload, process.env.TOKEN_SECRET!, {
        expiresIn: '2 days',
    });
}
