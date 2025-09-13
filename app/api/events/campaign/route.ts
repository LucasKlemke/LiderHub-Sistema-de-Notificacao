import { type NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';

// POST /api/events/campaign - Create a marketing campaign notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, targetUserId, campaignId, link, scheduledAt } =
      body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'title and message are required' },
        { status: 400 }
      );
    }

    // If targetUserId is provided, send to specific user, otherwise it's a mass notification
    const notification = targetUserId
      ? await NotificationService.create({
          title,
          message,
          type: 'CAMPAIGN',
          userId: targetUserId,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
          metadata: {
            campaignId,
            link: link || '/campaigns',
            type: 'targeted',
          },
        })
      : await NotificationService.createMassNotification({
          title,
          message,
          type: 'CAMPAIGN',
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
          metadata: {
            campaignId,
            link: link || '/campaigns',
            type: 'mass',
          },
        });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
