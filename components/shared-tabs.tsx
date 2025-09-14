'use client';
import React from 'react';

export interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface SharedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showCounts?: boolean;
  className?: string;
}

export const SharedTabs: React.FC<SharedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showCounts = false,
  className = '',
}) => {
  return (
    <div className={`mb-6 border-b  lg:mb-8 ${className}`}>
      <nav className="-mb-px flex">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`
              flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium transition-colors
              sm:flex-none sm:px-6 sm:text-base
              ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'hover:border-border/50 border-transparent text-neutral-400 hover:text-neutral-300'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="truncate">{label}</span>
              {showCounts && count !== undefined && (
                <span className="flex-shrink-0 rounded-full bg-neutral-700 px-2 py-1 text-xs text-neutral-300">
                  {count}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};
