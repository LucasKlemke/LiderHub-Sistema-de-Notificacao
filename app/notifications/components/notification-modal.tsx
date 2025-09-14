'use client';
import React from 'react';
import { Calendar, User as UserIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getNotificationEmoji, formatTime } from '@/lib/notification-utils';
import { User, Notification } from '@prisma/client';

interface NotificationModalProps {
  notification: Notification & { user: User };
  open: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  open,
  onClose,
}) => {
  const handleMarkAsRead = () => {
    // onMarkAsRead(notification.id);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getNotificationEmoji(notification.type)}
            {notification.title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-left">
              <p className="">{notification.message}</p>

              <div className="flex items-center gap-4 text-sm ">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatTime(notification.createdAt)}
                </div>
                {notification.user && (
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    {notification.user.name}
                  </div>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          {!notification.isRead && (
            <Button
              onClick={() => {
                handleMarkAsRead();
              }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Marcar como lida
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
