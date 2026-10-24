interface ProjectWithClient {
  id: string;
  client: { id: string; office_id: string };
}

// Every file of a project is stored under this prefix
export function projectFilesPrefix(project: ProjectWithClient): string {
  return `offices/${project.client.office_id}/clients/${project.client.id}/projects/${project.id}/files/`;
}

// Storage key for a new project file. Only the extension comes from the user,
// sanitized, so the key can't escape the project's prefix.
export function projectFileKey(
  project: ProjectWithClient,
  file_id: string,
  extension: string,
): string {
  const format = (extension || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  return `${projectFilesPrefix(project)}${file_id}${
    format ? `.${format}` : ''
  }`;
}

// "planta.final.DWG" -> "DWG"; "" when the name has no extension
export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1) : '';
}

// Storage key of the media attached to a project post
export function projectPostMediaKey(
  project: ProjectWithClient,
  project_post_id: string,
  extension?: string | null,
): string {
  const format = (extension || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  return `offices/${project.client.office_id}/clients/${
    project.client.id
  }/projects/${project.id}/posts/${project_post_id}/media${
    format ? `.${format}` : ''
  }`;
}
