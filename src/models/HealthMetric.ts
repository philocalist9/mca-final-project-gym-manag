import mongoose from 'mongoose';

export interface IHealthMetric extends mongoose.Document {
  client: mongoose.Types.ObjectId;
  date: Date;
  weight: number;
  height: number;
  bmi: number;
  bodyFatPercentage: number;
  musclePercentage: number;
  restingHeartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  notes: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HealthMetricSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    bmi: {
      type: Number,
      required: false,
    },
    bodyFatPercentage: {
      type: Number,
      required: false,
    },
    musclePercentage: {
      type: Number,
      required: false,
    },
    restingHeartRate: {
      type: Number,
      required: false,
    },
    bloodPressure: {
      systolic: {
        type: Number,
        required: false,
      },
      diastolic: {
        type: Number,
        required: false,
      },
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate BMI if weight and height are provided
HealthMetricSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    // BMI formula: weight (kg) / (height (m) * height (m))
    // Note: height is typically stored in cm, so we convert to meters
    const heightInMeters = this.height / 100;
    this.bmi = this.weight / (heightInMeters * heightInMeters);
    this.bmi = parseFloat(this.bmi.toFixed(2)); // Round to 2 decimal places
  }
  next();
});

export default mongoose.models.HealthMetric || mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema); 