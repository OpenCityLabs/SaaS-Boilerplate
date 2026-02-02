import { NextResponse } from 'next/server';

import { connectToFalkorDB } from '@/libs/falkordb';
import { connectToDatabase } from '@/libs/mongodb';
import { connectToRedis } from '@/libs/redis';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint
 * Tests connections to MongoDB, FalkorDB, and Redis
 *
 * @returns JSON with status of all services
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: { status: 'unknown', message: '' },
      falkordb: { status: 'unknown', message: '' },
      redis: { status: 'unknown', message: '' },
    },
  };

  // Test MongoDB connection
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    health.services.mongodb = {
      status: 'healthy',
      message: 'Connected successfully',
    };
  } catch (error: any) {
    health.status = 'unhealthy';
    health.services.mongodb = {
      status: 'unhealthy',
      message: error.message || 'Connection failed',
    };
  }

  // Test FalkorDB connection (optional - may not be running)
  try {
    if (process.env.FALKORDB_HOST) {
      const client = await connectToFalkorDB();
      await client.ping();
      health.services.falkordb = {
        status: 'healthy',
        message: 'Connected successfully',
      };
    } else {
      health.services.falkordb = {
        status: 'disabled',
        message: 'FALKORDB_HOST not configured',
      };
    }
  } catch (error: any) {
    health.services.falkordb = {
      status: 'unhealthy',
      message: error.message || 'Connection failed',
    };
  }

  // Test Redis connection (optional - may not be running)
  try {
    if (process.env.REDIS_HOST) {
      const client = await connectToRedis();
      await client.ping();
      health.services.redis = {
        status: 'healthy',
        message: 'Connected successfully',
      };
    } else {
      health.services.redis = {
        status: 'disabled',
        message: 'REDIS_HOST not configured',
      };
    }
  } catch (error: any) {
    health.services.redis = {
      status: 'unhealthy',
      message: error.message || 'Connection failed',
    };
  }

  // Determine overall health status
  const hasUnhealthyService = Object.values(health.services).some(
    service => service.status === 'unhealthy',
  );

  if (hasUnhealthyService) {
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
