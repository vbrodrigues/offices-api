import { ProjectFolder } from "@/app/lib/api/office-api/project-folders/dtos";

// Folders directly inside `parent_id` (null = root), in display order
export function childFolders(
  folders: ProjectFolder[],
  parent_id: string | null
): ProjectFolder[] {
  return folders
    .filter((folder) => folder.parent_id === parent_id)
    .sort(
      (a, b) => a.position - b.position || a.name.localeCompare(b.name, "pt-BR")
    );
}

// Folders from the root down to `folder_id`, for breadcrumbs
export function folderPath(
  folders: ProjectFolder[],
  folder_id: string | null
): ProjectFolder[] {
  const path: ProjectFolder[] = [];
  let current = folders.find((folder) => folder.id === folder_id);

  while (current) {
    path.unshift(current);
    const parent_id: string | null = current.parent_id;
    current = folders.find((folder) => folder.id === parent_id);
  }

  return path;
}

// The folder and every folder under it
export function folderWithDescendants(
  folders: ProjectFolder[],
  folder_id: string
): Set<string> {
  const ids = [folder_id];

  for (let i = 0; i < ids.length; i++) {
    folders.forEach((folder) => {
      if (folder.parent_id === ids[i]) ids.push(folder.id);
    });
  }

  return new Set(ids);
}

// "Levantamento › Plantas", or "Projeto" for the root
export function folderLabel(
  folders: ProjectFolder[],
  folder_id: string | null
): string {
  const path = folderPath(folders, folder_id);
  return path.length > 0
    ? path.map((folder) => folder.name).join(" › ")
    : "Raiz do projeto";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
