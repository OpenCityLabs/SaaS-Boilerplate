import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/libs/mongodb';

export const dynamic = 'force-dynamic';

/**
 * MongoDB connection test endpoint
 * Tests MongoDB connection and returns database info
 */
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Test connection with ping
    await db.command({ ping: 1 });

    // Get database stats
    const stats = await db.stats();

    // List collections
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      database: db.databaseName,
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
      },
      collections: collections.map(col => col.name),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'MongoDB connection failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
