import { createClient } from 'redis';
import { env } from 'src/infrastructure/config/env';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {});

export async function connectRedis(): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {}
}
