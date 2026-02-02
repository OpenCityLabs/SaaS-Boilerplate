import { createClient } from 'redis';

const host = process.env.REDIS_HOST || 'localhost';
const port = Number.parseInt(process.env.REDIS_PORT || '6379', 10);
const password = process.env.REDIS_PASSWORD;

let cachedClient: any | null = null;

/**
 * Redis connection singleton
 * Used for caching and session storage
 */
export async function connectToRedis(): Promise<any> {
  // Return cached connection if available
  if (cachedClient && cachedClient.isOpen) {
    return cachedClient;
  }

  // Create new connection with short timeout for health checks
  const client = createClient({
    socket: {
      host,
      port,
      connectTimeout: 2000, // 2 second timeout
    },
    password: password || undefined,
  });

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  await client.connect();

  // Cache the connection
  cachedClient = client;

  return client;
}

/**
 * Get a value from Redis cache
 * @param key Cache key
 * @returns Cached value or null if not found
 */
export async function getCache(key: string): Promise<string | null> {
  const client = await connectToRedis();
  return client.get(key);
}

/**
 * Set a value in Redis cache
 * @param key Cache key
 * @param value Value to cache
 * @param ttl Time to live in seconds (optional)
 */
export async function setCache(
  key: string,
  value: string,
  ttl?: number,
): Promise<void> {
  const client = await connectToRedis();

  if (ttl) {
    await client.setEx(key, ttl, value);
  } else {
    await client.set(key, value);
  }
}

/**
 * Delete a value from Redis cache
 * @param key Cache key
 */
export async function deleteCache(key: string): Promise<void> {
  const client = await connectToRedis();
  await client.del(key);
}

/**
 * Check if a key exists in cache
 * @param key Cache key
 * @returns True if key exists
 */
export async function cacheExists(key: string): Promise<boolean> {
  const client = await connectToRedis();
  const result = await client.exists(key);
  return result === 1;
}

/**
 * Close Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (cachedClient && cachedClient.isOpen) {
    await cachedClient.quit();
    cachedClient = null;
  }
}
