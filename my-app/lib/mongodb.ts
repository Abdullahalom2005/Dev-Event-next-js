import mongoose from 'mongoose';

// Define the structure for our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Get the MongoDB URI from environment variables
async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Return existing connection if available
  if (cached.conn) {

// Initialize the cache object
// In development, use a global variable to preserve the connection across hot reloads
// In production, the cache is scoped to this module
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a cached MongoDB connection using Mongoose.
 * 
 * This function ensures that only one connection is created and reused
 * across multiple invocations, which is especially important in serverless
 * environments and during Next.js development hot reloading.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose instance with an active connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection exists but a promise is in progress, wait for it
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection to establish
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error so the next call can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
