import { Cache } from 'cache-manager';

// Drops every cached project list of the office (keys vary by filters) and,
// when given, the cached details of one project. Call after anything that
// changes what GET /projects or GET /projects/:id return.
export async function invalidateProjectsCache(
  cacheManager: Cache,
  office_id: string,
  project_id?: string,
) {
  const listKeys: string[] = await cacheManager.store.keys(
    `projects-${office_id}-*`,
  );

  await Promise.all(listKeys.map((key) => cacheManager.del(key)));

  if (project_id) {
    await cacheManager.del(`project-${office_id}-${project_id}`);
  }
}
