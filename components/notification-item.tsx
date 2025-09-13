'use client';

// import { formatDistanceToNow } from "date-fns"
// import { ptBR } from "date-fns/locale"
import {
  MessageSquare,
  Ticket,
  AlertTriangle,
  Megaphone,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'MENTION':
      return MessageSquare;
    case 'TICKET':
      return Ticket;
    case 'PLAN_EXPIRY':
      return AlertTriangle;
    case 'CAMPAIGN':
      return Megaphone;
    case 'SYSTEM':
      return Settings;
    default:
      return Settings;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'MENTION':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    case 'TICKET':
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    case 'PLAN_EXPIRY':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
    case 'CAMPAIGN':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    case 'SYSTEM':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'MENTION':
      return 'Menção';
    case 'TICKET':
      return 'Ticket';
    case 'PLAN_EXPIRY':
      return 'Plano';
    case 'CAMPAIGN':
      return 'Campanha';
    case 'SYSTEM':
      return 'Sistema';
    default:
      return 'Notificação';
  }
};

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);
  const typeLabel = getTypeLabel(notification.type);

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Handle navigation if there's a link in metadata
    if (notification.metadata?.link) {
      window.open(notification.metadata.link, '_blank');
    }
  };

  // const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
  //   addSuffix: true,
  //   locale: ptBR,
  // })

  return (
    <div
      className={cn(
        'hover:bg-muted/50 relative cursor-pointer p-4 transition-colors',
        !notification.isRead && 'bg-accent/5 border-l-accent border-l-2'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 rounded-full p-2', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {typeLabel}
            </Badge>
            {!notification.isRead && (
              <div className="bg-accent h-2 w-2 flex-shrink-0 rounded-full" />
            )}
          </div>

          <h4
            className={cn(
              'mb-1 text-balance text-sm font-medium',
              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {notification.title}
          </h4>

          <p className="text-muted-foreground mb-2 text-pretty text-sm leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            {/* <span className="text-xs text-muted-foreground">{timeAgo}</span> */}

            {notification.metadata?.link && (
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent-foreground hover:bg-accent/10 h-6 px-2 text-xs"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Ver
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
