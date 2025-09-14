'use client';
import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './notification-item';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationListProps {
  notifications: { _id: string; text: string; isRead: boolean }[];
  hasNewNotifications: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  hasNewNotifications,
}) => {
  // Empty state
  if (!hasNewNotifications) {
    return (
      <div className="px-4 py-8 text-center sm:px-6 sm:py-12">
        <Bell className="mx-auto mb-4 h-10 w-10 text-neutral-500 sm:h-12 sm:w-12" />
        <h3 className="mb-2 text-base font-medium text-white sm:text-lg">
          Nenhuma notificação encontrada
        </h3>
        <p className="text-sm text-neutral-400 sm:text-base">
          Você está tudo atualizado! Verifique novamente mais tarde para novas
          notificações.
        </p>
      </div>
    );
  }

  if (hasNewNotifications) {
    return (
      <ScrollArea className="h-[70vh]  sm:h-[calc(100vh-300px)]">
        <div className="p-3 sm:p-4">
          <ul className="flex flex-col gap-2 sm:gap-3">
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </ul>
        </div>
      </ScrollArea>
    );
  }
  // Notifications list
};
