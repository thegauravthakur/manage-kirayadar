import { Request, Response } from 'express';
import { uploadFileToS3 } from '../../utils/S3';
import { sendError } from '../../utils/shared';

export async function uploadFile(request: Request, response: Response) {
    try {
        if (request.file) {
            console.log(request.file);
            await uploadFileToS3(
                request.file.buffer,
                request.file.originalname
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
