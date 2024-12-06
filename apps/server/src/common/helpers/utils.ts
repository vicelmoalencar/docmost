import * as path from 'path';
import * as bcrypt from 'bcrypt';

export const envPath = path.resolve(process.cwd(), '..', '..', '.env');

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswordHash(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

export type RedisConfig = {
  host: string;
  port: number;
  db: number;
  password?: string;
};

export function parseRedisUrl(redisUrl: string): RedisConfig {
  // format - redis[s]://[[username][:password]@][host][:port][/db-number]
  const { hostname, port, password, pathname } = new URL(redisUrl);
  const portInt = parseInt(port, 10);

  let db: number = 0;
  // extract db value if present
  if (pathname.length > 1) {
    const value = pathname.slice(1);
    if (!isNaN(parseInt(value))){
      db = parseInt(value, 10);
    }
  }

  return { host: hostname, port: portInt, password, db };
}

export function createRetryStrategy() {
  return function (times: number): number {
    return Math.max(Math.min(Math.exp(times), 20000), 3000);
  };
}
