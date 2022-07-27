import { Request, Response } from 'express';
import {
    createTenantDocumentKey,
    createTenantProfilePhotoKey,
    deleteFileFromS3,
    uploadFileToS3,
} from '../../utils/S3';
import { getFileExtension, sendError } from '../../utils/shared';
import { getUserFromToken } from '../../middleware/protected';
import { z } from 'zod';
import { hasAccessOnTenant } from '../../utils/jwt';
import { prismaClient } from '../../utils/server';

function safeFileName(name: string) {
    return name
        .split('')
        .map((c) => {
            if (c === '/') return '-';
            return c;
        })
        .join('');
}

const bodySchema = z.object({
    name: z.string().min(2, 'minimum length of document name should be 2'),
    spaceId: z.string(),
    tenantId: z.string(),
    propertyId: z.string(),
});

type BodySchema = z.infer<typeof bodySchema>;

async function checkIfAlreadyExists(
    tenantId: number,
    safeName: string,
    s3Key: string
) {
    const document = await prismaClient.document.findFirst({
        where: { tenantId: tenantId, name: safeName },
    });
    if (document) {
        await deleteFileFromS3(s3Key);
        await prismaClient.document.delete({
            where: { id: document.id },
        });
    }
}

async function createDocument(name: string, tenantId: number) {
    await prismaClient.document.create({ data: { name, tenantId } });
}

export async function uploadFile(request: Request, response: Response) {
    try {
        bodySchema.parse(request.body);
        const { name, tenantId } = request.body as BodySchema;
        const hasAccess = hasAccessOnTenant(request, Number(tenantId));
        if (!hasAccess) {
            response
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        }
        const safeName = safeFileName(name); //todo: encode this thing
        const path = createTenantDocumentKey(tenantId, safeName);
        if (request.file) {
            const { buffer, mimetype } = request.file;
            // first checkIf file already exists!
            await checkIfAlreadyExists(Number(tenantId), safeName, path);
            await uploadFileToS3(buffer, path, mimetype);
            await createDocument(safeName, Number(tenantId));
            return response.json({ errorMessage: null, data: null });
        } else {
            return response
                .status(400)
                .json({ errorMessage: 'no image chosen', data: null });
        }
    } catch (error) {
        const message = 'Error occurred while uploading the file';
        sendError(response, error, message);
    }
}
