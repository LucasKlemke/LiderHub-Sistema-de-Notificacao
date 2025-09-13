'use client';
import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Notification } from '@/lib/hooks/useNotifications';
import { NotificationItem } from './notification-item';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  expandedNotifications: Set<string>;
  onToggleExpansion: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  isError,
  error,
  expandedNotifications,
  onToggleExpansion,
  onMarkAsRead,
  isMarkingAsRead = false,
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start gap-4 p-4">
              <Skeleton className="h-10 w-10  rounded-full"></Skeleton>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4  w-3/4 rounded"></Skeleton>
                <Skeleton className="h-3  w-1/2 rounded"></Skeleton>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg  font-medium">
          Error loading notifications
        </h3>
        <p className="text-muted-foreground mb-4">
          {error?.message ||
            'Something went wrong while fetching notifications.'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex items-center gap-2"
        >
          Try again
        </Button>
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-lg  font-medium">No notifications found</h3>
        <p className="text-muted-foreground">
          You're all caught up! Check back later for new notifications.
        </p>
      </div>
    );
  }

  // Notifications list
  return (
    <ScrollArea className=" h-[calc(100vh-300px)] px-4">
      <ul className="flex flex-col gap-3 py-3">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isExpanded={expandedNotifications.has(notification.id)}
            onToggleExpansion={onToggleExpansion}
            onMarkAsRead={onMarkAsRead}
            isMarkingAsRead={isMarkingAsRead}
          />
        ))}
      </ul>
    </ScrollArea>
  );
};
