import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    const { name, email, password, role } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Map role string to valid role value
    let userRole: string;
    
    switch (role) {
      case 'admin':
        userRole = UserRole.ADMIN;
        break;
      case 'trainer':
        userRole = UserRole.TRAINER;
        break;
      case 'member':
        userRole = UserRole.MEMBER;
        break;
      case 'gym_owner':
        userRole = UserRole.GYM_OWNER;
        break;
      default:
        userRole = UserRole.MEMBER; // Default role
    }
    
    // Create new user - password will be hashed by the Mongoose pre-save hook
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });
    
    // Convert to object and remove password
    const userObj = user.toObject();
    delete userObj.password;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: userObj
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error registering user'
      },
      { status: 500 }
    );
  }
} 