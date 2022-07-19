import type { Response } from 'express';
import S3, { GetObjectOutput } from 'aws-sdk/clients/s3';
import type { Body } from 'aws-sdk/clients/s3';
import { env } from './shared';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;

const Bucket = env === 'development' ? 'manage-kirayadar-dev' : '';
export async function uploadFileToS3(
    Body: Body,
    Key: string
): Promise<SendData> {
    return new Promise((resolve, reject) => {
        const s3 = new S3();
        s3.upload({ Key, Body, Bucket }, function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}

export function sendFileFromS3(res: Response, key: string) {
    const s3 = new S3();
    s3.getObject({ Key: key, Bucket }).createReadStream().pipe(res);
}
