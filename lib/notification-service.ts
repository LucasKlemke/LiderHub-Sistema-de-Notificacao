import { prisma } from '@/lib/db';
import type { NotificationType } from '@prisma/client';

export interface CreateNotificationData {
  title: string;
  message?: string;
  description?: string; // Aceita description como alias para message
  type: NotificationType;
  userId?: string;
  targetType?: 'all' | 'specific';
  scheduledAt?: Date;
  scheduledDate?: Date; // Aceita scheduledDate como alias para scheduledAt
  metadata?: any;
}

export class NotificationService {
  // Create a single notification (simplified)
  static async create(data: CreateNotificationData) {
    // Usar description como message se fornecido
    const message = data.description || data.message;

    if (!message) {
      throw new Error('Message or description is required');
    }

    // Determinar data de agendamento
    const scheduledDateTime = data.scheduledDate || data.scheduledAt;

    // Determinar userId final baseado no targetType
    let finalUserId: string | undefined = data.userId;
    if (data.targetType === 'all') {
      finalUserId = undefined; // Notificação em massa
    }

    // Criar metadata padrão se não fornecido
    let finalMetadata = data.metadata;
    if (!finalMetadata) {
      const defaultLinks: Record<NotificationType, string> = {
        CAMPAIGN: '/campaigns',
        MENTION: '/notifications',
        PLAN_EXPIRY: '/billing',
        TICKET: '/tickets',
        SYSTEM: '/notifications',
      };

      finalMetadata = {
        link: defaultLinks[data.type] || '/notifications',
        createdBy: 'service',
        targetType: data.targetType || (finalUserId ? 'specific' : 'all'),
      };
    }

    return await prisma.notification.create({
      data: {
        title: data.title,
        message,
        type: data.type,
        userId: finalUserId,
        scheduledAt: scheduledDateTime,
        sentAt: scheduledDateTime ? null : new Date(),
        metadata: finalMetadata,
      },
    });
  }

  // Create mass notification for all users (simplified - uses main create method)
  static async createMassNotification(
    data: Omit<CreateNotificationData, 'userId'>
  ) {
    return await this.create({
      ...data,
      targetType: 'all',
      userId: undefined,
    });
  }

  // Get notifications for a user
  static async getForUser(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    } = {}
  ) {
    const { page = 1, limit = 10, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const where = {
      OR: [{ userId: userId }, { userId: null }],
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          OR: [{ userId: userId }, { userId: null }],
          isRead: false,
        },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        OR: [{ userId: userId }, { userId: null }],
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // Simplified notification helpers - now use the unified create method
  static async createMentionNotification(
    mentionedUserId: string,
    mentionedBy: string,
    context: string
  ) {
    return this.create({
      title: 'Você foi marcado!',
      description: `${mentionedBy} te marcou em ${context}`,
      type: 'MENTION',
      userId: mentionedUserId,
      targetType: 'specific',
      metadata: {
        mentionedBy,
        context,
        link: `/notifications`,
      },
    });
  }

  static async createTicketNotification(
    userId: string,
    ticketId: string,
    title: string
  ) {
    return this.create({
      title: 'Novo ticket aberto',
      description: `Ticket #${ticketId} foi aberto: "${title}"`,
      type: 'TICKET',
      userId,
      targetType: 'specific',
      metadata: {
        ticketId,
        link: `/tickets/${ticketId}`,
      },
    });
  }

  static async createPlanExpiryNotification(
    userId: string,
    planType: string,
    daysLeft: number
  ) {
    return this.create({
      title: 'Plano expirando',
      description: `Seu plano ${planType} vence em ${daysLeft} dias. Renove agora!`,
      type: 'PLAN_EXPIRY',
      userId,
      targetType: 'specific',
      metadata: {
        planType,
        daysLeft,
        renewLink: '/billing',
      },
    });
  }

  // Método simplificado para criar qualquer tipo de notificação
  static async createSimpleNotification(
    title: string,
    description: string,
    type: NotificationType,
    options: {
      userId?: string;
      targetType?: 'all' | 'specific';
      scheduledAt?: Date;
      metadata?: any;
    } = {}
  ) {
    return this.create({
      title,
      description,
      type,
      userId: options.userId,
      targetType: options.targetType || (options.userId ? 'specific' : 'all'),
      scheduledAt: options.scheduledAt,
      metadata: options.metadata,
    });
  }
}
