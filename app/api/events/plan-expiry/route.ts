import { type NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';

// POST /api/events/plan-expiry - Simulate a plan expiry warning
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType, daysLeft, renewLink } = body;

    if (!userId || !planType || daysLeft === undefined) {
      return NextResponse.json(
        { error: 'userId, planType, and daysLeft are required' },
        { status: 400 }
      );
    }

    const urgencyLevel =
      daysLeft <= 3 ? 'urgente' : daysLeft <= 7 ? 'importante' : 'aviso';
    const message =
      daysLeft === 0
        ? `Seu plano ${planType} expirou hoje. Renove agora para continuar usando!`
        : `Seu plano ${planType} vence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}. Renove agora!`;

    const notification = await NotificationService.create({
      title: daysLeft === 0 ? 'Plano expirado' : 'Plano expirando',
      message,
      type: 'PLAN_EXPIRY',
      userId,
      metadata: {
        planType,
        daysLeft,
        urgencyLevel,
        renewLink: renewLink || '/billing',
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating plan expiry notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
