import { Request, Response } from 'express';
import { createTenantProfilePhotoKey, sendFileFromS3 } from '../../utils/S3';

export async function getProfilePhoto(req: Request, res: Response) {
    try {
        const { tenantId } = req.body;
        const directory = createTenantProfilePhotoKey(tenantId);
        sendFileFromS3(res, directory);
    } catch (error) {
        console.log(error);
        res.status(400).json({ data: null, errorMessage: '' });
    }
}
