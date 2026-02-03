'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type OnboardingStep = 'organization' | 'use-case' | 'data-types' | 'complete';

type OnboardingData = {
  organization_name: string;
  organization_type: string;
  role: string;
  use_cases: string[];
  data_types: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('organization');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    organization_name: '',
    organization_type: '',
    role: '',
    use_cases: [],
    data_types: [],
  });

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to complete onboarding');
        return;
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'organization':
        return (
          <OrganizationStep
            data={onboardingData}
            onChange={setOnboardingData}
            onNext={() => setCurrentStep('use-case')}
          />
        );
      case 'use-case':
        return (
          <UseCaseStep
            data={onboardingData}
            onChange={setOnboardingData}
            onNext={() => setCurrentStep('data-types')}
            onBack={() => setCurrentStep('organization')}
          />
        );
      case 'data-types':
        return (
          <DataTypesStep
            data={onboardingData}
            onChange={setOnboardingData}
            onNext={() => setCurrentStep('complete')}
            onBack={() => setCurrentStep('use-case')}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            onFinish={handleComplete}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <StepIndicator
              label="Organization"
              active={currentStep === 'organization'}
              completed={currentStep !== 'organization'}
            />
            <StepDivider />
            <StepIndicator
              label="Use Case"
              active={currentStep === 'use-case'}
              completed={['data-types', 'complete'].includes(currentStep)}
            />
            <StepDivider />
            <StepIndicator
              label="Data Types"
              active={currentStep === 'data-types'}
              completed={currentStep === 'complete'}
            />
            <StepDivider />
            <StepIndicator
              label="Complete"
              active={currentStep === 'complete'}
              completed={false}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  label,
  active,
  completed,
}: {
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex size-10 items-center justify-center rounded-full border-2 ${
          active
            ? 'border-primary bg-primary text-primary-foreground'
            : completed
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground text-muted-foreground'
        }`}
      >
        {completed
          ? (
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )
          : (
              <span className="text-sm font-medium">●</span>
            )}
      </div>
      <span className="mt-2 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <div className="h-0.5 flex-1 bg-muted" />;
}

function OrganizationStep({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (data: OnboardingData) => void;
  onNext: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tell us about your organization</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This helps us personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="organization_name" className="block text-sm font-medium">
            Organization Name
          </label>
          <input
            id="organization_name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Acme Healthcare"
            value={data.organization_name}
            onChange={e =>
              onChange({ ...data, organization_name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="organization_type" className="block text-sm font-medium">
            Organization Type
          </label>
          <select
            id="organization_type"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={data.organization_type}
            onChange={e =>
              onChange({ ...data, organization_type: e.target.value })}
          >
            <option value="">Select type...</option>
            <option value="hospital">Hospital / Health System</option>
            <option value="clinic">Clinic / FQHC</option>
            <option value="health_plan">Health Plan / Insurer</option>
            <option value="ai_startup">AI Startup</option>
            <option value="research">Research Institution</option>
            <option value="government">Government Agency</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Your Role
          </label>
          <select
            id="role"
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={data.role}
            onChange={e => onChange({ ...data, role: e.target.value })}
          >
            <option value="">Select role...</option>
            <option value="executive">Executive / Leadership</option>
            <option value="engineer">Engineer / Developer</option>
            <option value="data_scientist">Data Scientist / ML Engineer</option>
            <option value="clinician">Clinician / Provider</option>
            <option value="compliance">Compliance / Legal</option>
            <option value="researcher">Researcher</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Next
      </button>
    </form>
  );
}

function UseCaseStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onChange: (data: OnboardingData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const useCases = [
    { id: 'fine_tuning', label: 'Fine-tune AI models', description: 'Train and customize foundation models' },
    { id: 'deployment', label: 'Deploy AI agents', description: 'Deploy models to production' },
    { id: 'governance', label: 'AI governance', description: 'Policy enforcement and compliance' },
    { id: 'benchmarking', label: 'Run benchmarks', description: 'Evaluate model safety and performance' },
    { id: 'collaboration', label: 'Multi-agent collaboration', description: 'Enable AI agents to work together' },
    { id: 'research', label: 'Research', description: 'Academic or clinical research' },
  ];

  const toggleUseCase = (useCaseId: string) => {
    const updated = data.use_cases.includes(useCaseId)
      ? data.use_cases.filter(id => id !== useCaseId)
      : [...data.use_cases, useCaseId];
    onChange({ ...data, use_cases: updated });
  };

  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.use_cases.length === 0) {
      setValidationError('Please select at least one use case');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What will you use AlignHealthcare.ai for?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select all that apply
        </p>
      </div>

      {validationError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {validationError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {useCases.map(useCase => (
          <div
            key={useCase.id}
            onClick={() => toggleUseCase(useCase.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleUseCase(useCase.id);
              }
            }}
            role="checkbox"
            aria-checked={data.use_cases.includes(useCase.id)}
            tabIndex={0}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
              data.use_cases.includes(useCase.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start">
              <div className={`mt-0.5 flex size-5 items-center justify-center rounded border-2 ${
                data.use_cases.includes(useCase.id)
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}
              >
                {data.use_cases.includes(useCase.id) && (
                  <svg
                    className="size-3 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{useCase.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function DataTypesStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: OnboardingData;
  onChange: (data: OnboardingData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [validationError, setValidationError] = useState('');

  const dataTypes = [
    { id: 'clinical_notes', label: 'Clinical Notes', description: 'Physician notes, discharge summaries' },
    { id: 'lab_results', label: 'Lab Results', description: 'Laboratory test data' },
    { id: 'imaging', label: 'Medical Imaging', description: 'X-rays, MRIs, CT scans' },
    { id: 'claims', label: 'Claims Data', description: 'Insurance claims and billing' },
    { id: 'patient_demographics', label: 'Patient Demographics', description: 'Patient information' },
    { id: 'medications', label: 'Medication Data', description: 'Prescription and medication records' },
    { id: 'vital_signs', label: 'Vital Signs', description: 'Heart rate, blood pressure, etc.' },
    { id: 'genomics', label: 'Genomic Data', description: 'Genetic sequencing data' },
  ];

  const toggleDataType = (dataTypeId: string) => {
    const updated = data.data_types.includes(dataTypeId)
      ? data.data_types.filter(id => id !== dataTypeId)
      : [...data.data_types, dataTypeId];
    onChange({ ...data, data_types: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.data_types.length === 0) {
      setValidationError('Please select at least one data type');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What types of data will you work with?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This helps us configure the right compliance controls
        </p>
      </div>

      {validationError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {validationError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {dataTypes.map(dataType => (
          <div
            key={dataType.id}
            onClick={() => toggleDataType(dataType.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDataType(dataType.id);
              }
            }}
            role="checkbox"
            aria-checked={data.data_types.includes(dataType.id)}
            tabIndex={0}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
              data.data_types.includes(dataType.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start">
              <div className={`mt-0.5 flex size-5 items-center justify-center rounded border-2 ${
                data.data_types.includes(dataType.id)
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}
              >
                {data.data_types.includes(dataType.id) && (
                  <svg
                    className="size-3 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{dataType.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dataType.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function CompleteStep({
  onFinish,
  loading,
  error,
}: {
  onFinish: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="size-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold">You're all set!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete your onboarding to access your dashboard
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onFinish}
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Completing...' : 'Complete Onboarding'}
      </button>
    </div>
  );
}
