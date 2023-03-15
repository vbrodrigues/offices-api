import { Module } from '@nestjs/common';
import { S3StorageService } from './aws-s3';
import { StorageService } from './storage';

@Module({
  providers: [{ provide: StorageService, useClass: S3StorageService }],
  exports: [StorageService],
})
export class StorageModule {}
