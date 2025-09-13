import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/notifications/scheduled - Get scheduled notifications
export async function GET() {
  try {
    const scheduledNotifications = await prisma.notification.findMany({
      where: {
        scheduledAt: {
          lte: new Date(),
        },
        sentAt: null,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return NextResponse.json(scheduledNotifications);
  } catch (error) {
    console.error('Error fetching scheduled notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications/scheduled/send - Send scheduled notifications
export async function POST() {
  try {
    const now = new Date();

    // Find notifications that should be sent
    const notificationsToSend = await prisma.notification.findMany({
      where: {
        scheduledAt: {
          lte: now,
        },
        sentAt: null,
      },
    });

    // Mark them as sent
    const updatePromises = notificationsToSend.map(notification =>
      prisma.notification.update({
        where: { id: notification.id },
        data: { sentAt: now },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: `${notificationsToSend.length} scheduled notifications sent`,
      count: notificationsToSend.length,
      notifications: notificationsToSend,
    });
  } catch (error) {
    console.error('Error sending scheduled notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
