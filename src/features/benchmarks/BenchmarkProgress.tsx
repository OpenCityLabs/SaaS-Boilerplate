'use client';

import { useTranslations } from 'next-intl';

import type { BenchmarkRun } from '@/app/[locale]/(auth)/dashboard/benchmarks/page';
import { Badge } from '@/components/ui/badge';

type BenchmarkProgressProps = {
  run: BenchmarkRun;
};

export function BenchmarkProgress({ run }: BenchmarkProgressProps) {
  const t = useTranslations('BenchmarkProgress');

  const progressPercentage = run.total > 0 ? (run.progress / run.total) * 100 : 0;

  const getStatusColor = (status: BenchmarkRun['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: BenchmarkRun['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="default" className="bg-blue-500">{t('running')}</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">{t('completed')}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{t('failed')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        {getStatusBadge(run.status)}
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('progress')}
              :
              {run.progress}
              {' '}
              /
              {run.total}
            </span>
            <span className="font-medium">
              {progressPercentage.toFixed(0)}
              %
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-300 ${getStatusColor(run.status)}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time Information */}
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <span className="text-muted-foreground">
              {t('started_at')}
              :
              {' '}
            </span>
            <span className="font-medium">
              {run.startedAt.toLocaleTimeString()}
            </span>
          </div>
          {run.completedAt && (
            <div>
              <span className="text-muted-foreground">
                {t('completed_at')}
                :
                {' '}
              </span>
              <span className="font-medium">
                {run.completedAt.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Running Animation */}
        {run.status === 'running' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-2 animate-pulse rounded-full bg-blue-500" />
            {t('running_message')}
          </div>
        )}

        {/* Completion Message */}
        {run.status === 'completed' && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            ✓
            {' '}
            {t('completed_message')}
          </div>
        )}

        {/* Error Message */}
        {run.status === 'failed' && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            ✗
            {' '}
            {t('failed_message')}
          </div>
        )}
      </div>
    </div>
  );
}
