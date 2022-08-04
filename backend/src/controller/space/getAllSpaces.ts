import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { isRequestingCorrectProperty } from './addNewSpace';
import { sendError } from '../../utils/shared';

const propertySchema = z.object({
    propertyId: z.number(),
});

type PropertySchema = z.infer<typeof propertySchema>;

export async function getAllSpaces(req: Request, res: Response) {
    try {
        propertySchema.parse(req.body);
        const { propertyId } = req.body as PropertySchema;
        const hasAccess = await isRequestingCorrectProperty(req, propertyId);
        if (!hasAccess)
            return res
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        const spaces = await prismaClient.space.findMany({
            where: { propertyId },
            include: { tenants: true },
        });
        const filteredSpaces = spaces.map(({ tenants, ...rest }) => ({
            ...rest,
            totalTenants: tenants.length,
        }));
        return res.json({
            errorMessage: null,
            data: { spaces: filteredSpaces },
        });
    } catch (error) {
        const message = 'Error occurred while creating a new space';
        sendError(res, error, message);
    }
}
