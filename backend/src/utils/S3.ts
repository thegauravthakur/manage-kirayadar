import type { Response } from 'express';
import S3 from 'aws-sdk/clients/s3';
import type { Body } from 'aws-sdk/clients/s3';
import { env } from './shared';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import SendData = ManagedUpload.SendData;
const signedUrlExpireSeconds = 60 * 60 * 24;

//todo: update this to prod one
const Bucket = env === 'development' ? 'manage-kirayadar-dev' : 'kirayedaar';

export async function uploadFileToS3(
    Body: Body,
    Key: string,
    mimeType: string
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

export function sendFileFromS3(
    res: Response,
    Key: string,
    errorData?: unknown
) {
    const s3 = new S3();
    s3.getObject({ Key, Bucket })
        .on('httpHeaders', function (statusCode, headers) {
            res.set('Content-Length', headers['content-length']);
            res.set('Content-Type', headers['content-type']);
        })
        .createReadStream()
        .on('error', () => {
            return res
                .status(400)
                .json({ data: errorData, errorMessage: null });
        })
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

export function createTenantProfilePhotoKey(tenantId: string | number) {
    return `tenants/${tenantId}/profile`;
}

export function createTenantDocumentKey(
    tenantId: string | number,
    documentName: string
) {
    return `tenants/${tenantId}/documents/${documentName}`;
}

export async function getSignedUrl(Key: string): Promise<string | null> {
    try {
        const s3 = new S3({ signatureVersion: 'v4', region: 'ap-south-1' });
        // throw error if key doesn't exist
        await s3.headObject({ Bucket, Key }).promise();
        return s3.getSignedUrl('getObject', {
            Bucket: Bucket,
            Key: Key,
            Expires: signedUrlExpireSeconds,
        });
    } catch (error: any) {
        return null;
    }
}
