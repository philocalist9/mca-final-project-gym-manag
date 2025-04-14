import mongoose from 'mongoose';

export interface IAttendance extends mongoose.Document {
  client: mongoose.Types.ObjectId;
  checkInTime: Date;
  checkOutTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate duration when checkout is recorded
AttendanceSchema.pre('save', function (next) {
  if (this.checkInTime && this.checkOutTime) {
    // Duration in minutes
    const checkIn = new Date(this.checkInTime).getTime();
    const checkOut = new Date(this.checkOutTime).getTime();
    this.duration = Math.round((checkOut - checkIn) / (1000 * 60));
  }
  next();
});

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema); 