import mongoose from 'mongoose';

export enum MembershipStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum MembershipPlan {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export interface IClient extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  membership: {
    plan: MembershipPlan;
    startDate: Date;
    endDate: Date;
    status: MembershipStatus;
    amount: number;
    lastRenewalNotification?: Date;
  };
  healthMetrics: mongoose.Types.ObjectId[];
  assignedWorkoutPlan: mongoose.Types.ObjectId | null;
  assignedDietPlan: mongoose.Types.ObjectId | null;
  notes: string;
  qrCode: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide client phone number'],
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    emergencyContact: {
      name: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
      relationship: {
        type: String,
        required: false,
      },
    },
    membership: {
      plan: {
        type: String,
        enum: Object.values(MembershipPlan),
        default: MembershipPlan.MONTHLY,
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(MembershipStatus),
        default: MembershipStatus.ACTIVE,
      },
      amount: {
        type: Number,
        required: true,
      },
      lastRenewalNotification: {
        type: Date,
        required: false,
      },
    },
    healthMetrics: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthMetric',
    }],
    assignedWorkoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      default: null,
    },
    assignedDietPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DietPlan',
      default: null,
    },
    notes: {
      type: String,
      required: false,
    },
    qrCode: {
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

// Generate a QR code when a client is created
ClientSchema.pre('save', function (next) {
  if (this.isNew) {
    // In a real application, you'd use a library like `qrcode` to generate this
    // For now, we'll just use a simple placeholder
    this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this._id}`;
  }
  next();
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema); 