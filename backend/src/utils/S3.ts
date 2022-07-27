import type { Response } from 'express';
import S3 from 'aws-sdk/clients/s3';
import type { Body } from 'aws-sdk/clients/s3';
import { env } from './shared';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;

const Bucket = env === 'development' ? 'manage-kirayadar-dev' : '';
export async function uploadFileToS3(
    Body: Body,
    Key: string,
    mimeType?: string
): Promise<SendData> {
    return new Promise((resolve, reject) => {
        const s3 = new S3();
        s3.upload(
            { Key, Body, Bucket, ContentType: mimeType },
            function (err, data) {
                if (err) reject(err);
                resolve(data);
            }
        );
    });
}

export function sendFileFromS3(res: Response, Key: string) {
    const s3 = new S3();
    s3.getObject({ Key, Bucket })
        .on('httpHeaders', function (statusCode, headers) {
            res.set('Content-Length', headers['content-length']);
            res.set('Content-Type', headers['content-type']);
        })
        .createReadStream()
        .pipe(res);
}

export function deleteFileFromS3(Key: string) {
    const s3 = new S3();
    return new Promise((resolve, reject) => {
        s3.deleteObject({ Key, Bucket }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
