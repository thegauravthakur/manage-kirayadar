import { Request, Response } from 'express';
import { sendFileFromS3 } from '../../utils/S3';
import { sendError } from '../../utils/shared';
import { prismaClient } from '../../utils/server';
import { number, z } from 'zod';
import { hasAccessOnDocument, hasAccessOnTenant } from '../../utils/jwt';

const bodySchema = z.object({
    documentId: number({ required_error: 'documentId is required' }),
    tenantId: number({ required_error: 'tenantId is required' }),
});

type BodySchema = z.infer<typeof bodySchema>;

export async function getFileFromS3(request: Request, response: Response) {
    try {
        bodySchema.parse(request.body);
        const { documentId, tenantId } = request.body as BodySchema;
        const hasAccess =
            (await hasAccessOnTenant(request, tenantId)) &&
            (await hasAccessOnDocument(request, documentId));
        if (!hasAccess) {
            return response
                .status(401)
                .json({ data: null, errorMessage: 'unauthorized!' });
        }
        const document = await prismaClient.document.findFirst({
            where: { id: Number(documentId), tenantId: Number(tenantId) },
        });
        if (document) {
            response.attachment(document.key.split('/').at(-1));
            sendFileFromS3(response, document.key);
        } else
            response
                .status(400)
                .json({ errorMessage: 'wrong request', data: null });
    } catch (error) {
        const message = 'Error occurred while fetching the file';
        sendError(response, error, message);
    }
}
