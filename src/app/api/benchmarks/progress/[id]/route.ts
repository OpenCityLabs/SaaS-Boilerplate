import { NextResponse } from 'next/server';

// This should match the store in run/route.ts
// In production, use shared Redis/database
// const benchmarkRuns = new Map<string, any>();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // In production, this would be a shared store (Redis/database)
    // For now, we'll return mock data
    // const run = benchmarkRuns.get(id);

    // Mock response for demo
    const run = {
      id,
      status: 'running',
      progress: 3,
      total: 7,
      results: [
        {
          benchmark: 'PubMedQA',
          model: 'claude-3-5-sonnet-20241022',
          score: 87.5,
          accuracy: 175,
          total: 200,
          timestamp: new Date().toISOString(),
        },
        {
          benchmark: 'MedHallu',
          model: 'claude-3-5-sonnet-20241022',
          score: 92.3,
          accuracy: 185,
          total: 200,
          timestamp: new Date().toISOString(),
        },
        {
          benchmark: 'MMLU',
          model: 'claude-3-5-sonnet-20241022',
          score: 84.1,
          accuracy: 168,
          total: 200,
          timestamp: new Date().toISOString(),
        },
      ],
      startedAt: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    };

    if (!run) {
      return NextResponse.json(
        { error: 'Benchmark run not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    console.error('Error fetching benchmark progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benchmark progress' },
      { status: 500 },
    );
  }
}
