import { NextResponse } from 'next/server';
import { NotificationScheduler } from '@/lib/scheduler';

// POST /api/scheduler/stop - Stop the notification scheduler
export async function POST() {
  try {
    const scheduler = NotificationScheduler.getInstance();
    scheduler.stop();

    return NextResponse.json({
      message: 'Scheduler stopped successfully',
      status: scheduler.getStatus(),
    });
  } catch (error) {
    console.error('Error stopping scheduler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
