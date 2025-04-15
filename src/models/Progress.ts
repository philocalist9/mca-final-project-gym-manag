import mongoose, { Document, Schema } from 'mongoose';

// Interface for body measurements
export interface IBodyMeasurement {
  date: Date;
  weight: number; // in kg
  bodyFat?: number; // percentage
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  thighs?: number; // in cm
  arms?: number; // in cm
  shoulders?: number; // in cm
  notes?: string;
}

// Interface for workout record
export interface IWorkoutRecord {
  date: Date;
  workoutId: mongoose.Types.ObjectId;
  duration: number; // in minutes
  caloriesBurned?: number;
  exercises: Array<{
    exerciseId: mongoose.Types.ObjectId | string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    completed: boolean;
    notes?: string;
  }>;
  intensity: 'low' | 'medium' | 'high';
  rating?: number; // 1-5
  notes?: string;
}

// Interface for achievement
export interface IAchievement {
  title: string;
  description: string;
  date: Date;
  type: 'workout' | 'attendance' | 'milestone' | 'weight' | 'custom';
  icon?: string;
  unlocked: boolean;
}

// Interface for the progress document
export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  bodyMeasurements: IBodyMeasurement[];
  workoutHistory: IWorkoutRecord[];
  achievements: IAchievement[];
  totalWorkouts: number;
  totalWorkoutTime: number; // in minutes
  streakDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for body measurement
const BodyMeasurementSchema = new Schema<IBodyMeasurement>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [20, 'Weight cannot be less than 20kg']
  },
  bodyFat: {
    type: Number,
    min: [1, 'Body fat percentage cannot be less than 1%'],
    max: [60, 'Body fat percentage cannot be more than 60%']
  },
  chest: {
    type: Number,
    min: [30, 'Chest measurement cannot be less than 30cm']
  },
  waist: {
    type: Number,
    min: [30, 'Waist measurement cannot be less than 30cm']
  },
  hips: {
    type: Number,
    min: [30, 'Hips measurement cannot be less than 30cm']
  },
  thighs: {
    type: Number,
    min: [20, 'Thigh measurement cannot be less than 20cm']
  },
  arms: {
    type: Number,
    min: [15, 'Arm measurement cannot be less than 15cm']
  },
  shoulders: {
    type: Number,
    min: [30, 'Shoulder measurement cannot be less than 30cm']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  }
});

// Schema for workout exercise
const ExerciseRecordSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  },
  name: {
    type: String,
    required: [true, 'Exercise name is required']
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Sets cannot be less than 1']
  },
  reps: {
    type: Number,
    required: [true, 'Number of reps is required'],
    min: [1, 'Reps cannot be less than 1']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  }
});

// Schema for workout record
const WorkoutRecordSchema = new Schema<IWorkoutRecord>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: 'Workout',
    required: [true, 'Workout reference is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration cannot be less than 1 minute']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative']
  },
  exercises: [ExerciseRecordSchema],
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, 'Intensity is required']
  },
  rating: {
    type: Number,
    min: [1, 'Rating cannot be less than 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  }
});

// Schema for achievement
const AchievementSchema = new Schema<IAchievement>({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['workout', 'attendance', 'milestone', 'weight', 'custom'],
    required: [true, 'Type is required']
  },
  icon: {
    type: String
  },
  unlocked: {
    type: Boolean,
    default: false
  }
});

// Schema for progress
const ProgressSchema = new Schema<IProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true
    },
    bodyMeasurements: [BodyMeasurementSchema],
    workoutHistory: [WorkoutRecordSchema],
    achievements: [AchievementSchema],
    streakDays: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total workouts calculation
ProgressSchema.virtual('totalWorkouts').get(function() {
  return this.workoutHistory.length;
});

// Virtual for total workout time calculation
ProgressSchema.virtual('totalWorkoutTime').get(function() {
  return this.workoutHistory.reduce((total, workout) => total + workout.duration, 0);
});

// Create and export the Progress model
export default mongoose.models.Progress as mongoose.Model<IProgress> || 
  mongoose.model<IProgress>('Progress', ProgressSchema); 