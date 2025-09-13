'use client';
import React from 'react';

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
}

const tabs = [
  { key: 'unread', label: 'Não lidas' },
  { key: 'read', label: 'Lidas' },
  // { key: 'all', label: 'Todas' },
];

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onTabChange,
  totalNotifications,
  unreadCount,
  readCount,
}) => {
  const getTabCount = (tabKey: string) => {
    switch (tabKey) {
      case 'all':
        return totalNotifications;
      case 'read':
        return readCount;
      case 'unread':
        return unreadCount;
      default:
        return 0;
    }
  };

  return (
    <div className="mb-6 border-b border-neutral-700 lg:mb-8">
      <nav className="-mb-px flex">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`
              flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium transition-colors
              sm:flex-none sm:px-6 sm:text-base
              ${
                activeTab === key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="truncate">{label}</span>
              <span className="flex-shrink-0 rounded-full bg-neutral-700 px-2 py-1 text-xs text-neutral-300">
                {getTabCount(key)}
              </span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};
