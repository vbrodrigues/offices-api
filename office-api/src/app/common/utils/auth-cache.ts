import { Cache } from 'cache-manager';

// JwtStrategy keeps each employee's access level and active flag here for a
// few seconds instead of reading them on every request
export const employeeAuthCacheKey = (employee_id: string) =>
  `auth-employee-${employee_id}`;

// Call after anything that changes an employee's access level or is_active,
// so the change applies on the next request instead of after the cache TTL
export async function invalidateEmployeeAuth(
  cacheManager: Cache,
  employee_id: string,
) {
  await cacheManager.del(employeeAuthCacheKey(employee_id));
}
