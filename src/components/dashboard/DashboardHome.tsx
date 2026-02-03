'use client';

import React, { useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';

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
    <div>
      <TitleBar
        title="What would you like to do?"
        description="Choose an action below to get started with AlignHealthcare.ai"
      />

      {/* Action Cards Grid - 3 columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M3 12h1m8 -9v1m8 8h1M5.6 5.6l.7 .7m12.1 -.7l-.7 .7" />
              <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
              <path d="M9.7 17l4.6 0" />
            </svg>
          )}
          title="Train an AI Model"
          description="Fine-tune healthcare AI models with or without coding! New? We'll walk you through it."
          href="/dashboard/training"
          badge={loading ? '...' : `${modelCount} models`}
        />

        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M3 3v18h18" />
              <path d="M20 18v3" />
              <path d="M16 16v5" />
              <path d="M12 13v8" />
              <path d="M8 16v5" />
              <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" />
            </svg>
          )}
          title="View Benchmarks"
          description="Compare model performance across healthcare evaluation datasets"
          href="/dashboard/benchmarks"
        />

        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="8" r="1" />
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M7 16l3 -3l2 2l3 -3l2 2" />
            </svg>
          )}
          title="Test AI Models"
          description="Explore and test our curated collection of healthcare AI models"
          href="/dashboard/models"
        />

        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            </svg>
          )}
          title="Manage Datasets"
          description="Upload, manage, and version control your training datasets"
          href="/dashboard/datasets"
        />

        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
            </svg>
          )}
          title="Team Members"
          description="Collaborate with your team on AI model training and governance"
          href="/dashboard/team"
        />

        <ActionCard
          icon={(
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
          title="Settings"
          description="Manage your organization profile, billing, and preferences"
          href="/dashboard/settings"
        />
      </div>

      {/* Resource Links */}
      <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Prefer coding from the terminal?
          {' '}
          <a
            href="https://docs.ocl.network"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
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
            className="font-medium text-primary hover:underline"
          >
            SDKs and APIs
          </a>
          !
        </p>
      </div>
    </div>
  );
};
