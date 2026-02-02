import { NextResponse } from 'next/server';

import { connectToRedis, deleteCache, getCache, setCache } from '@/libs/redis';

export const dynamic = 'force-dynamic';

/**
 * Redis connection test endpoint
 * Tests Redis connection and basic cache operations
 */
export async function GET() {
  try {
    // Check if Redis is configured
    if (!process.env.REDIS_HOST) {
      return NextResponse.json(
        {
          status: 'disabled',
          message: 'Redis is not configured (REDIS_HOST not set)',
        },
        { status: 200 },
      );
    }

    const client = await connectToRedis();

    // Test connection with ping
    const pong = await client.ping();

    // Test basic cache operations
    const testKey = 'test:health-check';
    const testValue = `test-${Date.now()}`;

    // Set a value
    await setCache(testKey, testValue, 60); // 60 seconds TTL

    // Get the value back
    const retrievedValue = await getCache(testKey);

    // Delete the test value
    await deleteCache(testKey);

    // Verify it's deleted
    const deletedValue = await getCache(testKey);

    const cacheTestPassed
      = retrievedValue === testValue && deletedValue === null;

    return NextResponse.json({
      status: 'success',
      message: 'Redis connection successful',
      ping: pong,
      cacheTest: {
        passed: cacheTestPassed,
        set: testValue,
        retrieved: retrievedValue,
        afterDelete: deletedValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Redis connection failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
