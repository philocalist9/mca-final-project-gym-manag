import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import Client from '@/models/Client';
import { getServerUser } from '@/utils/auth';
import { UserRole } from '@/models/User';
import mongoose from 'mongoose';

// GET /api/attendance?clientId=xyz&date=yyyy-mm-dd
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const date = searchParams.get('date'); // ISO date string YYYY-MM-DD
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build query
    const query: any = {};
    
    // Filter by client if provided
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      // Check if user has access to this client
      const client = await Client.findById(clientId);
      
      if (!client) {
        return NextResponse.json({ message: 'Client not found' }, { status: 404 });
      }
      
      // Check authorization for trainers
      if (user.role === UserRole.TRAINER && client.createdBy.toString() !== user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      
      query.client = clientId;
    } else if (user.role === UserRole.TRAINER) {
      // For trainers without client filter, only show clients they manage
      const clientIds = await Client.find({ createdBy: user.id }).select('_id').lean();
      query.client = { $in: clientIds.map(c => c._id) };
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.checkInTime = { 
        $gte: startDate,
        $lt: endDate
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const attendanceRecords = await Attendance.find(query)
      .populate('client', 'name email phone')
      .populate('recordedBy', 'name email')
      .sort({ checkInTime: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Attendance.countDocuments(query);
    
    return NextResponse.json({
      attendanceRecords,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

// POST /api/attendance (check-in)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    
    // Validate client ID
    if (!body.client || !mongoose.Types.ObjectId.isValid(body.client)) {
      return NextResponse.json({ message: 'Valid client ID is required' }, { status: 400 });
    }

    // Check if client exists
    const client = await Client.findById(body.client);
    
    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Create a new attendance record (check-in)
    const newAttendance = new Attendance({
      client: body.client,
      checkInTime: body.checkInTime || new Date(),
      notes: body.notes,
      recordedBy: user.id
    });
    
    await newAttendance.save();
    
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error: any) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
} 