import { StorageService } from 'src/providers/storage/storage';
import { FullProject } from './project.repository';

type WithAvatar = { avatar?: string | null } | null | undefined;

// Replaces every storage key in a project response (file paths, the client's
// logo, employees' avatars) with a temporary signed URL
export async function signProject(
  project: FullProject,
  storageService: StorageService,
): Promise<FullProject> {
  const sign = async (key: string | null | undefined) =>
    key ? await storageService.signFile(key) : key ?? null;

  const signAvatar = async (employee: WithAvatar) => {
    if (employee?.avatar) employee.avatar = await sign(employee.avatar);
  };

  // Includes nest these employees, which FullProject doesn't type
  const files = project.files as (FullProject['files'][number] & {
    created_by?: WithAvatar;
  })[];
  const steps =
    project.project_steps as (FullProject['project_steps'][number] & {
      assigned?: WithAvatar;
    })[];

  await Promise.all([
    ...files.map(async (file) => {
      file.path = await sign(file.path);
      await signAvatar(file.created_by);
    }),
    ...steps.map((step) => signAvatar(step.assigned)),
    (async () => {
      project.client.logo = await sign(project.client.logo);
    })(),
  ]);

  return project;
}
