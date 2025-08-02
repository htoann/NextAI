'use server';

import amqp, { Channel } from 'amqplib';
import { QUEUE_NAME } from './utils';

let channel: Channel;

export async function getRabbitMQChannel(): Promise<Channel> {
  if (!channel) {
    const conn = await amqp.connect(process.env.RABBIT_URL!);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
  }
  return channel;
}
