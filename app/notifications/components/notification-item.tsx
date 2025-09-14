'use client';
import React, { useState } from 'react';
import {
  formatTime,
  getTypeLabel,
  getTypeBadgeColor,
  getNotificationEmoji,
} from '@/lib/notification-utils';
import { Notification, User } from '@prisma/client';
import { NotificationModal } from './notification-modal';
import { useWindowSize } from 'usehooks-ts';

interface NotificationItemProps {
  notification: Notification & { user: User };
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = width < 768; // Tailwind's md breakpoint
  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors sm:gap-4 sm:p-4 ${
          !notification.isRead
            ? 'border-l-4 border-blue-500 bg-neutral-800'
            : 'border-l border-transparent bg-neutral-800/50'
        } hover:bg-neutral-700`}
      >
        {/* Icon/Emoji with unread indicator */}
        <div className="relative flex-shrink-0">
          <div className="text-lg sm:text-xl">
            {getNotificationEmoji(notification.type)}
          </div>
          {/* Blue dot indicator for unread */}
          {!notification.isRead && (
            <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-blue-400/50 bg-blue-500 sm:h-3 sm:w-3"></div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              {/* Type badge and status */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(notification.type)}`}
                >
                  {getTypeLabel(notification.type)}
                </span>
                {!notification.isRead ? (
                  <span className="text-xs font-medium text-blue-400">
                    Nova!
                  </span>
                ) : (
                  <span className="text-xs text-neutral-500">Lida</span>
                )}
              </div>

              {/* Notification title */}
              <p
                className={`text-sm font-medium sm:text-base ${
                  !notification.isRead ? 'text-white' : 'text-neutral-300'
                }`}
              >
                {notification.title}
              </p>

              {/* Notification message */}
              <p className="mt-1 truncate text-sm text-neutral-400 sm:text-base">
                {notification.message}
              </p>

              {/* User info and timestamp */}
              <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-500 sm:flex-row sm:items-center sm:gap-2 sm:text-sm">
                {notification.userId && (
                  <span className="font-medium">
                    Para: {notification.user?.name || 'Usuário Desconhecido'}
                  </span>
                )}
                <span
                  className={
                    notification.userId
                      ? 'sm:before:mx-1 sm:before:content-["•"]'
                      : ''
                  }
                >
                  {formatTime(
                    new Date(
                      notification.scheduledAt ||
                        notification.sentAt ||
                        notification.createdAt
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationModal
        notification={notification}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};
