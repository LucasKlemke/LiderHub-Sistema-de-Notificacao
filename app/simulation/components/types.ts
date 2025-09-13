import { NotificationType } from '@prisma/client';

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface SchedulerStatus {
  scheduler: {
    running: boolean;
    lastRun?: string;
    nextRun?: string;
  };
  timestamp: string;
}

export interface NotificationForm {
  title: string;
  description: string;
  type: NotificationType;
  targetType: 'all' | 'specific';
  targetUserId: string;
  shouldSchedule: 'yes' | 'no';
  scheduledDate: Date | undefined;
}
