// Files are referenced by their storage key (e.g. "offices/<id>/brand/logo.png"),
// which is what gets saved in the database.
export abstract class StorageService {
  // Returns the key the file was stored under
  abstract uploadFile(file: Buffer, filepath: string): Promise<string>;
  //   abstract downloadFile(path: string): Promise<File>;
  abstract deleteFile(filepath: string): Promise<boolean>;
  // Returns a temporary URL to download the file
  abstract signFile(filepath: string): Promise<string>;
}
