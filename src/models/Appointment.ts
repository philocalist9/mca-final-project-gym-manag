import mongoose, { Document, Schema } from 'mongoose';

// Enum for appointment status
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

// Enum for appointment types
export enum AppointmentType {
  PERSONAL_TRAINING = 'personal_training',
  CONSULTATION = 'consultation',
  FITNESS_ASSESSMENT = 'fitness_assessment',
  NUTRITION_COUNSELING = 'nutrition_counseling',
  GROUP_CLASS = 'group_class',
  OTHER = 'other'
}

// Interface for appointment document
export interface IAppointment extends Document {
  client: mongoose.Types.ObjectId;
  trainer: mongoose.Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for appointment
const AppointmentSchema = new Schema<IAppointment>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required']
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trainer is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes']
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED
    },
    type: {
      type: String,
      enum: Object.values(AppointmentType),
      required: [true, 'Appointment type is required']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot be more than 100 characters']
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Appointment model
export default mongoose.models.Appointment as mongoose.Model<IAppointment> || 
  mongoose.model<IAppointment>('Appointment', AppointmentSchema); 