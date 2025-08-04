import { authOptions } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { createAndQueueBookings, lockSeats, rollbackSeats } from './utils';

export const POST = async (req: NextRequest) => {
  try {
    const { seatIds, showtimeId } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    const bookingId = `booking_${Date.now()}`;
    const messageId = new Date().toISOString();

    const lockResult = await lockSeats(seatIds, showtimeId, bookingId);
    if (!lockResult.success) {
      await rollbackSeats(lockResult.lockedSeatIds, showtimeId);
      return NextResponse.json({ message: `Seat ${lockResult.failedSeatId} is already locked` }, { status: 409 });
    }

    const bookingPayloads = await createAndQueueBookings(seatIds, showtimeId, bookingId, messageId, userId);

    return NextResponse.json({
      status: 'queued',
      success: true,
      bookingIds: bookingPayloads.map((b) => b.bookingId),
    });
  } catch (error) {
    console.error('❌ Booking POST error:', (error as Error).message);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
};
