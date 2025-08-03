import Booking from '@/lib/api-models/Booking';
import { authOptions } from '@/lib/authOptions';
import { getRabbitMQChannel } from '@/lib/RabbitMQ';
import { redis } from '@/lib/redis';
import { QUEUE_NAME } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const seatKey = (showtimeId: string, seatId: string) => `lock:${showtimeId}:${seatId}`;

const lockSeatOrFail = async (seatKey: string, bookingId: string) => {
  const locked = await redis.lockSeat(seatKey, bookingId);
  if (!locked) {
    const holder = await redis.get(seatKey);
    console.warn(`❌ Seat already locked by ${holder}`);
    return false;
  }
  console.log(`✅ Seat locked: ${seatKey} by ${bookingId}`);
  return true;
};

const sendToQueue = async (msg: any, messageId: string) => {
  const channel = await getRabbitMQChannel();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
    messageId,
  });
  console.log(`📤 Message queued: ${QUEUE_NAME}`, msg);
};

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
        const key = seatKey(showtimeId, seatId);
        const locked = await lockSeatOrFail(key, bookingId);
        return { seatId, locked };
      }),
    );

    const failed = lockResults.find((r) => !r.locked);
    if (failed) {
      await Promise.all(lockResults.filter((r) => r.locked).map((r) => redis.del(seatKey(showtimeId, r.seatId))));
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
          await redis.del(seatKey(showtimeId, seatId));
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
