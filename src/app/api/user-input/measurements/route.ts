import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Progress from '@/models/Progress';
import { isValidObjectId } from '@/lib/dbUtils';

/**
 * POST /api/user-input/measurements
 * Add a new body measurement record for a user
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'weight'];
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
    if (!isValidObjectId(body.userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Create measurement object
    const measurement = {
      date: body.date ? new Date(body.date) : new Date(),
      weight: body.weight,
      bodyFat: body.bodyFat,
      chest: body.chest,
      waist: body.waist,
      hips: body.hips,
      thighs: body.thighs,
      arms: body.arms,
      shoulders: body.shoulders,
      notes: body.notes || `Measurement taken on ${new Date().toLocaleDateString()}`
    };
    
    // Find or create progress document for this user
    let progress = await Progress.findOne({ user: body.userId });
    
    if (progress) {
      // Add measurement to existing progress
      progress.bodyMeasurements.push(measurement);
      await progress.save();
    } else {
      // Create new progress document
      progress = new Progress({
        user: body.userId,
        bodyMeasurements: [measurement],
        workoutHistory: [],
        achievements: [],
        streakDays: 0
      });
      await progress.save();
    }
    
    // Check if this is a significant weight loss achievement
    const checkForWeightLossAchievement = async (progress: any) => {
      const measurements = progress.bodyMeasurements;
      
      // Need at least 2 measurements to compare
      if (measurements.length >= 2) {
        // Sort by date (oldest first)
        const sortedMeasurements = [...measurements].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Get first and most recent measurements
        const firstMeasurement = sortedMeasurements[0];
        const recentMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
        
        // Calculate weight loss in kg
        const weightLoss = firstMeasurement.weight - recentMeasurement.weight;
        
        // If lost at least 2kg, add achievement (if doesn't already exist)
        if (weightLoss >= 2) {
          const weightLossAchievementExists = progress.achievements.some(
            (a: any) => a.type === 'weight' && a.title.includes('Weight Loss')
          );
          
          if (!weightLossAchievementExists) {
            progress.achievements.push({
              title: 'Weight Loss Achievement',
              description: `Lost ${weightLoss.toFixed(1)}kg since starting your fitness journey!`,
              date: new Date(),
              type: 'weight',
              icon: '⚖️',
              unlocked: true
            });
            
            await progress.save();
          }
        }
      }
    };
    
    // Check for potential achievements
    await checkForWeightLossAchievement(progress);
    
    return NextResponse.json({
      success: true, 
      message: 'Measurement recorded successfully',
      measurement
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error saving measurement:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user-input/measurements
 * Get a user's body measurements
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
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
    
    // Get progress document for the user
    const progress = await Progress.findOne({ user: userId });
    
    if (!progress) {
      return NextResponse.json({
        success: true,
        measurements: [],
        count: 0
      });
    }
    
    // Sort measurements by date (newest first)
    const measurements = [...progress.bodyMeasurements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json({
      success: true,
      measurements,
      count: measurements.length
    });
    
  } catch (error: any) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 