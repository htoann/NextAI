import { Redis } from '@upstash/redis';

const TIME_TO_LIVE = 60 * 5;

const client = Redis.fromEnv();

export const redis = {
  async lockSeat(key: string, value: string, timeToLive: number = TIME_TO_LIVE) {
    const result = await client.set(key, value, {
      nx: true, // Only set if the key does not already exist
      ex: timeToLive, // Set expiration time in seconds
    });
    console.log('Lock result:', result);
    return result === 'OK';
  },

  async del(key: string) {
    await client.del(key);
  },

  async get(key: string) {
    return await client.get(key);
  },
};
