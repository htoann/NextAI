import * as amqp from 'amqplib';
import 'dotenv/config';
import Booking from '../api-models/Booking';
import { connectMongoDB } from '../db';
// import { redis } from '../redis';
import { TBookingMessage } from '../type';
import { delay, QUEUE_NAME } from '../utils';

const DEAD_LOCK_QUEUE = 'booking_deadlockqueue';
const MAX_RETRIES = 3;

(async () => {
  await connectMongoDB();

  const conn = await amqp.connect(process.env.RABBIT_URL!);
  console.log('✅ Connected to RabbitMQ');

  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.assertQueue(DEAD_LOCK_QUEUE, { durable: true });
  await channel.prefetch(5);
  console.log(`✅ Queues [${QUEUE_NAME}] and [${DEAD_LOCK_QUEUE}] are asserted`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data: TBookingMessage = JSON.parse(msg.content.toString());
    const { bookingId, seatId, showtimeId, retry = 0 } = data;

    if (!bookingId || !seatId || !showtimeId) {
      console.warn('⚠️ Invalid message payload, skipping.');
      return channel.ack(msg);
    }

    console.log(`📩 Received message - BookingID: ${bookingId}, Retry: ${retry}`);

    try {
      const booking = await Booking.findOne({ bookingId });

      if (!booking) {
        console.log(`⚠️ Booking not found: ${bookingId}`);
        return channel.ack(msg);
      }

      if (booking.status === 'success') {
        console.log(`ℹ️ Booking already processed: ${bookingId}`);
        return channel.ack(msg);
      }

      // Simulated failure (for testing)
      if (Math.random() < 0.2) throw new Error('Fake fail');

      await Booking.updateOne({ bookingId }, { status: 'success' });
      // await redis.del(`lock:${showtimeId}:${seatId}`);
      console.log(`✅ Booking success: ${bookingId}`);
      channel.ack(msg);
    } catch (err) {
      console.error(`❌ Failed to process booking ${bookingId}:`, err);

      if (retry >= MAX_RETRIES) {
        console.warn(`⚠️ Max retries reached for booking ${bookingId}, moving to DEAD_LOCK_QUEUE`);
        channel.sendToQueue(DEAD_LOCK_QUEUE, msg.content, { persistent: true });
        channel.ack(msg);
      } else {
        const next = { ...data, retry: retry + 1 };
        const backoff = Math.pow(2, retry) * 1000;

        console.log(`🔁 Retrying booking ${bookingId} (Retry: ${next.retry}) in ${backoff}ms`);
        await delay(backoff);

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(next)), { persistent: true });
        channel.ack(msg);
      }
    }
  });

  console.log(`🚀 Worker is listening to queue: ${QUEUE_NAME}`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Gracefully shutting down');
    await channel.close();
    await conn.close();
    process.exit(0);
  });
})();
