import { Notification } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface NotificationUser {
  id: string;
  name: string;
  email: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

interface NotificationsParams {
  userId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

// API functions
const fetchNotifications = async (
  params: NotificationsParams
): Promise<NotificationsResponse> => {
  const searchParams = new URLSearchParams({
    userId: params.userId,
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
  });

  if (params.unreadOnly) {
    searchParams.append('unreadOnly', 'true');
  }

  const response = await fetch(`/api/notifications?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
};

const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
};

const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const response = await fetch('/api/notifications/bulk-read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
};

// React Query hooks
export const useNotifications = (params: NotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => fetchNotifications(params),
    enabled: !!params.userId,
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      // Update all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: NotificationsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map(notification =>
              notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification
            ),
            unreadCount: Math.max(0, oldData.unreadCount - 1),
          };
        }
      );
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        (oldData: NotificationsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData.notifications.map(notification => ({
              ...notification,
              isRead: true,
            })),
            unreadCount: 0,
          };
        }
      );
    },
  });
};

// Export types for use in components
export type {
  Notification,
  NotificationUser,
  NotificationsResponse,
  NotificationsParams,
};
