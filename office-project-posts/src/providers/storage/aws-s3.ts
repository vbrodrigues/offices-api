import * as AWS from 'aws-sdk';
import { StorageService } from './storage';

export class S3StorageService implements StorageService {
  s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3();
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
}
