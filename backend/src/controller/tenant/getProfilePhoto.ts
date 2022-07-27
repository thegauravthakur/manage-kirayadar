import { Request, Response } from 'express';
import { sendFileFromS3 } from '../../utils/S3';
import { getUserFromToken } from '../../middleware/protected';

export async function getProfilePhoto(req: Request, res: Response) {
    const { tenantId, propertyId, spaceId } = req.body;
    const user = getUserFromToken(req)!;
    const directory = `user/${user.id}/property/${propertyId}/space/${spaceId}/tenant/${tenantId}/profile`;
    sendFileFromS3(res, directory);
}
