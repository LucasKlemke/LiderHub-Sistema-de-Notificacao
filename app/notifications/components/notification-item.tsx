'use client';
import React from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';

interface NotificationItemProps {
  notification: { _id: string; text: string; isRead: boolean };
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  return (
    <>
      <div
        onClick={() => {
          markAsRead({ id: notification._id });
        }}
        className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors sm:gap-4 sm:p-4 ${
          !notification.isRead
            ? 'border-l-4 border-blue-500 bg-neutral-800'
            : 'border-l border-transparent bg-neutral-800/50'
        } hover:bg-neutral-700`}
      >
        {/* Icon/Emoji with unread indicator */}
        <div className="relative flex-shrink-0">
          <div className="text-lg sm:text-xl">🔔</div>
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
                ``{' '}
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
                {notification.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
