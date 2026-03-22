/**
 * lib/db.ts
 * MongoDB connection singleton — reuses connection across hot-reloads in dev.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local');
}

// Cache on global to survive HMR in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
