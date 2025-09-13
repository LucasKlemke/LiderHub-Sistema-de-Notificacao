import { NextResponse } from 'next/server';
import { NotificationScheduler } from '@/lib/scheduler';

// GET /api/scheduler/status - Get scheduler status
export async function GET() {
  try {
    const scheduler = NotificationScheduler.getInstance();
    const status = scheduler.getStatus();

    return NextResponse.json({
      scheduler: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
