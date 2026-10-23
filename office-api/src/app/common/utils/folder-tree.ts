import { ProjectFolder } from '@prisma/client';

type FolderNode = Pick<ProjectFolder, 'id' | 'parent_id'>;

// Ids of the folder and everything under it, from a project's flat folder list
export function folderWithDescendants(
  folders: FolderNode[],
  folder_id: string,
): string[] {
  const ids = [folder_id];

  // ids grows while it is walked, so every level gets visited
  for (let i = 0; i < ids.length; i++) {
    for (const folder of folders) {
      if (folder.parent_id === ids[i]) {
        ids.push(folder.id);
      }
    }
  }

  return ids;
}

// Key for "folders/files directly inside this parent" lookups
export function parentKey(parent_id: string | null | undefined): string {
  return parent_id ?? 'root';
}
