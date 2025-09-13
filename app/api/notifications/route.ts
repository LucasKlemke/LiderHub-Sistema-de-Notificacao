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

    // Determinar userId final baseado no targetType
    let finalUserId = null;
    if (targetType === 'specific' && userId) {
      finalUserId = userId;
    }
    // Se targetType === 'all', userId permanece null (notificação em massa)

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

    const notification = await prisma.notification.create({
      data: {
        title,
        message: notificationMessage,
        type,
        userId: finalUserId,
        scheduledAt: scheduledDateTime,
        sentAt: scheduledDateTime ? null : new Date(), // Se agendado, não marcar como enviado ainda
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
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
