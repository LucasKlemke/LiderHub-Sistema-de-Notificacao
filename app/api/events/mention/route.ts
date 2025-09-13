import { type NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';

// POST /api/events/mention - Simulate a mention event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentionedUserId, mentionedBy, context, link } = body;

    if (!mentionedUserId || !mentionedBy || !context) {
      return NextResponse.json(
        { error: 'mentionedUserId, mentionedBy, and context are required' },
        { status: 400 }
      );
    }

    const notification = await NotificationService.create({
      title: 'Você foi marcado!',
      message: `${mentionedBy} te marcou em ${context}`,
      type: 'MENTION',
      userId: mentionedUserId,
      metadata: {
        mentionedBy,
        context,
        link: link || '/notifications',
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating mention notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
