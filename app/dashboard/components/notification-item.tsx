'use client';
import React from 'react';

import {
  formatTime,
  getTypeLabel,
  getTypeBadgeColor,
  getNotificationEmoji,
} from '@/lib/notification-utils';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@prisma/client';

interface NotificationItemProps {
  notification: Notification;
  isExpanded: boolean;
  onToggleExpansion: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isExpanded,
  onToggleExpansion,
  onMarkAsRead,
  isMarkingAsRead = false,
}) => {
  return (
    <div
      className={`flex cursor-pointer items-start  gap-3 rounded-lg  p-5 transition-colors ${
        !notification.isRead
          ? ' border-primary bg-secondary border-l-4'
          : 'bg-secondary/50 border-l border-transparent'
      }`}
      onClick={() => onToggleExpansion(notification.id)}
    >
      {/* Icon/Emoji with unread indicator */}
      <div className="relative">
        <div className="text-lg">{getNotificationEmoji(notification.type)}</div>
        {/* Blue dot indicator for unread */}
        {!notification.isRead && (
          <div className="bg-primary border-primary/50 absolute -right-1 -top-1 h-3 w-3 rounded-full border-2"></div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 ">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Type badge */}
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(notification.type)}`}
              >
                {getTypeLabel(notification.type)}
              </span>
              {!notification.isRead ? (
                <span className="text-primary text-xs ">Nova !</span>
              ) : (
                <span className="text-muted-foreground text-xs ">Lida</span>
              )}
            </div>

            {/* Notification title */}
            <p
              className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {notification.title}
            </p>

            {/* User info */}
            <div className="mt-1 flex items-center gap-2">
              {notification.user && (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-muted-foreground text-sm font-medium  `}
                    >
                      Para {notification.user.name || 'Unknown User'}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {formatTime(new Date(notification.createdAt))}
                  </span>
                </>
              )}
              {!notification.user && (
                <span className="text-muted-foreground text-sm">
                  {formatTime(new Date(notification.createdAt))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
