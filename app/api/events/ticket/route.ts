import { type NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';

// POST /api/events/ticket - Simulate a ticket creation event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ticketId, title, priority = 'medium' } = body;

    if (!userId || !ticketId || !title) {
      return NextResponse.json(
        { error: 'userId, ticketId, and title are required' },
        { status: 400 }
      );
    }

    const notification = await NotificationService.create({
      title: 'Novo ticket aberto',
      message: `Ticket #${ticketId} foi aberto: "${title}"`,
      type: 'TICKET',
      userId,
      metadata: {
        ticketId,
        title,
        priority,
        link: `/tickets/${ticketId}`,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
