'use client';

import Link from 'next/link';
import React from 'react';

export type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  disabled?: boolean;
};

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  href,
  onClick,
  badge,
  disabled = false,
}) => {
  const cardContent = (
    <div
      className={`
        h-full min-h-[280px] rounded-lg border-2 bg-white p-4
        text-center transition-all duration-200
        ${disabled
      ? 'cursor-not-allowed border-gray-300 opacity-60'
      : 'cursor-pointer border-border hover:scale-[1.02] hover:border-primary hover:shadow-lg'
    }
      `}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-4 text-6xl">{icon}</div>
        <div className="mb-4 flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold leading-tight text-foreground">
            {title}
          </h3>
          {badge !== undefined && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-base text-muted-foreground">
          {description}
        </p>
        {disabled && (
          <div className="mt-auto pt-4">
            <span className="text-xs italic text-gray-500">Coming soon</span>
          </div>
        )}
      </div>
    </div>
  );

  if (disabled) {
    return cardContent;
  }

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="h-full"
    >
      {cardContent}
    </div>
  );
};
