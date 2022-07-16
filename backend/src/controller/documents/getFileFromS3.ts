import { Request, Response } from 'express';
import { sendFileFromS3 } from '../../utils/S3';
import { sendError } from '../../utils/shared';

export function getFileFromS3(request: Request, response: Response) {
    try {
        response.attachment('sample.png');
        sendFileFromS3(response);
    } catch (error) {
        const message = 'Error occurred while uploading the file';
        sendError(response, error, message);
    }
}
