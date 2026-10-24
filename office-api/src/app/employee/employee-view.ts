import { Employee } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';

// Employee as sent to the browser: no password hash, avatar as a signed URL
export async function toPublicEmployee<T extends Employee>(
  employee: T,
  storageService: StorageService,
): Promise<Omit<T, 'password'>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = employee;

  return {
    ...rest,
    avatar: employee.avatar
      ? await storageService.signFile(employee.avatar)
      : null,
  };
}

// Stores a new avatar (base64/data URL) and returns its key. A fresh key per
// upload, so a cached signed URL never shows the old picture.
export async function uploadAvatar(
  storageService: StorageService,
  employee: Pick<Employee, 'id' | 'office_id'>,
  encoded: string,
): Promise<string> {
  return await storageService.uploadFile(
    decodeBase64(encoded),
    `offices/${employee.office_id}/employees/${
      employee.id
    }/avatar/${uuid()}.png`,
  );
}
