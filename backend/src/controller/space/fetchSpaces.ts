import { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { isRequestingCorrectProperty } from './addNewSpace';
import { sendError } from '../../utils/shared';

const propertySchema = z.object({
    propertyId: z.number(),
});

type PropertySchema = z.infer<typeof propertySchema>;

export async function fetchSpaces(req: Request, res: Response) {
    try {
        const { spaceId } = req.query;
        propertySchema.parse(req.body);
        const { propertyId } = req.body as PropertySchema;
        const hasAccess = await isRequestingCorrectProperty(req, propertyId);
        if (!hasAccess)
            return res
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        if (!spaceId) {
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
        } else {
            const space = await prismaClient.space.findFirst({
                where: { id: Number(spaceId), propertyId },
                include: { tenants: true },
            });
            if (space) {
                const { tenants, ...rest } = space;
                const finalSpace = { ...rest, totalTenants: tenants.length };
                return res.json({
                    errorMessage: null,
                    data: { space: finalSpace },
                });
            }
            return res.status(401).json({
                errorMessage: 'wrong input provided',
                data: null,
            });
        }
    } catch (error) {
        const message = 'Error occurred while creating a new space';
        sendError(res, error, message);
    }
}
