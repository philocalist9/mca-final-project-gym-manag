import { NextRequest, NextResponse } from 'next/server';
import Workout from '@/models/Workout';
import { createDocument, findDocuments, isValidObjectId } from '@/lib/dbUtils';

/**
 * GET /api/workouts
 * Get all workouts or filter by query parameters
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const intensity = searchParams.get('intensity');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    // Build query based on parameters
    const query: any = {};
    
    if (userId) {
      if (!isValidObjectId(userId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      query.user = userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (intensity) {
      query.intensity = intensity;
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
      sort: { date: -1 },
      populate: [
        { path: 'user', select: 'name email' },
        { path: 'trainer', select: 'name email' },
        { path: 'workoutPlan', select: 'name description' }
      ]
    };
    
    // Execute the query
    const result = await findDocuments(Workout, query, {}, options);
    
    if (!result.success) {
      const errorResponse = {
        success: false,
        message: result.message || 'Error fetching workouts',
        errors: result.errors || []
      };
      
      return NextResponse.json(
        errorResponse,
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      workouts: result.data,
      count: result.data.length
    });
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workouts
 * Create a new workout
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['user', 'name', 'date', 'duration', 'intensity', 'status', 'exercises'];
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
    
    // Validate user ID
    if (!isValidObjectId(body.user)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Validate trainer ID if provided
    if (body.trainer && !isValidObjectId(body.trainer)) {
      return NextResponse.json(
        { success: false, message: 'Invalid trainer ID format' },
        { status: 400 }
      );
    }
    
    // Validate workout plan ID if provided
    if (body.workoutPlan && !isValidObjectId(body.workoutPlan)) {
      return NextResponse.json(
        { success: false, message: 'Invalid workout plan ID format' },
        { status: 400 }
      );
    }
    
    // Validate dates
    try {
      body.date = new Date(body.date);
      if (body.scheduledTime) body.scheduledTime = new Date(body.scheduledTime);
      if (body.completedTime) body.completedTime = new Date(body.completedTime);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    // Validate exercises
    if (!Array.isArray(body.exercises) || body.exercises.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one exercise is required' },
        { status: 400 }
      );
    }
    
    // Validate each exercise
    for (const exercise of body.exercises) {
      if (!exercise.name || !exercise.muscleGroup || 
          typeof exercise.sets !== 'number' || typeof exercise.reps !== 'number' ||
          typeof exercise.restTime !== 'number') {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Each exercise must include name, muscleGroup, sets, reps, and restTime' 
          },
          { status: 400 }
        );
      }
    }
    
    // Create the workout
    const result = await createDocument(Workout, body);
    
    if (!result.success) {
      const errorResponse = {
        success: false,
        message: result.message || 'Error creating workout',
        errors: result.errors || []
      };
      
      return NextResponse.json(
        errorResponse,
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, workout: result.data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 