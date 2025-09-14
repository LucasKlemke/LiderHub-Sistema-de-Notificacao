'use client';
import React from 'react';
import { SharedTabs, type Tab } from '@/components/shared-tabs';

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
}

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

  const tabs: Tab[] = [
    { key: 'unread', label: 'Não lidas', count: getTabCount('unread') },
    { key: 'read', label: 'Lidas', count: getTabCount('read') },
  ];

  return (
    <SharedTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      showCounts={true}
    />
  );
};
