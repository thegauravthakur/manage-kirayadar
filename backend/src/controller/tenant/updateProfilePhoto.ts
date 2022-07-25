import { Request, Response } from 'express';
import { uploadFileToS3 } from '../../utils/S3';
import { number, z } from 'zod';
import { getUserFromToken } from '../../middleware/protected';
import { getFileExtension } from '../../utils/shared';

const bodySchema = z.object({
    spaceId: number(),
    tenantId: number(),
    propertyId: number(),
});
type BodySchema = z.infer<typeof bodySchema>;

export async function updateProfilePhoto(req: Request, res: Response) {
    const user = getUserFromToken(req);
    const file = req.file;
    if (file && user) {
        const { spaceId, tenantId, propertyId } = req.body as BodySchema;
        const directory = `user/${user.id}/property/${propertyId}/space/${spaceId}/tenant/${tenantId}/`;
        const path = `profile.${getFileExtension(file.originalname)}`;
        await uploadFileToS3(file.buffer, `${directory}${path}`);
        return res.json({ data: null, errorMessage: null });
    }
    return res.json({ data: null, errorMessage: null });
}
