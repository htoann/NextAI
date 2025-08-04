import { getRabbitMQChannel } from '@/lib/RabbitMQ';
import { redis } from '@/lib/redis';
import { QUEUE_NAME } from '@/lib/utils';

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

export const sendToQueue = async (msg: any, messageId: string) => {
  const channel = await getRabbitMQChannel();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
    messageId,
  });
  console.log(`📤 Message queued: ${QUEUE_NAME}`, msg);
};
