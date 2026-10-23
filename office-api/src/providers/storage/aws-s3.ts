import * as AWS from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cf = require('aws-cloudfront-sign');

import { StorageService } from './storage';

// How long a signed download URL stays valid
const SIGNED_URL_TTL_MS = 30 * 60 * 1000;
// How long a presigned upload URL stays valid, in seconds
const UPLOAD_URL_TTL_S = 15 * 60;

// Rows saved before keys were stored hold the full S3 URL
// (https://<bucket>.s3.<region>.amazonaws.com/<key>); accept both.
function toKey(filepath: string): string {
  return filepath.includes('amazonaws.com/')
    ? filepath.split('amazonaws.com/')[1]
    : filepath;
}

export class S3StorageService implements StorageService {
  s3: AWS.S3;
  cloudfrontDNS: string;
  signingParams: any;
  constructor() {
    // Presigned URLs otherwise come out with the legacy SigV2 signature
    this.s3 = new AWS.S3({ signatureVersion: 'v4' });
    this.signingParams = {
      keypairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID,
      privateKeyPath: process.env.AWS_CLOUDFRONT_KEY_PATH,
      keyGroupId: process.env.AWS_CLOUDFRONT_KEY_GROUP_ID,
    };
  }

  async uploadFile(file: Buffer, filepath: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filepath,
      Body: file,
    };

    await this.s3.upload(params).promise();

    return filepath;
  }

  async deleteFile(filepath: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({ Bucket: process.env.AWS_BUCKET, Key: toKey(filepath) })
        .promise();
    } catch (err) {
      console.log('Error deleting object from AWS S3');
      return false;
    }
    return true;
  }

  async getUploadUrl(filepath: string, contentType: string): Promise<string> {
    // The browser must send the same Content-Type header, or S3 rejects the
    // signature
    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_BUCKET,
      Key: filepath,
      ContentType: contentType,
      Expires: UPLOAD_URL_TTL_S,
    });
  }

  async exists(filepath: string): Promise<boolean> {
    try {
      await this.s3
        .headObject({ Bucket: process.env.AWS_BUCKET, Key: toKey(filepath) })
        .promise();
    } catch (err) {
      return false;
    }
    return true;
  }

  async signFile(filepath: string): Promise<string> {
    const signedUrl = cf.getSignedUrl(
      `${process.env.AWS_CLOUDFRONT_DNS}/${toKey(filepath)}`,
      // The library default is only 30 seconds
      { ...this.signingParams, expireTime: Date.now() + SIGNED_URL_TTL_MS },
    );

    return signedUrl;
  }
}
