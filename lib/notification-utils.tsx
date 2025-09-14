import { NotificationType } from '@prisma/client';

/**
 * Format time relative to now (e.g., "2h ago", "5m ago")
 */
export const formatTime = (date: Date | string) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diff = now.getTime() - targetDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return targetDate.toLocaleDateString('pt-BR');
};

/**
 * Get the Portuguese label for notification types
 */
export const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MENTION:
      return 'Menção';
    case NotificationType.SUPPORT:
      return 'Suporte';
    case NotificationType.PLAN_EXPIRY:
      return 'Plano';
    case NotificationType.SYSTEM:
      return 'Sistema';
    default:
      return 'Notificação';
  }
};

/**
 * Get the badge color classes for notification types
 */
export const getTypeBadgeColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MENTION:
      return 'bg-purple-100 text-purple-800';
    case NotificationType.SUPPORT:
      return 'bg-yellow-100 text-yellow-800';
    case NotificationType.PLAN_EXPIRY:
      return 'bg-destructive text-destructive-foreground';
    case NotificationType.SYSTEM:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get emoji icon for notification types
 */
export const getNotificationEmoji = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MENTION:
      return '📌';
    case NotificationType.SUPPORT:
      return '⛨';
    case NotificationType.PLAN_EXPIRY:
      return '🚨';
    case NotificationType.SYSTEM:
      return '🤖';
    default:
      return '🔔';
  }
};
