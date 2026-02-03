'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BenchmarkProgress } from '@/features/benchmarks/BenchmarkProgress';
import { BenchmarkResults } from '@/features/benchmarks/BenchmarkResults';
import { BenchmarkSelector } from '@/features/benchmarks/BenchmarkSelector';
import { ModelSelector } from '@/features/benchmarks/ModelSelector';
import { TitleBar } from '@/features/dashboard/TitleBar';

export type BenchmarkCategory = 'medical' | 'academic' | 'bigbio';
export type BenchmarkSubcategory = 'qa' | 'ner' | 're' | 'similarity' | 'classification';

export type SelectedBenchmarks = {
  categories: BenchmarkCategory[];
  subcategories: BenchmarkSubcategory[];
  individual: number[];
};

export type BenchmarkRun = {
  id: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  total: number;
  results?: any[];
  startedAt: Date;
  completedAt?: Date;
};

const BenchmarksPage = () => {
  const t = useTranslations('Benchmarks');
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<SelectedBenchmarks>({
    categories: [],
    subcategories: [],
    individual: [],
  });
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [sampleLimit, setSampleLimit] = useState<number>(100);
  const [currentRun, setCurrentRun] = useState<BenchmarkRun | null>(null);
  const [pastRuns, setPastRuns] = useState<BenchmarkRun[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBenchmarks = async () => {
    if (!selectedModel) {
      // TODO: Replace with toast notification
      console.error('Please select a model');
      return;
    }

    if (
      selectedBenchmarks.categories.length === 0
      && selectedBenchmarks.subcategories.length === 0
      && selectedBenchmarks.individual.length === 0
    ) {
      // TODO: Replace with toast notification
      console.error('Please select at least one benchmark');
      return;
    }

    setIsRunning(true);

    try {
      const response = await fetch('/api/benchmarks/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          benchmarks: selectedBenchmarks,
          model: selectedModel,
          limit: sampleLimit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start benchmark run');
      }

      const run = await response.json();
      setCurrentRun({
        id: run.id,
        status: 'running',
        progress: 0,
        total: run.total,
        startedAt: new Date(),
      });

      // Poll for progress
      const pollInterval = setInterval(async () => {
        const progressResponse = await fetch(`/api/benchmarks/progress/${run.id}`);
        const progressData = await progressResponse.json();

        setCurrentRun(prev => prev
          ? {
              ...prev,
              progress: progressData.progress,
              status: progressData.status,
              results: progressData.results,
              completedAt: progressData.status === 'completed' ? new Date() : undefined,
            }
          : null);

        if (progressData.status === 'completed' || progressData.status === 'failed') {
          clearInterval(pollInterval);
          setIsRunning(false);

          if (progressData.status === 'completed') {
            setPastRuns(prev => [
              {
                id: run.id,
                status: 'completed',
                progress: progressData.progress,
                total: run.total,
                results: progressData.results,
                startedAt: new Date(progressData.startedAt),
                completedAt: new Date(),
              },
              ...prev,
            ]);
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Error running benchmarks:', error);
      setIsRunning(false);
      // TODO: Replace with toast notification
      console.error('Failed to run benchmarks. Please try again.');
    }
  };

  return (
    <>
      <TitleBar
        title={t('title')}
        description={t('description')}
      />

      <div className="space-y-6">
        {/* Selection Panel */}
        <div className="rounded-lg bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">{t('select_benchmarks')}</h2>

          <BenchmarkSelector
            selected={selectedBenchmarks}
            onChange={setSelectedBenchmarks}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="model">{t('select_model')}</Label>
              <ModelSelector
                value={selectedModel}
                onChange={setSelectedModel}
              />
            </div>

            <div>
              <Label htmlFor="limit">{t('sample_limit')}</Label>
              <Input
                id="limit"
                type="number"
                value={sampleLimit}
                onChange={e => setSampleLimit(Number(e.target.value))}
                min={1}
                max={1000}
                placeholder="100"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleRunBenchmarks}
              disabled={isRunning || !selectedModel}
              className="w-full md:w-auto"
              size="lg"
            >
              {isRunning ? t('running') : t('run_benchmarks')}
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        {currentRun && (
          <BenchmarkProgress run={currentRun} />
        )}

        {/* Results Section */}
        {(currentRun?.results || pastRuns.length > 0) && (
          <BenchmarkResults
            currentRun={currentRun}
            pastRuns={pastRuns}
          />
        )}
      </div>
    </>
  );
};

export default BenchmarksPage;
