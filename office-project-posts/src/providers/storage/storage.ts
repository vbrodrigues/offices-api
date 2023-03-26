export abstract class StorageService {
  abstract uploadFile(file: Buffer, filepath: string): Promise<string>;
  //   abstract downloadFile(path: string): Promise<File>;
  abstract deleteFile(filepath: string): Promise<boolean>;
}
