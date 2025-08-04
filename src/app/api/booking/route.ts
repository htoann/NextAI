import Booking from '@/lib/api-models/Booking';
import { redis } from '@/lib/redis';
import { authOptions } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getSeatKey, lockSeatOrFail, sendToQueue } from './utils';

export const POST = async (req: NextRequest) => {
  try {
    const { seatIds, showtimeId } = await req.json();

    if (!Array.isArray(seatIds) || seatIds.length === 0 || typeof showtimeId !== 'string') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    const bookingId = `booking_${Date.now()}`;
    const messageId = new Date().toISOString();

    // Lock seats in parallel
    const lockResults = await Promise.all(
      seatIds.map(async (seatId) => {
        const key = getSeatKey(showtimeId, seatId);
        const locked = await lockSeatOrFail(key, bookingId);
        return { seatId, locked };
      }),
    );

    const failed = lockResults.find((r) => !r.locked);
    if (failed) {
      await Promise.all(lockResults.filter((r) => r.locked).map((r) => redis.del(getSeatKey(showtimeId, r.seatId))));
      return NextResponse.json({ message: `Seat ${failed.seatId} is already locked` }, { status: 409 });
    }

    // Book and queue in parallel
    const bookingPayloads: any[] = [];

    await Promise.all(
      seatIds.map(async (seatId) => {
        const booking = {
          bookingId: `${bookingId}_${seatId}`,
          seatId,
          showtimeId,
          status: 'pending',
          messageId,
          userId,
        };

        try {
          await Booking.create(booking);
          await sendToQueue({ ...booking, retry: 0 }, `${messageId}_${seatId}`);
          bookingPayloads.push(booking);
        } catch (err) {
          await Booking.deleteOne({ bookingId: booking.bookingId });
          await redis.del(getSeatKey(showtimeId, seatId));
          console.error(`❌ Failed to queue booking for seat ${seatId}:`, err);
          throw new Error('Booking failed');
        }
      }),
    );

    return NextResponse.json({
      status: 'queued',
      success: true,
      bookingIds: bookingPayloads.map((b) => b.bookingId),
    });
  } catch (error) {
    console.error('❌ Booking POST error:', (error as Error).message);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
