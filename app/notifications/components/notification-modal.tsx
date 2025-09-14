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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { getNotificationEmoji, formatTime } from '@/lib/notification-utils';
import { User, Notification } from '@prisma/client';

interface NotificationModalProps {
  notification: Notification & { user: User };
  open: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const NotificationContent: React.FC<{
  notification: Notification & { user: User };
  onClose: () => void;
  className?: string;
  isMobile?: boolean;
}> = ({ notification, onClose, className, isMobile }) => {
  const handleMarkAsRead = () => {
    // onMarkAsRead(notification.id);
    onClose();
  };

  return (
    <div className={className}>
      <div className="space-y-4 text-left">
        <p>{notification.message}</p>

        <div className="flex items-center gap-4 text-sm">
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

      <div className="flex gap-2 pt-4">
        {!notification.isRead && (
          <Button
            onClick={handleMarkAsRead}
            className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <Check className="h-4 w-4" />
            Marcar como lida
          </Button>
        )}

        {!isMobile && (
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        )}
      </div>
    </div>
  );
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  open,
  onClose,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={isOpen => !isOpen && onClose()}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-3">
              {getNotificationEmoji(notification.type)}
              {notification.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4">
            <NotificationContent
              isMobile={isMobile}
              notification={notification}
              onClose={onClose}
            />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getNotificationEmoji(notification.type)}
            {notification.title}
          </DialogTitle>
          <DialogDescription asChild>
            <NotificationContent
              notification={notification}
              onClose={onClose}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
