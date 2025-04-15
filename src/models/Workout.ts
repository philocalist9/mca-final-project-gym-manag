import mongoose, { Document, Schema } from 'mongoose';

// Enum for workout status
export enum WorkoutStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

// Enum for workout intensity
export enum WorkoutIntensity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Interface for exercise in a workout
export interface IWorkoutExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  weight?: number; // in kg
  notes?: string;
  completed: boolean;
  timeCompleted?: Date;
  actualSets?: number;
  actualReps?: number;
  actualWeight?: number;
}

// Interface for the workout document
export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId;
  workoutPlan?: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  scheduledTime?: Date;
  completedTime?: Date;
  duration: number; // in minutes
  intensity: WorkoutIntensity;
  status: WorkoutStatus;
  exercises: IWorkoutExercise[];
  notes?: string;
  caloriesBurned?: number;
  location?: string;
  trainer?: mongoose.Types.ObjectId;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for workout exercise
const WorkoutExerciseSchema = new Schema<IWorkoutExercise>({
  name: {
    type: String,
    required: [true, 'Exercise name is required']
  },
  muscleGroup: {
    type: String,
    required: [true, 'Muscle group is required']
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
  restTime: {
    type: Number,
    required: [true, 'Rest time is required'],
    min: [0, 'Rest time cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeCompleted: {
    type: Date
  },
  actualSets: {
    type: Number,
    min: [0, 'Actual sets cannot be negative']
  },
  actualReps: {
    type: Number,
    min: [0, 'Actual reps cannot be negative']
  },
  actualWeight: {
    type: Number,
    min: [0, 'Actual weight cannot be negative']
  }
});

// Schema for workout
const WorkoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    workoutPlan: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan'
    },
    name: {
      type: String,
      required: [true, 'Workout name is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Workout date is required'],
      default: Date.now
    },
    scheduledTime: {
      type: Date
    },
    completedTime: {
      type: Date
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration cannot be less than 1 minute']
    },
    intensity: {
      type: String,
      enum: Object.values(WorkoutIntensity),
      required: [true, 'Intensity is required'],
      default: WorkoutIntensity.MEDIUM
    },
    status: {
      type: String,
      enum: Object.values(WorkoutStatus),
      required: [true, 'Status is required'],
      default: WorkoutStatus.SCHEDULED
    },
    exercises: {
      type: [WorkoutExerciseSchema],
      required: [true, 'Exercises are required'],
      validate: [
        (exercises: IWorkoutExercise[]) => exercises.length > 0,
        'At least one exercise is required'
      ]
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isTemplate: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for completion percentage
WorkoutSchema.virtual('completionPercentage').get(function() {
  if (this.exercises.length === 0) return 0;
  const completedExercises = this.exercises.filter(ex => ex.completed).length;
  return Math.round((completedExercises / this.exercises.length) * 100);
});

// Method to mark workout as completed
WorkoutSchema.methods.markAsCompleted = function(caloriesBurned?: number) {
  this.status = WorkoutStatus.COMPLETED;
  this.completedTime = new Date();
  if (caloriesBurned) this.caloriesBurned = caloriesBurned;
  
  // Mark all exercises as completed if they aren't already
  this.exercises.forEach(exercise => {
    if (!exercise.completed) {
      exercise.completed = true;
      exercise.timeCompleted = new Date();
      
      // If actual values aren't set, use the planned values
      if (!exercise.actualSets) exercise.actualSets = exercise.sets;
      if (!exercise.actualReps) exercise.actualReps = exercise.reps;
      if (!exercise.actualWeight) exercise.actualWeight = exercise.weight;
    }
  });
  
  return this.save();
};

// Create and export the Workout model
export default mongoose.models.Workout as mongoose.Model<IWorkout> || 
  mongoose.model<IWorkout>('Workout', WorkoutSchema); 