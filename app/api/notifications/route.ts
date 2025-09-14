import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/notifications - List notifications for a user with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const readOnly = searchParams.get('readOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const now = new Date();

    // hoje tem que ser apos a data de scheduleat, para aparecer as notificacoes agendadas apos a data

    const where = {
      OR: [{ userId: userId }],
      AND: [
        {
          OR: [
            { scheduledAt: null }, // Immediate notifications
            { scheduledAt: { lte: now } }, // Scheduled notifications that should be shown now
          ],
        },
      ],
      ...(unreadOnly && { isRead: false }),
      ...(readOnly && { isRead: true }),
    };

    const [notifications, total, totalFiltered, unreadCount, readCount] =
      await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        prisma.notification.count({
          where: {
            userId: userId,
          },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: {
            OR: [{ userId: userId }],
            isRead: false,
          },
        }),
        prisma.notification.count({
          where: {
            OR: [{ userId: userId }],
            isRead: true,
          },
        }),
      ]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      total,
      unreadCount,
      readCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification (simplified endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description, // Aceita 'description' como alias para 'message'
      message,
      type,
      userId,
      targetType = 'all', // 'all' para notificação em massa, 'specific' para usuário específico
      scheduledAt,
      scheduledDate, // Aceita tanto scheduledAt quanto scheduledDate
      metadata,
    } = body;

    // Usar description como message se fornecido
    const notificationMessage = description || message;

    if (!title || !notificationMessage || !type) {
      return NextResponse.json(
        { error: 'title, description (or message), and type are required' },
        { status: 400 }
      );
    }

    // Determinar data de agendamento
    let scheduledDateTime = null;
    if (scheduledAt) {
      scheduledDateTime = new Date(scheduledAt);
    } else if (scheduledDate) {
      scheduledDateTime = new Date(scheduledDate);
    }

    // Criar metadata baseado no tipo se não fornecido
    let finalMetadata = metadata;
    if (!finalMetadata) {
      const defaultLinks = {
        CAMPAIGN: '/campaigns',
        MENTION: '/notifications',
        PLAN_EXPIRY: '/billing',
        TICKET: '/tickets',
      };

      finalMetadata = {
        link:
          defaultLinks[type as keyof typeof defaultLinks] || '/notifications',
        createdBy: 'user',
        targetType,
      };
    }

    // Se targetType for 'specific' e userId for fornecido, criar para usuário específico
    if (targetType === 'specific' && userId) {
      const notification = await prisma.notification.create({
        data: {
          title,
          message: notificationMessage,
          type,
          userId: userId,
          scheduledAt: scheduledDateTime,
          sentAt: scheduledDateTime ? null : new Date(),
          metadata: finalMetadata,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      const responseMessage = scheduledDateTime
        ? `Notificação agendada para ${scheduledDateTime.toLocaleString('pt-BR')}`
        : 'Notificação criada e enviada com sucesso';

      return NextResponse.json(
        {
          ...notification,
          message: responseMessage,
          isScheduled: !!scheduledDateTime,
        },
        { status: 201 }
      );
    }

    // Se não foi especificado userId ou targetType é 'all', criar para todos os usuários
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    if (allUsers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário encontrado no sistema' },
        { status: 400 }
      );
    }

    // Criar notificações para todos os usuários
    const notificationsData = allUsers.map(user => ({
      title,
      message: notificationMessage,
      type,
      userId: user.id,
      scheduledAt: scheduledDateTime,
      sentAt: scheduledDateTime ? null : new Date(),
      metadata: finalMetadata,
    }));

    const notifications = await prisma.notification.createMany({
      data: notificationsData,
    });

    const responseMessage = scheduledDateTime
      ? `${notifications.count} notificações agendadas para ${scheduledDateTime.toLocaleString('pt-BR')}`
      : `${notifications.count} notificações criadas e enviadas com sucesso para todos os usuários`;

    return NextResponse.json(
      {
        count: notifications.count,
        users: allUsers.length,
        message: responseMessage,
        isScheduled: !!scheduledDateTime,
        title,
        type,
        scheduledAt: scheduledDateTime,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
