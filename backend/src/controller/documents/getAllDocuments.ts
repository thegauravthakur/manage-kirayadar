import type { Request, Response } from 'express';
import { prismaClient } from '../../utils/server';
import { z } from 'zod';
import { hasAccessOnTenant } from '../../utils/jwt';
import { sendError } from '../../utils/shared';

const bodySchema = z.object({
    tenantId: z.number({ required_error: 'tenantId is required' }),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function getAllDocuments(req: Request, res: Response) {
    try {
        bodySchema.parse(req.body);
        const { tenantId } = req.body as BodySchema;
        const hasAccess = await hasAccessOnTenant(req, tenantId);
        if (!hasAccess)
            res.status(401).json({ data: null, errorMessage: 'unauthorized!' });
        const documents = await prismaClient.document.findMany({
            where: { tenantId: tenantId },
            select: { name: true, id: true },
        });
        res.json({ data: { documents }, errorMessage: null });
    } catch (error) {
        const message = 'error occurred while fetching all documents';
        sendError(res, error, message);
    }
}
