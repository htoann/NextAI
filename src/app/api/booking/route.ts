import Booking from '@/lib/api-models/Booking';
import { getRabbitMQChannel } from '@/lib/RabbitMQ';
import { redis } from '@/lib/redis';
import { QUEUE_NAME } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const lockSeatOrFail = async (seatKey: string, bookingId: string) => {
  const locked = await redis.lockSeat(seatKey, bookingId);
  if (!locked) {
    const holder = await redis.get(seatKey);
    console.warn(`❌ Seat already locked by ${holder}`);
    return {
      locked: false,
      response: NextResponse.json({ message: 'Seat already locked' }, { status: 409 }),
    };
  }

  console.log(`✅ Seat locked: ${seatKey} by ${bookingId}`);
  return { locked: true };
};

const sendToQueue = async (msg: any, messageId: string) => {
  try {
    const channel = await getRabbitMQChannel();
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
      messageId,
    });
    console.log(`📤 Message queued: ${QUEUE_NAME}`, msg);
  } catch (error) {
    console.error(`❌ Failed to queue message: ${messageId}`, error);
    throw error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { seatId, showtimeId } = await req.json();

    const messageId = new Date().toISOString();
    const bookingId = `booking_${Date.now()}`;
    const seatKey = `lock:${showtimeId}:${seatId}`;

    const lockResult = await lockSeatOrFail(seatKey, bookingId);
    if (!lockResult.locked) return lockResult.response;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    const bookingPayload = {
      bookingId,
      seatId,
      showtimeId,
      status: 'pending',
      messageId,
      userId,
    };

    try {
      await Booking.create(bookingPayload);
      await sendToQueue({ ...bookingPayload, retry: 0 }, messageId);
    } catch (queueError) {
      try {
        await Booking.deleteOne({ bookingId });
        await redis.del(seatKey);
      } catch (compensationError) {
        console.error('❌ Failed to compensate for queue error:', compensationError);
      }
      throw queueError;
    }

    return NextResponse.json({ status: 'queued', bookingId, success: true });
  } catch (error) {
    console.error('❌ Booking POST error:', (error as Error).message);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
