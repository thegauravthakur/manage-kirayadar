import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { getUserFromToken } from '../middleware/protected';
import { prismaClient } from './server';

export function signToken(payload: any) {
    return jwt.sign(payload, process.env.TOKEN_SECRET!, {
        expiresIn: '7 days',
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET!, {});
}

export async function hasAccessOnSpaceAndProperty(
    req: Request,
    propertyId: number,
    spaceId: number
) {
    const user = getUserFromToken(req)!;
    const property = await prismaClient.property.findFirst({
        where: { ownerId: user.id, id: propertyId },
    });
    if (!property) return null;
    const space = await prismaClient.space.findFirst({
        where: { propertyId: propertyId, id: spaceId },
    });
    return !!space;
}
