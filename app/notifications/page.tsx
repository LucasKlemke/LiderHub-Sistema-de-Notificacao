'use client';
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationTabs } from './components/notification-tabs';
import { NotificationList } from './components/notification-list';
import Header from '@/components/header';
import { useWindowSize } from 'usehooks-ts';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const NotificationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('unread');

  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Handle tab change - reset to page 1
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const unreadNotifications = useQuery(
    api.notifications.getUnreadNotifications
  );
  const readNotifications = useQuery(api.notifications.getReadNotifications);

  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );


  const hasNewNotifications = !!unreadNotifications?.length;

  return (
    <div className="min-h-screen bg-[#1a1b23]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <Header title="Notificações" />
        </div>

        {/* Tabs - Mobile Responsive */}
        <NotificationTabs
          activeTab={activeTab}
          totalNotifications={20}
          unreadCount={unreadNotifications?.length || 0}
          readCount={readNotifications?.length || 0}
          onTabChange={handleTabChange}
        />

        {/* Mark All as Read Button - Responsive */}

        <div className="mb-4 sm:mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            className="w-full border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        </div>

        {/* Notifications List - Responsive Container */}
        <NotificationList
          notifications={
            activeTab === 'unread' ? unreadNotifications : readNotifications
          }
          hasNewNotifications={
            activeTab === 'unread' ? hasNewNotifications : true
          }
        />
      </div>
    </div>
  );
};

export default NotificationsDashboard;
