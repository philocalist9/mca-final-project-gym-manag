import mongoose from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  rest: string;
  notes?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface IDayPlan {
  day: string;
  exercises: IExercise[];
  notes?: string;
}

export interface IWorkoutPlan extends mongoose.Document {
  name: string;
  description: string;
  goal: string;
  duration: number; // in weeks
  level: string;
  days: IDayPlan[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: String,
    required: false,
  },
  rest: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
  },
});

const DayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Rest'],
  },
  exercises: [ExerciseSchema],
  notes: {
    type: String,
    required: false,
  },
});

const WorkoutPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    goal: {
      type: String,
      required: true,
      enum: ['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance', 'General Fitness', 'Other'],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    days: [DayPlanSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutPlan || mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema); 