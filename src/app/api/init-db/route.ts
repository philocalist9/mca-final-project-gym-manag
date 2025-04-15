import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Creating default users...');
      
      // Create default admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin'
      });
      
      // Create default trainer user
      await User.create({
        name: 'Trainer User',
        email: 'trainer@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'trainer'
      });
      
      // Create default member user
      await User.create({
        name: 'Member User',
        email: 'member@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'member'
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Default users created successfully',
          users: [
            { email: 'admin@gym.com', password: 'password123', role: 'admin' },
            { email: 'trainer@gym.com', password: 'password123', role: 'trainer' },
            { email: 'member@gym.com', password: 'password123', role: 'member' }
          ]
        },
        { status: 201 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Database already has users' },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Error initializing database:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error initializing database'
      },
      { status: 500 }
    );
  }
} 