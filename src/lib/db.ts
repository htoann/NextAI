import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Use global cache to prevent multiple connections in dev or serverless
let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  console.log('[MongoDB] No cache found, initializing...');
  cached = global.mongoose = { conn: null, promise: null };
} else {
  console.log('[MongoDB] Using existing cache.');
}

export const connectMongoDB = async () => {
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI);
  } else {
    console.log('⏳ Awaiting existing connection promise...');
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connect error:', (err as Error).message);
    cached.promise = null; // reset for retry
    throw err;
  }
};

declare global {
  var mongoose: typeof cached;
}
