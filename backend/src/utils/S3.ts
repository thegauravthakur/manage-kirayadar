import type { Response } from 'express';
import S3, { GetObjectOutput } from 'aws-sdk/clients/s3';
import type { Body } from 'aws-sdk/clients/s3';
import { env } from './shared';

const Bucket = env === 'development' ? 'manage-kirayadar-dev' : '';
export async function uploadFileToS3(Body: Body, Key: string) {
    return new Promise((resolve, reject) => {
        const s3 = new S3();
        s3.upload({ Key, Body, Bucket }, function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}

export function sendFileFromS3(res: Response) {
    const s3 = new S3();
    s3.getObject({ Key: 'house-image.jpg', Bucket })
        .createReadStream()
        .pipe(res);
}
