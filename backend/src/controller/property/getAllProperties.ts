import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { sendError } from '../../utils/shared';
import { getUserFromToken } from '../../middleware/protected';

export async function getAllProperties(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req)!;
        // only return those properties for which current user is the owner
        const properties = await prismaClient.property.findMany({
            where: { ownerId: user.id },
        });
        return res.json({ errorMessage: null, data: { properties } });
    } catch (error) {
        const message = 'An error occurred while fetching all properties';
        sendError(res, error, message);
    }
}
