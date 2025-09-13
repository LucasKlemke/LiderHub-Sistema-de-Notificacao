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
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start gap-3 p-3 sm:gap-4 sm:p-4">
              <Skeleton className="h-8 w-8 rounded-full  sm:h-10 sm:w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded " />
                <Skeleton className="h-3 w-1/2 rounded " />
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
      <div className="px-4 py-8 text-center sm:px-6 sm:py-12">
        <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400 sm:h-12 sm:w-12" />
        <h3 className="mb-2 text-base font-medium text-white sm:text-lg">
          Erro ao carregar notificações
        </h3>
        <p className="mb-4 text-sm text-neutral-400 sm:text-base">
          {error?.message || 'Algo deu errado ao buscar as notificações.'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex items-center gap-2 border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 hover:text-white"
          size="sm"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
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

  // Notifications list
  return (
    <div className="max-h-[70vh] overflow-y-auto sm:max-h-[calc(100vh-300px)]">
      <div className="p-3 sm:p-4">
        <ul className="flex flex-col gap-2 sm:gap-3">
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
      </div>
    </div>
  );
};
