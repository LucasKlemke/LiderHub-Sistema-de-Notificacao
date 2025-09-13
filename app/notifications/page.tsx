'use client';
import React, { useState } from 'react';
import { Check, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useNotifications,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  type Notification,
} from '@/lib/hooks/useNotifications';
import { NotificationModal } from './components/notification-modal';
import { NotificationTabs } from './components/notification-tabs';
import { NotificationList } from './components/notification-list';
import { Pagination } from './components/pagination';
import Header from '@/components/header';

const NotificationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('unread');
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [expandedNotifications, setExpandedNotifications] = useState(
    new Set<string>()
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Fixed items per page

  // React Query hooks
  const {
    data: notificationsData,
    isLoading: loading,
    error,
    isError,
  } = useNotifications({
    userId: 'user1',
    page: currentPage,
    limit: itemsPerPage,
    readOnly: activeTab === 'read',
    unreadOnly: activeTab === 'unread',
  });

  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  // Extract data from React Query response
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  const totalPages = notificationsData?.pagination?.totalPages || 1;
  const totalNotifications = notificationsData?.pagination?.total || 0;

  // Calculate read count based on total and unread
  const readCount = Math.max(0, totalNotifications - unreadCount);
  const total = totalNotifications;

  // Handle tab change - reset to page 1
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // React Query handles filtering through API parameters
  const filteredNotifications = notifications;

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id, {
      onError: error => {
        console.error('Error marking notification as read:', error);
      },
    });
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate('user1', {
      onError: error => {
        console.error('Error marking all notifications as read:', error);
      },
    });
  };

  const toggleNotificationExpansion = (notificationId: string) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  return (
    <div className="min-h-screen bg-[#1a1b23]">
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsRead={markAsRead}
          isMarkingAsRead={markAsReadMutation.isPending}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <Header title="Notificações" />
        </div>

        {/* Tabs - Mobile Responsive */}
        <NotificationTabs
          activeTab={activeTab}
          totalNotifications={total}
          unreadCount={unreadCount}
          readCount={readCount}
          onTabChange={handleTabChange}
        />

        {/* Mark All as Read Button - Responsive */}
        {!loading && unreadCount > 0 && activeTab === 'unread' && (
          <div className="mb-4 sm:mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="w-full border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white sm:w-auto"
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {/* Notifications List - Responsive Container */}
        <NotificationList
          notifications={filteredNotifications}
          isLoading={loading}
          isError={isError}
          error={error}
          expandedNotifications={expandedNotifications}
          onToggleExpansion={toggleNotificationExpansion}
          onMarkAsRead={markAsRead}
          isMarkingAsRead={markAsReadMutation.isPending}
        />

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalNotifications}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsDashboard;
