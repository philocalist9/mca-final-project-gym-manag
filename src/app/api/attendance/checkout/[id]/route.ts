import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import Client from '@/models/Client';
import { getServerUser } from '@/utils/auth';
import { UserRole } from '@/models/User';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

// PATCH /api/attendance/checkout/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const body = await req.json();

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid attendance record ID' }, { status: 400 });
    }

    // Find the attendance record
    const attendanceRecord = await Attendance.findById(id);

    if (!attendanceRecord) {
      return NextResponse.json({ message: 'Attendance record not found' }, { status: 404 });
    }

    // Check if already checked out
    if (attendanceRecord.checkOutTime) {
      return NextResponse.json(
        { message: 'Client has already checked out' },
        { status: 400 }
      );
    }

    // If trainer, check if they have access to this client
    if (user.role === UserRole.TRAINER) {
      const client = await Client.findById(attendanceRecord.client);
      
      if (client && client.createdBy.toString() !== user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    // Update with checkout time
    const checkOutTime = body.checkOutTime || new Date();
    
    // Calculate duration in minutes
    const checkIn = new Date(attendanceRecord.checkInTime).getTime();
    const checkOut = new Date(checkOutTime).getTime();
    const duration = Math.round((checkOut - checkIn) / (1000 * 60));

    // Update the attendance record
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { 
        checkOutTime: checkOutTime,
        duration: duration,
        notes: body.notes || attendanceRecord.notes
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedAttendance);
  } catch (error: any) {
    console.error('Error checking out client:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
} 