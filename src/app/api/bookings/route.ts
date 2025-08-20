import Booking from '@/lib/api-models/Booking';
import { getField } from '@/lib/localStorage';
import { lockSeats, rollbackSeats } from '@/lib/redis';
import { authOptions } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { createAndQueueBookings } from './utils';

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('❌ Booking List GET error:', (error as Error).message);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { seatIds, showtimeId } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || getField('user') || 'anonymous';

    const bookingId = `booking_${Date.now()}`;
    const messageId = new Date().toISOString();

    const lockResult = await lockSeats(seatIds, showtimeId, bookingId);
    if (!lockResult.success) {
      await rollbackSeats(lockResult.lockedSeatIds, showtimeId);
      return NextResponse.json({ message: `Seat ${lockResult.failedSeatId} is already locked` }, { status: 409 });
    }

    const price = seatIds.length * 50000;

    const bookingPayloads = await createAndQueueBookings(seatIds, showtimeId, bookingId, messageId, userId, price);

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

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { bookingIds } = await req.json();

    const result = await Booking.deleteMany({
      bookingId: { $in: bookingIds },
      userId,
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('❌ Booking DELETE error:', (error as Error).message);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
};
