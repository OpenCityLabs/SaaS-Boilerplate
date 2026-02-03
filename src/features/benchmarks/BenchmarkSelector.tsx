'use client';

import { useTranslations } from 'next-intl';

import type { BenchmarkCategory, BenchmarkSubcategory, SelectedBenchmarks } from '@/app/[locale]/(auth)/dashboard/benchmarks/page';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type BenchmarkSelectorProps = {
  selected: SelectedBenchmarks;
  onChange: (selected: SelectedBenchmarks) => void;
};

const MEDICAL_BENCHMARKS = [
  { id: 1, name: 'PubMedQA', description: 'Medical question answering' },
  { id: 2, name: 'MedHallu', description: 'Medical hallucination detection' },
  { id: 3, name: 'MedCalc-Bench', description: 'Medical calculations' },
  { id: 4, name: 'EHRSQL', description: 'EHR SQL queries' },
];

const ACADEMIC_BENCHMARKS = [
  { id: 5, name: 'MMLU', description: 'Massive multitask language understanding' },
  { id: 6, name: 'HellaSwag', description: 'Commonsense reasoning' },
  { id: 7, name: 'TruthfulQA', description: 'Truthfulness evaluation' },
  { id: 8, name: 'PIQA', description: 'Physical commonsense' },
  { id: 9, name: 'WinoGrande', description: 'Commonsense reasoning' },
  { id: 10, name: 'ARC', description: 'Science questions' },
  { id: 11, name: 'OpenBookQA', description: 'Open book QA' },
  { id: 12, name: 'BoolQ', description: 'Boolean questions' },
  { id: 13, name: 'COPA', description: 'Causal reasoning' },
  { id: 14, name: 'SIQA', description: 'Social reasoning' },
];

const BIGBIO_CATEGORIES = {
  qa: { name: 'Question Answering', count: 3, icon: '❓' },
  ner: { name: 'Named Entity Recognition', count: 1, icon: '🏷️' },
  re: { name: 'Relation Extraction', count: 2, icon: '🔗' },
  similarity: { name: 'Semantic Similarity', count: 1, icon: '🔍' },
  classification: { name: 'Document Classification', count: 1, icon: '📋' },
};

export function BenchmarkSelector({ selected, onChange }: BenchmarkSelectorProps) {
  const t = useTranslations('BenchmarkSelector');

  const toggleCategory = (category: BenchmarkCategory) => {
    const categories = selected.categories.includes(category)
      ? selected.categories.filter(c => c !== category)
      : [...selected.categories, category];

    onChange({ ...selected, categories });
  };

  const toggleSubcategory = (subcategory: BenchmarkSubcategory) => {
    const subcategories = selected.subcategories.includes(subcategory)
      ? selected.subcategories.filter(s => s !== subcategory)
      : [...selected.subcategories, subcategory];

    onChange({ ...selected, subcategories });
  };

  const toggleIndividual = (id: number) => {
    const individual = selected.individual.includes(id)
      ? selected.individual.filter(i => i !== id)
      : [...selected.individual, id];

    onChange({ ...selected, individual });
  };

  const isCategorySelected = (category: BenchmarkCategory) => selected.categories.includes(category);
  const isSubcategorySelected = (subcategory: BenchmarkSubcategory) => selected.subcategories.includes(subcategory);
  const isIndividualSelected = (id: number) => selected.individual.includes(id);

  return (
    <div className="space-y-4">
      {/* Quick Selection Badges */}
      <div>
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          {t('quick_select')}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={isCategorySelected('medical') ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => toggleCategory('medical')}
          >
            🏥 Medical (4)
          </Badge>
          <Badge
            variant={isCategorySelected('academic') ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => toggleCategory('academic')}
          >
            📚 Academic (10)
          </Badge>
          <Badge
            variant={isCategorySelected('bigbio') ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => toggleCategory('bigbio')}
          >
            🧬 BigBIO (20)
          </Badge>
        </div>
      </div>

      {/* BigBIO Subcategories */}
      <div>
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          {t('bigbio_subcategories')}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BIGBIO_CATEGORIES).map(([key, value]) => (
            <Badge
              key={key}
              variant={isSubcategorySelected(key as BenchmarkSubcategory) ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 text-xs"
              onClick={() => toggleSubcategory(key as BenchmarkSubcategory)}
            >
              {value.icon}
              {' '}
              {value.name}
              {' '}
              (
              {value.count}
              )
            </Badge>
          ))}
        </div>
      </div>

      {/* Detailed Selection */}
      <div>
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          {t('detailed_selection')}
        </div>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="medical">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                🏥 Medical Benchmarks
                <Badge variant="secondary" className="text-xs">
                  {MEDICAL_BENCHMARKS.filter(b => isIndividualSelected(b.id)).length}
                  {' '}
                  /
                  {MEDICAL_BENCHMARKS.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {MEDICAL_BENCHMARKS.map(benchmark => (
                  <div
                    key={benchmark.id}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      isIndividualSelected(benchmark.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    }`}
                    onClick={() => toggleIndividual(benchmark.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleIndividual(benchmark.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          [
                          {benchmark.id}
                          ]
                          {' '}
                          {benchmark.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {benchmark.description}
                        </div>
                      </div>
                      {isIndividualSelected(benchmark.id) && (
                        <div className="text-primary">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="academic">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                📚 Academic Benchmarks
                <Badge variant="secondary" className="text-xs">
                  {ACADEMIC_BENCHMARKS.filter(b => isIndividualSelected(b.id)).length}
                  {' '}
                  /
                  {ACADEMIC_BENCHMARKS.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {ACADEMIC_BENCHMARKS.map(benchmark => (
                  <div
                    key={benchmark.id}
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      isIndividualSelected(benchmark.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    }`}
                    onClick={() => toggleIndividual(benchmark.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleIndividual(benchmark.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          [
                          {benchmark.id}
                          ]
                          {' '}
                          {benchmark.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {benchmark.description}
                        </div>
                      </div>
                      {isIndividualSelected(benchmark.id) && (
                        <div className="text-primary">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bigbio">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                🧬 BigBIO Benchmarks
                <Badge variant="secondary" className="text-xs">20 available</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 text-sm text-muted-foreground">
                {t('bigbio_info')}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Selection Summary */}
      <div className="rounded-md bg-muted p-4">
        <div className="text-sm font-medium">{t('selection_summary')}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          {selected.categories.length > 0 && (
            <div>
              Categories:
              {selected.categories.join(', ')}
            </div>
          )}
          {selected.subcategories.length > 0 && (
            <div>
              Subcategories:
              {selected.subcategories.join(', ')}
            </div>
          )}
          {selected.individual.length > 0 && (
            <div>
              Individual:
              {selected.individual.length}
              {' '}
              selected
            </div>
          )}
          {selected.categories.length === 0
          && selected.subcategories.length === 0
          && selected.individual.length === 0 && (
            <div>{t('none_selected')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
