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

    try {
      this.s3.upload(params, function (err, data) {
        if (err) {
          console.log('Error uploading to AWS S3. Error:', err);
        }
        console.log(data);
      });
    } catch (err) {
      console.log('Error uploading to AWS S3.');
    }

    return filepath;
  }
}
