import { Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';

const bodySchema = z.object({
    spaceId: z.number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function getAllTenants(req: Request, res: Response) {
    bodySchema.parse(req.body);
    const { spaceId } = req.body as unknown as BodySchema;
    const tenants = await prismaClient.tenant.findMany({ where: { spaceId } });
    return res.json({ errorMessage: null, data: { tenants } });
}
