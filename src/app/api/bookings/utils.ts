import Booking from '@/lib/api-models/Booking';
import { getRabbitMQChannel } from '@/lib/RabbitMQ';
import { redis } from '@/lib/redis';
import { QUEUE_NAME } from '@/lib/utils';
import { TBookingMessage } from '@/types';

export const getSeatKey = (showtimeId: string, seatId: string) => `lock:${showtimeId}:${seatId}`;

export const lockSeatOrFail = async (seatKey: string, bookingId: string) => {
  const locked = await redis.lockSeat(seatKey, bookingId);
  if (!locked) {
    const holder = await redis.get(seatKey);
    console.warn(`❌ Seat already locked by ${holder}`);
    return false;
  }
  console.log(`✅ Seat locked: ${seatKey} by ${bookingId}`);
  return true;
};

export const sendToQueue = async (msg: TBookingMessage, messageId: string) => {
  const channel = await getRabbitMQChannel();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
    messageId,
  });
  console.log(`📤 Message queued: ${QUEUE_NAME}`, msg);
};

export function validatePayload(seatIds: string[], showtimeId: string): seatIds is string[] {
  return Array.isArray(seatIds) && seatIds.length > 0 && typeof showtimeId === 'string';
}

export async function lockSeats(
  seatIds: string[],
  showtimeId: string,
  bookingId: string,
): Promise<{ success: boolean; lockedSeatIds: string[]; failedSeatId?: string }> {
  const lockedSeatIds: string[] = [];

  for (const seatId of seatIds) {
    const key = getSeatKey(showtimeId, seatId);
    const locked = await lockSeatOrFail(key, bookingId);
    if (!locked) {
      return { success: false, lockedSeatIds, failedSeatId: seatId };
    }
    lockedSeatIds.push(seatId);
  }

  return { success: true, lockedSeatIds };
}

export async function rollbackSeats(seatIds: string[], showtimeId: string) {
  await Promise.all(seatIds.map((seatId) => redis.del(getSeatKey(showtimeId, seatId))));
}

export async function createAndQueueBookings(
  seatIds: string[],
  showtimeId: string,
  bookingId: string,
  messageId: string,
  userId: string,
  price: number,
): Promise<TBookingMessage[]> {
  const booking: TBookingMessage = {
    bookingId,
    seatIds,
    showtimeId,
    status: 'pending',
    messageId,
    userId,
    price,
  };

  try {
    await Booking.create(booking);
    await sendToQueue({ ...booking, retry: 0 }, messageId);
    return [booking];
  } catch (err) {
    console.error(err);
    await Booking.deleteOne({ bookingId });
    await rollbackSeats(seatIds, showtimeId);
    throw new Error(`Booking failed for seats: ${seatIds.join(', ')}`);
  }
}
