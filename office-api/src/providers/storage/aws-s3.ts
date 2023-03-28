import * as AWS from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cf = require('aws-cloudfront-sign');

import { StorageService } from './storage';

export class S3StorageService implements StorageService {
  s3: AWS.S3;
  cloudfrontDNS: string;
  signingParams: any;
  constructor() {
    this.s3 = new AWS.S3();
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

    const data = await this.s3.upload(params).promise();

    return data.Location;
  }

  async deleteFile(filepath: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({ Bucket: process.env.AWS_BUCKET, Key: filepath })
        .promise();
    } catch (err) {
      console.log('Error deleting object from AWS S3');
      return false;
    }
    return true;
  }

  async signFile(filepath: string): Promise<string> {
    console.log(this.signingParams);
    return cf.getSignedUrl(
      `${process.env.AWS_CLOUDFRONT_DNS}/${
        filepath.split('amazonaws.com/')[1]
      }`,
      this.signingParams,
    );
  }
}
