import { Request, Response } from 'express';
import { createTenantProfilePhotoKey, uploadFileToS3 } from '../../utils/S3';
import { string, z } from 'zod';
import { getUserFromToken } from '../../middleware/protected';
import { getFileExtension } from '../../utils/shared';

const bodySchema = z.object({
    spaceId: string(),
    tenantId: string(),
    propertyId: string(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function updateProfilePhoto(req: Request, res: Response) {
    const user = getUserFromToken(req);
    const file = req.file;
    if (file && user) {
        const { tenantId } = req.body as BodySchema;
        const directory = createTenantProfilePhotoKey(tenantId);
        await uploadFileToS3(file.buffer, directory, file.mimetype);
        return res.json({ data: null, errorMessage: null });
    }
    return res.json({ data: null, errorMessage: null });
}
