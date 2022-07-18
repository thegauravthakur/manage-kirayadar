import { Request, Response } from 'express';
import { uploadFileToS3 } from '../../utils/S3';
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

export async function uploadFile(request: Request, response: Response) {
    try {
        bodySchema.parse(request.body);
        const { name, spaceId, tenantId, propertyId } =
            request.body as BodySchema;
        const hasAccess = hasAccessOnTenant(request, Number(tenantId));
        if (!hasAccess) {
            response
                .status(401)
                .json({ errorMessage: 'unauthorized!', data: null });
        }
        const user = getUserFromToken(request)!;
        const path = `user/${user.id}/property/${propertyId}/space/${spaceId}/tenant/${tenantId}/documents`;
        const safeName = safeFileName(name);
        if (request.file) {
            const extension = getFileExtension(request.file.originalname);
            const data = await uploadFileToS3(
                request.file.buffer,
                `${path}/${safeName}.${extension}`
            );
            await prismaClient.document.create({
                data: {
                    name: safeName,
                    tenantId: Number(tenantId),
                    key: data.Key,
                },
            });
            return response.json({
                errorMessage: null,
                data: null,
            });
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
