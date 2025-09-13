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

const NotificationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
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
    <div className="min-h-screen ">
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsRead={markAsRead}
          isMarkingAsRead={markAsReadMutation.isPending}
        />
      )}

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold ">Notifications</h1>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                {markAllAsReadMutation.isPending
                  ? 'Marcando todas...'
                  : `Marcar todas como lidas (${unreadCount})`}
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        {/* Tabs */}
        <NotificationTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Notifications List */}
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

        {/* Pagination */}
        {!loading && (
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
