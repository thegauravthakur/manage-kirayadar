import type { Request, Response } from 'express';
import S3 from 'aws-sdk/clients/s3';
export async function getAllDocuments(req: Request, res: Response) {
    const s3 = new S3();
    s3.listObjects(
        {
            Bucket: 'manage-kirayadar-dev',
            Prefix: 'user/1/property/2/space/18/tenant/3/documents',
        },
        (err, data) => {
            const filter = data.Contents?.map((c) => c.Key);
            res.json(filter);
        }
    );
}
