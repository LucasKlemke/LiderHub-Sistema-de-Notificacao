import React from 'react';
import { NotificationType } from '@prisma/client';
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Settings,
  Info,
} from 'lucide-react';

/**
 * Get the appropriate icon for a notification type
 */
export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MENTION:
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case NotificationType.SUPPORT:
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case NotificationType.PLAN_EXPIRY:
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case NotificationType.SYSTEM:
      return <Settings className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

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
