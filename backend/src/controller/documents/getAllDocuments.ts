import type { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { hasAccessOnTenant } from '../../utils/jwt';

const bodySchema = z.object({
    tenantId: z.string(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function getAllDocuments(req: Request, res: Response) {
    const { tenantId } = req.body as BodySchema;
    const hasAccess = await hasAccessOnTenant(req, Number(tenantId));
    if (!hasAccess)
        res.status(401).json({ data: null, errorMessage: 'unauthorized!' });
    const documents = await prismaClient.document.findMany({
        where: { tenantId: Number(tenantId) },
        select: { name: true, id: true },
    });
    res.json({ data: { documents }, errorMessage: null });
}
