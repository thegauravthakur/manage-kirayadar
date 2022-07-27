import { Request, Response } from 'express';
import { createTenantProfilePhotoKey, sendFileFromS3 } from '../../utils/S3';
import { createHash } from 'crypto';
import { prismaClient } from '../../utils/server';

function fetchGravatar(email: string) {
    const hash = createHash('md5').update(email).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=150`;
}

export async function getProfilePhoto(req: Request, res: Response) {
    try {
        const { tenantId } = req.body;
        const tenant = await prismaClient.tenant.findUnique({
            where: { id: Number(tenantId) },
        });
        const directory = createTenantProfilePhotoKey(tenantId);
        sendFileFromS3(res, directory, fetchGravatar(tenant?.email ?? ''));
    } catch (error) {
        console.log(error);
        res.status(400).json({ data: null, errorMessage: '' });
    }
}
