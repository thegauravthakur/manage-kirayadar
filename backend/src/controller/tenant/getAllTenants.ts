import { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import { checkIfAccessOnSpace } from './addNewTenant';
import { sendError } from '../../utils/shared';

const bodySchema = z.object({
    spaceId: z.number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function getAllTenants(req: Request, res: Response) {
    try {
        bodySchema.parse(req.body);
        const { spaceId } = req.body as unknown as BodySchema;
        const hasAccess = await checkIfAccessOnSpace(req, spaceId);
        if (!hasAccess) return res.status(401).json('unauthorized!');
        const tenants = await prismaClient.tenant.findMany({
            where: { spaceId },
        });
        return res.json({ errorMessage: null, data: { tenants } });
    } catch (error) {
        const message = 'Error occurred while fetching all tenants';
        sendError(res, error, message);
    }
}
