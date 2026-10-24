import { Cache } from 'cache-manager';

// Drops every cached project list of the office (keys vary by filters) and,
// when given, the cached details of one project. Call after anything that
// changes what GET /projects or GET /projects/:id return.
export async function invalidateProjectsCache(
  cacheManager: Cache,
  office_id: string,
  project_id?: string,
) {
  // The in-memory store's keys() takes no pattern: it lists every key
  const prefix = `projects-${office_id}-`;
  const listKeys = ((await cacheManager.store.keys()) as string[]).filter(
    (key) => key.startsWith(prefix),
  );

  await Promise.all(listKeys.map((key) => cacheManager.del(key)));

  if (project_id) {
    await cacheManager.del(`project-${office_id}-${project_id}`);
  }
}
