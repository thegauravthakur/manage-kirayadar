import { Request, Response } from 'express';
import { createTenantProfilePhotoKey, getSignedUrl } from '../../utils/S3';
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
        const url = await getSignedUrl(directory);
        console.log(url);
        res.json({
            data: url ?? fetchGravatar(tenant?.email ?? ''),
            errorMessage: null,
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ data: null, errorMessage: error.message });
    }
}
