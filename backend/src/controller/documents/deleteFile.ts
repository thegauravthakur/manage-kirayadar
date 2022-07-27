import type { Request, Response } from 'express';
import { z } from 'zod';
import { prismaClient } from '../../utils/server';
import {
    createTenantDocumentKey,
    createTenantProfilePhotoKey,
    deleteFileFromS3,
} from '../../utils/S3';
import { hasAccessOnDocument } from '../../utils/jwt';
import { sendError } from '../../utils/shared';

const bodySchema = z.object({
    documentId: z.number({ required_error: 'documentId is required' }),
    tenantId: z.number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function deleteFile(req: Request, res: Response) {
    try {
        bodySchema.parse(req.body);
        const { documentId, tenantId } = req.body as BodySchema;
        const hasAccess = hasAccessOnDocument(req, Number(documentId));
        if (!hasAccess)
            return res
                .status(401)
                .json({ data: null, errorMessage: 'unauthorized!' });
        const document = await prismaClient.document.findUnique({
            where: { id: Number(documentId) },
        });
        if (document) {
            const path = createTenantDocumentKey(tenantId, document.name);
            await deleteFileFromS3(path);
            await prismaClient.document.delete({
                where: { id: Number(documentId) },
            });
            return res.json({ error: null, data: null });
        }
        return res.status(400).json('bad request!');
    } catch (error) {
        const message = 'error occurred while ';
        sendError(res, error, message);
    }
}
