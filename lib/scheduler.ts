import { prisma } from '@/lib/db';
import { NotificationType } from '@prisma/client';

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {}

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  // Start the scheduler to check for notifications to send every minute
  start(intervalMs = 60000) {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting notification scheduler...');
    this.isRunning = true;

    this.intervalId = setInterval(async () => {
      await this.processScheduledNotifications();
    }, intervalMs);

    // Process immediately on start
    this.processScheduledNotifications();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Notification scheduler stopped');
    }
  }

  private async processScheduledNotifications() {
    try {
      const now = new Date();

      // Find notifications that should be sent now
      const notificationsToSend = await prisma.notification.findMany({
        where: {
          scheduledAt: {
            lte: now,
          },
          sentAt: null,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

      if (notificationsToSend.length === 0) {
        return;
      }

      console.log(
        `Processing ${notificationsToSend.length} scheduled notifications`
      );

      // Mark them as sent
      const updatePromises = notificationsToSend.map(notification =>
        prisma.notification.update({
          where: { id: notification.id },
          data: {
            sentAt: now,
            updatedAt: now,
          },
        })
      );

      await Promise.all(updatePromises);

      console.log(
        `Successfully sent ${notificationsToSend.length} scheduled notifications`
      );
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  // Get status of the scheduler
  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId !== null,
    };
  }

  // Schedule a mass notification for a specific time
  static async scheduleMassNotification(
    title: string,
    message: string,
    scheduledAt: Date,
    metadata?: any
  ) {
    return await prisma.notification.create({
      data: {
        title,
        message,
        type: 'CAMPAIGN',
        userId: null, // Mass notification
        scheduledAt,
        sentAt: null,
        metadata,
      },
    });
  }

  // Schedule a notification for a specific user
  static async scheduleUserNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    scheduledAt: Date,
    metadata?: any
  ) {
    return await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        scheduledAt,
        sentAt: null,
        metadata,
      },
    });
  }
}

// Auto-start the scheduler in production
if (process.env.NODE_ENV === 'production') {
  const scheduler = NotificationScheduler.getInstance();
  scheduler.start();
}
