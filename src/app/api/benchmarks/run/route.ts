import { randomUUID } from 'node:crypto';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// In-memory store for benchmark runs (use Redis/database in production)
const benchmarkRuns = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { benchmarks, model, limit } = body;

    // Validate input
    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 },
      );
    }

    if (
      !benchmarks.categories?.length
      && !benchmarks.subcategories?.length
      && !benchmarks.individual?.length
    ) {
      return NextResponse.json(
        { error: 'At least one benchmark must be selected' },
        { status: 400 },
      );
    }

    // Calculate total benchmarks to run
    let total = 0;
    if (benchmarks.categories?.includes('medical')) {
      total += 4;
    }
    if (benchmarks.categories?.includes('academic')) {
      total += 10;
    }
    if (benchmarks.categories?.includes('bigbio')) {
      total += 20;
    }
    if (benchmarks.subcategories?.includes('qa')) {
      total += 3;
    }
    if (benchmarks.subcategories?.includes('ner')) {
      total += 1;
    }
    if (benchmarks.subcategories?.includes('re')) {
      total += 2;
    }
    if (benchmarks.subcategories?.includes('similarity')) {
      total += 1;
    }
    if (benchmarks.subcategories?.includes('classification')) {
      total += 1;
    }
    total += benchmarks.individual?.length || 0;

    // Create run ID
    const runId = randomUUID();

    // Initialize run state
    const run = {
      id: runId,
      status: 'running',
      progress: 0,
      total,
      results: [],
      startedAt: new Date().toISOString(),
      benchmarks,
      model,
      limit,
    };

    benchmarkRuns.set(runId, run);

    // Start async benchmark execution
    executeBenchmarks(runId, benchmarks, model, limit).catch((error) => {
      console.error('Error executing benchmarks:', error);
      const failedRun = benchmarkRuns.get(runId);
      if (failedRun) {
        failedRun.status = 'failed';
        failedRun.error = error.message;
      }
    });

    return NextResponse.json({
      id: runId,
      total,
      message: 'Benchmark run started',
    });
  } catch (error) {
    console.error('Error starting benchmark run:', error);
    return NextResponse.json(
      { error: 'Failed to start benchmark run' },
      { status: 500 },
    );
  }
}

async function executeBenchmarks(
  runId: string,
  benchmarks: any,
  model: string,
  limit: number,
) {
  const run = benchmarkRuns.get(runId);
  if (!run) {
    return;
  }

  try {
    // TODO: Replace with actual call to Python benchmark service
    // const response = await fetch('http://localhost:8082/api/benchmarks/run', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OCL_API_KEY}`,
    //   },
    //   body: JSON.stringify({ benchmarks, model, limit }),
    // });

    // Simulate benchmark execution for demo
    const allBenchmarks = [];

    if (benchmarks.categories?.includes('medical')) {
      allBenchmarks.push(
        { name: 'PubMedQA', category: 'medical' },
        { name: 'MedHallu', category: 'medical' },
        { name: 'MedCalc-Bench', category: 'medical' },
        { name: 'EHRSQL', category: 'medical' },
      );
    }

    if (benchmarks.categories?.includes('academic')) {
      allBenchmarks.push(
        { name: 'MMLU', category: 'academic' },
        { name: 'HellaSwag', category: 'academic' },
        { name: 'TruthfulQA', category: 'academic' },
        { name: 'PIQA', category: 'academic' },
        { name: 'WinoGrande', category: 'academic' },
      );
    }

    if (benchmarks.subcategories?.includes('qa')) {
      allBenchmarks.push(
        { name: 'BigBIO: PubMedQA', category: 'bigbio', subcategory: 'qa' },
        { name: 'BigBIO: MedQA', category: 'bigbio', subcategory: 'qa' },
        { name: 'BigBIO: MEDIQA QA', category: 'bigbio', subcategory: 'qa' },
      );
    }

    if (benchmarks.subcategories?.includes('ner')) {
      allBenchmarks.push(
        { name: 'BigBIO: BC5CDR', category: 'bigbio', subcategory: 'ner' },
      );
    }

    // Execute benchmarks with simulated delays
    for (let i = 0; i < allBenchmarks.length; i++) {
      const benchmark = allBenchmarks[i];
      if (!benchmark) {
        continue;
      }

      // Simulate benchmark execution (2-5 seconds per benchmark)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      // Generate mock result
      const score = 65 + Math.random() * 30; // Random score between 65-95
      const accuracy = Math.floor((score / 100) * limit);

      const result = {
        benchmark: benchmark.name,
        model,
        score,
        accuracy,
        total: limit,
        timestamp: new Date().toISOString(),
      };

      run.results.push(result);
      run.progress = i + 1;

      benchmarkRuns.set(runId, run);
    }

    run.status = 'completed';
    run.completedAt = new Date().toISOString();
    benchmarkRuns.set(runId, run);
  } catch (error) {
    console.error('Error executing benchmarks:', error);
    run.status = 'failed';
    run.error = error instanceof Error ? error.message : 'Unknown error';
    benchmarkRuns.set(runId, run);
  }
}
