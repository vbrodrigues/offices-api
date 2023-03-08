import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function validatePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash);
}
