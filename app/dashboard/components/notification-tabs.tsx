'use client';
import React from 'react';

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: 'all', label: 'Todas' },
  { key: 'read', label: 'Lidas' },
  { key: 'unread', label: 'Não lidas' },
];

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-8  border-b">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`cursor-pointer border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-muted-foreground/80 border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};
