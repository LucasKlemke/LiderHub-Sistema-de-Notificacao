'use client';
import React from 'react';
import { X, Calendar, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/lib/hooks/useNotifications';
import { getNotificationIcon, formatTime } from '@/lib/notification-utils';

interface NotificationModalProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
  onMarkAsRead,
  isMarkingAsRead = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getNotificationIcon(notification.type)}
            <h2 className="text-xl font-semibold">{notification.title}</h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">{notification.message}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatTime(notification.createdAt)}
            </div>
            {notification.user && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {notification.user.name}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {!notification.isRead && (
              <Button
                onClick={() => {
                  onMarkAsRead(notification.id);
                  onClose();
                }}
                disabled={isMarkingAsRead}
                className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isMarkingAsRead ? 'Marcando...' : 'Marcar como lida'}
              </Button>
            )}
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
