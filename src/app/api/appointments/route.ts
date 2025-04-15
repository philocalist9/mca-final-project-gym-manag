import { NextRequest, NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { createDocument, findDocuments, isValidObjectId } from '@/lib/dbUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * GET /api/appointments
 * Get all appointments or filter by query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const trainerId = searchParams.get('trainerId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    // Build query based on parameters
    const query: any = {};
    
    if (clientId) {
      if (!isValidObjectId(clientId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid client ID format' },
          { status: 400 }
        );
      }
      query.client = clientId;
    }
    
    if (trainerId) {
      if (!isValidObjectId(trainerId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid trainer ID format' },
          { status: 400 }
        );
      }
      query.trainer = trainerId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    // Date range filtering
    if (fromDate || toDate) {
      query.date = {};
      
      if (fromDate) {
        query.date.$gte = new Date(fromDate);
      }
      
      if (toDate) {
        query.date.$lte = new Date(toDate);
      }
    }
    
    // Query options
    const options = {
      sort: { date: 1, startTime: 1 },
      populate: [
        { path: 'client', select: 'name email phone' },
        { path: 'trainer', select: 'name email' }
      ]
    };
    
    // Execute the query
    const result = await findDocuments(Appointment, query, {}, options);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, errors: result.errors },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      appointments: result.data,
      count: result.data.length
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
 * POST /api/appointments
 * Create a new appointment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['client', 'trainer', 'date', 'startTime', 'endTime', 'duration', 'type'];
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
    if (!isValidObjectId(body.client)) {
      return NextResponse.json(
        { success: false, message: 'Invalid client ID format' },
        { status: 400 }
      );
    }
    
    if (!isValidObjectId(body.trainer)) {
      return NextResponse.json(
        { success: false, message: 'Invalid trainer ID format' },
        { status: 400 }
      );
    }
    
    // Validate dates
    try {
      body.date = new Date(body.date);
      body.startTime = new Date(body.startTime);
      body.endTime = new Date(body.endTime);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    // Check if endTime is after startTime
    if (body.endTime <= body.startTime) {
      return NextResponse.json(
        { success: false, message: 'End time must be after start time' },
        { status: 400 }
      );
    }
    
    // Create the appointment
    const result = await createDocument(Appointment, body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, errors: result.errors },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, appointment: result.data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 