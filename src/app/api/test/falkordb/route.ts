import { NextResponse } from 'next/server';

import { connectToFalkorDB, getGraphStats } from '@/libs/falkordb';

export const dynamic = 'force-dynamic';

/**
 * FalkorDB connection test endpoint
 * Tests FalkorDB connection and returns graph info
 */
export async function GET() {
  try {
    // Check if FalkorDB is configured
    if (!process.env.FALKORDB_HOST) {
      return NextResponse.json(
        {
          status: 'disabled',
          message: 'FalkorDB is not configured (FALKORDB_HOST not set)',
        },
        { status: 200 },
      );
    }

    const client = await connectToFalkorDB();

    // Test connection with ping
    const pong = await client.ping();

    // Get graph stats
    let graphInfo = null;
    try {
      graphInfo = await getGraphStats();
    } catch {
      // Graph may not exist yet, which is okay
      graphInfo = { message: 'Graph not initialized yet' };
    }

    return NextResponse.json({
      status: 'success',
      message: 'FalkorDB connection successful',
      ping: pong,
      graphName: process.env.FALKORDB_GRAPH_NAME,
      graphInfo,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'FalkorDB connection failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
