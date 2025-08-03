import * as amqp from 'amqplib';
import 'dotenv/config';
import Booking from '../api-models/Booking';
import { connectMongoDB } from '../db';
import { TBookingMessage } from '../type';
import { delay, QUEUE_NAME } from '../utils';

const DEAD_LOCK_QUEUE = 'booking_deadlockqueue';
const MAX_RETRIES = 3;
const PREFETCH_COUNT = 10;

(async () => {
  await connectMongoDB();

  const conn = await amqp.connect(process.env.RABBIT_URL!);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.assertQueue(DEAD_LOCK_QUEUE, { durable: true });
  await channel.prefetch(PREFETCH_COUNT);

  console.log(`🚀 Worker is listening on [${QUEUE_NAME}]`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data: TBookingMessage & { seatIds: string[] } = JSON.parse(msg.content.toString());
    const { bookingId, seatIds, showtimeId, retry = 0 } = data;

    if (!bookingId || !showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      console.warn('⚠️ Invalid message payload.');
      return channel.ack(msg);
    }

    try {
      const updatePromises = seatIds.map(async (seat) => {
        const subBookingId = `${bookingId}_${seat}`;
        const booking = await Booking.findOne({ bookingId: subBookingId });

        if (!booking) {
          console.warn(`⚠️ Booking not found: ${subBookingId}`);
          return;
        }
        if (booking.status === 'success') {
          console.log(`ℹ️ Already processed: ${subBookingId}`);
          return;
        }

        // Simulate random failure
        if (Math.random() < 0.2) throw new Error(`Simulated fail at seat ${seat}`);

        await Booking.updateOne({ bookingId: subBookingId }, { status: 'success' });
        // await redis.del(`lock:${showtimeId}:${seat}`);
        console.log(`✅ Booking success: ${subBookingId}`);
      });

      await Promise.all(updatePromises);
      channel.ack(msg);
    } catch (err) {
      console.error(`❌ Error for booking ${bookingId}:`, err);

      if (retry >= MAX_RETRIES) {
        console.warn(`⚠️ Max retries reached. Moving to DLQ: ${bookingId}`);
        channel.sendToQueue(DEAD_LOCK_QUEUE, msg.content, { persistent: true });
      } else {
        const next = { ...data, retry: retry + 1 };
        const backoff = Math.pow(2, retry) * 1000;

        console.log(`🔁 Retry #${next.retry} after ${backoff}ms`);
        await delay(backoff);
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(next)), { persistent: true });
      }

      channel.ack(msg);
    }
  });

  process.on('SIGINT', async () => {
    console.log('🛑 Gracefully shutting down');
    await channel.close();
    await conn.close();
    process.exit(0);
  });
})();
