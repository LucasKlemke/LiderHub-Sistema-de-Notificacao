'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCheck, Settings, Bell } from 'lucide-react';
import { NotificationItem } from './notification-item';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

interface NotificationPanelProps {
  userId: string;
  onNotificationRead: () => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({
  userId,
  onNotificationRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?userId=${userId}&limit=20`
      );
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      onNotificationRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/bulk-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      onMarkAllRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="border-accent mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground mt-2">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-4">
        <div>
          <h3 className="text-foreground font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <p className="text-muted-foreground text-sm">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-accent hover:text-accent-foreground hover:bg-accent/10"
            >
              <CheckCheck className="mr-1 h-4 w-4" />
              Marcar todas
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Bell className="text-muted-foreground h-8 w-8" />
            </div>
            <h4 className="text-foreground mb-2 font-medium">
              Nenhuma notificação
            </h4>
            <p className="text-muted-foreground text-sm">
              Você está em dia! Não há notificações no momento.
            </p>
          </div>
        ) : (
          <div className="divide-border divide-y">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-3">
            <Button
              variant="ghost"
              className="text-accent hover:text-accent-foreground hover:bg-accent/10 w-full"
            >
              Ver todas as notificações
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
