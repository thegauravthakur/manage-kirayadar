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

export async function hasAccessOnTenant(req: Request, tenantId: number) {
    const user = getUserFromToken(req)!;
    const tenant = await prismaClient.tenant.findUnique({
        where: { id: tenantId },
    });
    if (!tenant) return false;
    const space = await prismaClient.space.findFirst({
        where: { id: tenant.spaceId },
    });
    if (!space) return false;
    const property = await prismaClient.property.findFirst({
        where: { ownerId: user.id, id: space.propertyId },
    });
    return !!property;
}

export async function hasAccessOnDocument(req: Request, documentId: number) {
    const document = await prismaClient.document.findUnique({
        where: { id: Number(documentId) },
    });
    if (!document) return false;
    return hasAccessOnTenant(req, document.tenantId);
}
