import { NextResponse } from 'next/server';
import { NotificationScheduler } from '@/lib/scheduler';

// POST /api/scheduler/start - Start the notification scheduler
export async function POST() {
  try {
    const scheduler = NotificationScheduler.getInstance();
    scheduler.start();

    return NextResponse.json({
      message: 'Scheduler started successfully',
      status: scheduler.getStatus(),
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
