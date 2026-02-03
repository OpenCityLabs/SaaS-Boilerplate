'use client';

import React, { useEffect, useState } from 'react';

import { ActionCard } from './ActionCard';

export const DashboardHome: React.FC = () => {
  const [modelCount, setModelCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available model count from registry
    fetch('/api/training/models/count')
      .then(res => res.json())
      .then((data) => {
        setModelCount(data.count || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching model count:', err);
        setModelCount(36); // Fallback to known count
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16 lg:px-12">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
            Welcome to AlignHealthcare.ai
          </h1>
          <p className="text-xl text-muted-foreground">
            What do you want to do?
          </p>
        </div>

        {/* Action Cards Grid - 3 columns, 2 rows */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            icon="🧠"
            title="Train an AI Model"
            description="Fine-tune healthcare AI models with or without coding! New? We'll walk you through it!"
            href="/dashboard/training"
            badge={loading ? '...' : `${modelCount} models`}
          />

          <ActionCard
            icon="📊"
            title="View Healthcare Benchmarks"
            description="Compare model performance across healthcare evaluation datasets"
            href="/dashboard/benchmarks"
          />

          <ActionCard
            icon="🤖"
            title="Test Our AI Models"
            description="Explore and test our curated collection of healthcare AI models"
            href="/dashboard/models"
          />

          <ActionCard
            icon="📁"
            title="Manage My Datasets"
            description="Upload, manage, and version control your training datasets"
            href="/dashboard/datasets"
          />

          <ActionCard
            icon="👥"
            title="Invite Team Members"
            description="Collaborate with your team on AI model training and governance"
            href="/dashboard/team"
          />

          <ActionCard
            icon="⚙️"
            title="Organization Settings"
            description="Manage your organization profile, billing, and preferences"
            href="/dashboard/settings"
          />
        </div>

        {/* Resource Links */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Prefer coding from the terminal?
            {' '}
            <a
              href="https://docs.ocl.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              Check out our documentation
            </a>
            {' '}
            or explore our
            {' '}
            <a
              href="https://github.com/opencitylabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              SDKs and APIs
            </a>
            !
          </p>
        </div>
      </div>
    </div>
  );
};
