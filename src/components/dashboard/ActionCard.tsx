'use client';

import Link from 'next/link';
import React from 'react';

export type ActionCardProps = {
  icon: React.ReactNode;
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
        h-full rounded-xl border border-border bg-card p-5
        transition-all duration-200
        ${disabled
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer hover:border-primary hover:shadow-lg'
    }
      `}
    >
      <div className="flex h-full flex-col">
        <div className="size-12 rounded-lg bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 p-2 [&_svg]:stroke-white [&_svg]:stroke-2">
          {icon}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-lg font-bold">{title}</div>
          {badge !== undefined && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {badge}
            </span>
          )}
        </div>

        <div className="my-3 w-8 border-t border-blue-400" />

        <div className="text-sm text-muted-foreground">{description}</div>

        {disabled && (
          <div className="mt-auto pt-4 text-center">
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
