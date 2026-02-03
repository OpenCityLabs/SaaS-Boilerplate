'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { BenchmarkRun } from '@/app/[locale]/(auth)/dashboard/benchmarks/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

type BenchmarkResultsProps = {
  currentRun: BenchmarkRun | null;
  pastRuns: BenchmarkRun[];
};

type BenchmarkResult = {
  benchmark: string;
  model: string;
  score: number;
  accuracy: number;
  total: number;
  timestamp: string;
};

export function BenchmarkResults({ currentRun, pastRuns }: BenchmarkResultsProps) {
  const t = useTranslations('BenchmarkResults');
  const [showHistory, setShowHistory] = useState(false);

  // Flatten results from all runs
  const allResults: BenchmarkResult[] = [
    ...(currentRun?.results || []),
    ...(showHistory ? pastRuns.flatMap(run => run.results || []) : []),
  ];

  const columns: ColumnDef<BenchmarkResult>[] = [
    {
      accessorKey: 'benchmark',
      header: t('benchmark'),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('benchmark')}</div>
      ),
    },
    {
      accessorKey: 'model',
      header: t('model'),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('model')}</Badge>
      ),
    },
    {
      accessorKey: 'score',
      header: t('score'),
      cell: ({ row }) => {
        const score = Number.parseFloat(row.getValue('score'));
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {score.toFixed(2)}
              %
            </span>
            {score >= 90 && <span className="text-green-500">🟢</span>}
            {score >= 70 && score < 90 && <span className="text-yellow-500">🟡</span>}
            {score < 70 && <span className="text-red-500">🔴</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'accuracy',
      header: t('accuracy'),
      cell: ({ row }) => {
        const accuracy = row.getValue('accuracy') as number;
        const total = row.getValue('total') as number;
        return (
          <span className="text-sm text-muted-foreground">
            {accuracy}
            {' '}
            /
            {total}
          </span>
        );
      },
    },
    {
      accessorKey: 'total',
      header: () => null,
      cell: () => null,
    },
    {
      accessorKey: 'timestamp',
      header: t('timestamp'),
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp') as string;
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </span>
        );
      },
    },
  ];

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(allResults, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `benchmark-results-${new Date().toISOString()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'csv') {
      const headers = ['Benchmark', 'Model', 'Score', 'Accuracy', 'Total', 'Timestamp'];
      const csvContent = [
        headers.join(','),
        ...allResults.map(r =>
          [
            r.benchmark,
            r.model,
            r.score,
            r.accuracy,
            r.total,
            r.timestamp,
          ].join(',')),
      ].join('\n');

      const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
      const exportFileDefaultName = `benchmark-results-${new Date().toISOString()}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="rounded-lg bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? t('hide_history') : t('show_history')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={allResults.length === 0}
          >
            {t('export_csv')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json')}
            disabled={allResults.length === 0}
          >
            {t('export_json')}
          </Button>
        </div>
      </div>

      {allResults.length > 0
        ? (
            <DataTable columns={columns} data={allResults} />
          )
        : (
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                {t('no_results')}
              </p>
            </div>
          )}
    </div>
  );
}
