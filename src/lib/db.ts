// Mock data provider for both server and client environments

import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client'

// Keep track of connection status
let isConnected = false;

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export { db }

async function dbConnect() {
  // Return if already connected
  if (isConnected) {
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shivam52567:9506125436@cluster0.dhrxicv.mongodb.net/gym-management';

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    // Configure mongoose options
    const opts = {
      bufferCommands: false,
    };

    // Create a new MongoDB connection
    await mongoose.connect(MONGODB_URI, opts);
    isConnected = true;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect; 