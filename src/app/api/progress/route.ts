import { NextRequest, NextResponse } from 'next/server';
import Progress from '@/models/Progress';
import { createDocument, findDocuments, isValidObjectId, updateDocument } from '@/lib/dbUtils';

/**
 * GET /api/progress
 * Get user progress data optionally filtered by user ID
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
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
    
    // Query options
    const options = {
      populate: { path: 'user', select: 'name email' }
    };
    
    // Execute the query
    const result = await findDocuments(Progress, query, {}, options);
    
    if (!result.success) {
      const errorResponse = {
        success: false,
        message: result.message || 'Error fetching progress data',
        errors: result.errors || []
      };
      
      return NextResponse.json(
        errorResponse,
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      progressData: result.data,
      count: result.data.length
    });
  } catch (error: any) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Add a new body measurement to existing progress or create new progress entry
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.measurement) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: userId and measurement are required' 
        },
        { status: 400 }
      );
    }
    
    // Validate user ID
    if (!isValidObjectId(body.userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Validate measurement object
    const { measurement } = body;
    
    if (!measurement.weight) {
      return NextResponse.json(
        { success: false, message: 'Weight is required in measurement data' },
        { status: 400 }
      );
    }
    
    // Add timestamp if not provided
    if (!measurement.date) {
      measurement.date = new Date();
    } else {
      try {
        measurement.date = new Date(measurement.date);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid date format for measurement' },
          { status: 400 }
        );
      }
    }
    
    // Check if progress entry exists for this user
    const existingProgress = await Progress.findOne({ user: body.userId });
    
    if (existingProgress) {
      // Update existing progress by adding new measurement
      const result = await updateDocument(
        Progress,
        existingProgress._id.toString(),
        { $push: { bodyMeasurements: measurement } }
      );
      
      if (!result.success) {
        const errorResponse = {
          success: false,
          message: result.message || 'Error updating progress data',
          errors: result.errors || []
        };
        
        return NextResponse.json(
          errorResponse,
          { status: result.status || 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Measurement added successfully',
        progress: result.data
      });
    } else {
      // Create new progress entry for user
      const newProgress = {
        user: body.userId,
        bodyMeasurements: [measurement],
        workoutHistory: [],
        achievements: [],
        streakDays: 0
      };
      
      const result = await createDocument(Progress, newProgress);
      
      if (!result.success) {
        const errorResponse = {
          success: false,
          message: result.message || 'Error creating progress data',
          errors: result.errors || []
        };
        
        return NextResponse.json(
          errorResponse,
          { status: result.status || 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Progress entry created with measurement',
        progress: result.data
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error recording measurement:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress/achievements
 * Add a new achievement to user's progress
 */
export async function POST_ACHIEVEMENT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.achievement) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: userId and achievement are required' 
        },
        { status: 400 }
      );
    }
    
    // Validate user ID
    if (!isValidObjectId(body.userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Validate achievement object
    const { achievement } = body;
    
    if (!achievement.title || !achievement.description || !achievement.type) {
      return NextResponse.json(
        { success: false, message: 'Achievement must have title, description, and type' },
        { status: 400 }
      );
    }
    
    // Add default values if not provided
    if (!achievement.date) {
      achievement.date = new Date();
    } else {
      try {
        achievement.date = new Date(achievement.date);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: 'Invalid date format for achievement' },
          { status: 400 }
        );
      }
    }
    
    if (achievement.unlocked === undefined) {
      achievement.unlocked = true;
    }
    
    // Check if progress entry exists for this user
    const existingProgress = await Progress.findOne({ user: body.userId });
    
    if (existingProgress) {
      // Update existing progress by adding new achievement
      const result = await updateDocument(
        Progress,
        existingProgress._id.toString(),
        { $push: { achievements: achievement } }
      );
      
      if (!result.success) {
        const errorResponse = {
          success: false,
          message: result.message || 'Error updating achievements',
          errors: result.errors || []
        };
        
        return NextResponse.json(
          errorResponse,
          { status: result.status || 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Achievement added successfully',
        progress: result.data
      });
    } else {
      // Create new progress entry for user with achievement
      const newProgress = {
        user: body.userId,
        bodyMeasurements: [],
        workoutHistory: [],
        achievements: [achievement],
        streakDays: 0
      };
      
      const result = await createDocument(Progress, newProgress);
      
      if (!result.success) {
        const errorResponse = {
          success: false,
          message: result.message || 'Error creating progress with achievement',
          errors: result.errors || []
        };
        
        return NextResponse.json(
          errorResponse,
          { status: result.status || 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Progress entry created with achievement',
        progress: result.data
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error recording achievement:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 