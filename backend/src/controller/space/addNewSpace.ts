import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { getUserFromToken } from '../../middleware/protected';
import { sendError } from '../../utils/shared';

const propertySchema = z.object({
    propertyId: z.number(),
    floor: z.number().min(1, 'total floors should be more than 1'),
    name: z.string().min(1, 'Name is required'),
});

type PropertySchema = z.infer<typeof propertySchema>;

export async function addNewSpace(req: Request, res: Response) {
    try {
        propertySchema.parse(req.body);
        const { propertyId, name, floor } = req.body as PropertySchema;
        const hasAccess = await isRequestingCorrectProperty(req, propertyId);
        if (!hasAccess)
            return res
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        const space = await prismaClient.space.create({
            data: { propertyId, name, floor },
        });
        return res.json({ errorMessage: null, data: { space } });
    } catch (error) {
        const message = 'Error occurred while creating a new space';
        sendError(res, error, message);
    }
}

export async function isRequestingCorrectProperty(
    req: Request,
    propertyId: number
) {
    const user = await getUserFromToken(req)!;
    const property = await prismaClient.property.findUnique({
        where: { id: propertyId },
    });
    if (!property) return false;
    return property.ownerId === user.id;
}
