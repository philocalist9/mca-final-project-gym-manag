import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workout from '@/models/Workout';
import Progress from '@/models/Progress';
import { WorkoutStatus, WorkoutIntensity } from '@/models/Workout';
import { isValidObjectId } from '@/lib/dbUtils';

/**
 * POST /api/user-input/workout
 * Handle user workout input and save to MongoDB
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'workoutName', 'exercises', 'duration', 'intensity'];
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
    
    // Create exercises array with proper structure
    const exercises = body.exercises.map((exercise: any, index: number) => ({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: exercise.sets || 3,
      reps: exercise.reps || 10,
      restTime: exercise.restTime || 60,
      weight: exercise.weight,
      notes: exercise.notes || '',
      completed: exercise.completed || false
    }));
    
    // Create the workout document
    const workout = new Workout({
      user: body.userId,
      name: body.workoutName,
      date: body.date || new Date(),
      duration: body.duration,
      intensity: body.intensity,
      status: body.status || WorkoutStatus.COMPLETED,
      exercises: exercises,
      caloriesBurned: body.caloriesBurned,
      location: body.location || 'Gym',
      trainer: body.trainerId,
      isTemplate: false,
      completedTime: new Date()
    });
    
    // Save the workout
    const savedWorkout = await workout.save();
    
    // Update progress record with this workout
    const workoutRecord = {
      date: savedWorkout.date,
      workoutId: savedWorkout._id,
      duration: savedWorkout.duration,
      caloriesBurned: savedWorkout.caloriesBurned,
      exercises: savedWorkout.exercises.map(ex => ({
        exerciseId: ex._id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        completed: ex.completed,
        notes: ex.notes
      })),
      intensity: savedWorkout.intensity,
      notes: body.notes
    };
    
    // Find or create progress document for this user
    let progress = await Progress.findOne({ user: body.userId });
    
    if (progress) {
      // Add workout to existing progress
      progress.workoutHistory.push(workoutRecord);
      await progress.save();
    } else {
      // Create new progress document
      progress = new Progress({
        user: body.userId,
        bodyMeasurements: [],
        workoutHistory: [workoutRecord],
        achievements: [],
        streakDays: 1
      });
      await progress.save();
    }
    
    return NextResponse.json({
      success: true, 
      message: 'Workout logged successfully',
      workout: savedWorkout
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user-input/workout
 * Get user's workouts
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
    
    // Query options to sort by date descending (newest first)
    const options = {
      sort: { date: -1 }
    };
    
    // Get workouts for the user
    const workouts = await Workout.find({ user: userId }, null, options);
    
    return NextResponse.json({
      success: true,
      workouts,
      count: workouts.length
    });
    
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 