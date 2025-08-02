import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Use global cache to prevent multiple connections in dev or serverless
let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectMongoDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      bufferCommands: false,
    });
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
