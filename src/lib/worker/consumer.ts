import { TBookingMessage } from '@/types';
import amqp, { Channel, ConsumeMessage } from 'amqplib';
import 'dotenv/config';
import Booking from '../api-models/Booking';
import { connectMongoDB } from '../db';
import { delay, QUEUE_NAME } from '../utils';
// import { redis } from '../redis';

const DEAD_LOCK_QUEUE = 'booking_deadlockqueue';
const MAX_RETRIES = 3;

const handleBookingMessage = async (channel: Channel, msg: ConsumeMessage): Promise<void> => {
  let data: TBookingMessage & { seatId: string };

  try {
    data = JSON.parse(msg.content.toString());
  } catch {
    console.warn('⚠️ Invalid JSON format. Acking and skipping.');
    channel.ack(msg);
    return;
  }

  const { bookingId, seatId, showtimeId, retry = 0 } = data;

  if (!bookingId || !seatId || !showtimeId) {
    console.warn('⚠️ Missing required fields. Acking and skipping.');
    channel.ack(msg);
    return;
  }

  console.log(`📩 Received message - BookingID: ${bookingId}, Retry: ${retry}`);

  try {
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      console.log(`⚠️ Booking not found: ${bookingId}`);
      channel.ack(msg);
      return;
    }

    if (booking.status === 'success') {
      console.log(`ℹ️ Booking already processed: ${bookingId}`);
      channel.ack(msg);
      return;
    }

    // Simulate failure
    if (Math.random() < 0.2) throw new Error('Fake fail');

    await Booking.updateOne({ bookingId }, { status: 'success' });
    // await redis.del(`lock:${showtimeId}:${seatId}`);
    console.log(`✅ Booking success: ${bookingId}`);
    channel.ack(msg);
  } catch (err) {
    console.error(`❌ Failed to process booking ${bookingId}:`, err);

    if (retry >= MAX_RETRIES) {
      console.warn(`⚠️ Max retries reached. Moving ${bookingId} to ${DEAD_LOCK_QUEUE}`);
      channel.sendToQueue(DEAD_LOCK_QUEUE, msg.content, { persistent: true });
      channel.ack(msg);
    } else {
      const next = { ...data, retry: retry + 1 };
      const backoff = Math.pow(2, retry) * 1000;

      console.log(`🔁 Retrying ${bookingId} in ${backoff}ms (Retry: ${next.retry})`);

      try {
        await delay(backoff);
      } catch {
        console.warn(`⚠️ Delay interrupted. Still retrying ${bookingId}`);
      }

      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(next)), { persistent: true });
      channel.ack(msg);
    }
  }
};

const run = async (): Promise<void> => {
  await connectMongoDB();

  const conn = await amqp.connect(process.env.RABBIT_URL!);
  console.log('✅ Connected to RabbitMQ');

  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.assertQueue(DEAD_LOCK_QUEUE, { durable: true });
  await channel.prefetch(5);

  console.log(`✅ Queues [${QUEUE_NAME}], [${DEAD_LOCK_QUEUE}] asserted`);

  channel.consume(QUEUE_NAME, (msg) => {
    if (msg) handleBookingMessage(channel, msg);
  });

  console.log(`🚀 Worker listening on: ${QUEUE_NAME}`);

  process.on('SIGINT', async () => {
    console.log('🛑 Gracefully shutting down');
    await channel.close();
    await conn.close();
    process.exit(0);
  });
};

run().catch((err) => {
  console.error('❌ Worker failed to start:', err);
  process.exit(1);
});
