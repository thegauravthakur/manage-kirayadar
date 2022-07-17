import { Request, Response } from 'express';
import { uploadFileToS3 } from '../../utils/S3';
import { getFileExtension, sendError } from '../../utils/shared';

function safeFileName(name: string) {
    return name
        .split('')
        .map((c) => {
            if (c === '/') return '-';
            return c;
        })
        .join('');
}
export async function uploadFile(request: Request, response: Response) {
    try {
        const { name } = request.body;
        const safeName = safeFileName(name);
        if (request.file) {
            const extension = getFileExtension(safeName);
            await uploadFileToS3(
                request.file.buffer,
                `documents/${safeName}.${extension}`
            );
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
