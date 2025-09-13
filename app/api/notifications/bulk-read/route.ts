import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/notifications/bulk-read - Mark multiple notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `${result.count} notifications marked as read`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error bulk marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
