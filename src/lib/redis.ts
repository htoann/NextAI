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

export const getSeatKey = (showtimeId: string, seatId: string) => `lock:${showtimeId}:${seatId}`;

export async function rollbackSeats(seatIds: string[], showtimeId: string) {
  await Promise.all(seatIds.map((seatId) => redis.del(getSeatKey(showtimeId, seatId))));
}

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
