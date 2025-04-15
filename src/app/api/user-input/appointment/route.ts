import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { AppointmentStatus, AppointmentType } from '@/models/Appointment';
import { isValidObjectId } from '@/lib/dbUtils';

/**
 * POST /api/user-input/appointment
 * Schedule a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['clientId', 'trainerId', 'date', 'startTime', 'type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields', 
          missingFields 
        },
        { status: 400 }
      );
    }
    
    // Validate IDs
    if (!isValidObjectId(body.clientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid client ID format' },
        { status: 400 }
      );
    }
    
    if (!isValidObjectId(body.trainerId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid trainer ID format' },
        { status: 400 }
      );
    }
    
    // Verify trainer exists
    const trainer = await User.findById(body.trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return NextResponse.json(
        { success: false, message: 'Trainer not found' },
        { status: 404 }
      );
    }
    
    // Verify client exists
    const client = await User.findById(body.clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate date/time
    const appointmentDate = new Date(body.date);
    let startTime: Date;
    let endTime: Date;
    
    try {
      startTime = new Date(body.startTime);
      
      // If endTime is provided, use it
      if (body.endTime) {
        endTime = new Date(body.endTime);
        
        // Ensure end time is after start time
        if (endTime <= startTime) {
          return NextResponse.json(
            { success: false, message: 'End time must be after start time' },
            { status: 400 }
          );
        }
      } else {
        // Default to 1 hour appointment if no end time provided
        endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid date/time format' },
        { status: 400 }
      );
    }
    
    // Calculate duration in minutes
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    // Check for appointment conflicts
    const conflictingAppointments = await Appointment.find({
      trainer: body.trainerId,
      status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.RESCHEDULED] },
      $or: [
        // New appointment starts during existing appointment
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        // New appointment ends during existing appointment
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        // New appointment completely contains existing appointment
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });
    
    if (conflictingAppointments.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trainer has conflicting appointments during this time',
          conflicts: conflictingAppointments
        },
        { status: 409 }
      );
    }
    
    // Create appointment
    const appointment = new Appointment({
      client: body.clientId,
      trainer: body.trainerId,
      date: appointmentDate,
      startTime,
      endTime,
      duration: durationMinutes,
      status: AppointmentStatus.SCHEDULED,
      type: body.type,
      notes: body.notes,
      location: body.location || 'Gym Training Room'
    });
    
    // Save appointment
    const savedAppointment = await appointment.save();
    
    return NextResponse.json({
      success: true, 
      message: 'Appointment scheduled successfully',
      appointment: savedAppointment
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user-input/appointment
 * Get appointments for a user (client or trainer)
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') || 'client'; // 'client' or 'trainer'
    const status = searchParams.get('status');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Build query
    const query: any = {};
    
    // Filter by user
    if (userType === 'client') {
      query.client = userId;
    } else {
      query.trainer = userId;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Query options to sort by date/time (ascending)
    const options = {
      sort: { date: 1, startTime: 1 },
      populate: [
        { path: 'client', select: 'name email' },
        { path: 'trainer', select: 'name email' }
      ]
    };
    
    // Get appointments
    const appointments = await Appointment.find(query, null, options);
    
    return NextResponse.json({
      success: true,
      appointments,
      count: appointments.length
    });
    
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user-input/appointment
 * Update an appointment status (complete, cancel, reschedule)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.appointmentId) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.status) {
      return NextResponse.json(
        { success: false, message: 'New status is required' },
        { status: 400 }
      );
    }
    
    // Validate appointment ID
    if (!isValidObjectId(body.appointmentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid appointment ID format' },
        { status: 400 }
      );
    }
    
    // Find appointment
    const appointment = await Appointment.findById(body.appointmentId);
    
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Update appointment status
    appointment.status = body.status;
    
    // Handle rescheduling
    if (body.status === AppointmentStatus.RESCHEDULED) {
      if (!body.startTime || !body.endTime) {
        return NextResponse.json(
          { success: false, message: 'Start time and end time are required for rescheduling' },
          { status: 400 }
        );
      }
      
      // Update times
      try {
        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);
        
        // Ensure end time is after start time
        if (endTime <= startTime) {
          return NextResponse.json(
            { success: false, message: 'End time must be after start time' },
            { status: 400 }
          );
        }
        
        appointment.startTime = startTime;
        appointment.endTime = endTime;
        
        // Recalculate duration
        const durationMs = endTime.getTime() - startTime.getTime();
        appointment.duration = Math.floor(durationMs / (1000 * 60));
        
        // Update date if provided
        if (body.date) {
          appointment.date = new Date(body.date);
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid date/time format' },
          { status: 400 }
        );
      }
    }
    
    // Add notes if provided
    if (body.notes) {
      appointment.notes = appointment.notes 
        ? `${appointment.notes}\n\n${body.notes}`
        : body.notes;
    }
    
    // Save updated appointment
    const updatedAppointment = await appointment.save();
    
    return NextResponse.json({
      success: true, 
      message: `Appointment ${body.status} successfully`,
      appointment: updatedAppointment
    });
    
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 