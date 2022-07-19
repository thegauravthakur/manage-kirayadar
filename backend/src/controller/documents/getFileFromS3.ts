import { Request, Response } from 'express';
import { sendFileFromS3 } from '../../utils/S3';
import { sendError } from '../../utils/shared';
import { prismaClient } from '../../utils/server';

export async function getFileFromS3(request: Request, response: Response) {
    try {
        const { documentId, tenantId } = request.body;
        const document = await prismaClient.document.findFirst({
            where: { id: Number(documentId), tenantId: Number(tenantId) },
        });
        if (document) {
            response.attachment('sample.png');
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
