import mongoose, { Document, Schema } from 'mongoose';

// Enum for membership plan types
export enum MembershipPlanType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  STUDENT = 'student',
  FAMILY = 'family',
  CORPORATE = 'corporate',
  SENIOR = 'senior'
}

// Enum for payment status
export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Interface for a single payment record
export interface IPaymentRecord {
  date: Date;
  amount: number;
  method: string;
  transactionId?: string;
  notes?: string;
  status: PaymentStatus;
}

// Interface for the membership document
export interface IMembership extends Document {
  client: mongoose.Types.ObjectId;
  planType: MembershipPlanType;
  startDate: Date;
  endDate: Date;
  price: number;
  isActive: boolean;
  autoRenew: boolean;
  paymentStatus: PaymentStatus;
  paymentHistory: IPaymentRecord[];
  remainingDays: number;
  membershipNumber: string;
  assignedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for payment records
const PaymentRecordSchema = new Schema<IPaymentRecord>({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'online_payment', 'other']
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PAID
  }
});

// Schema for membership
const MembershipSchema = new Schema<IMembership>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client is required']
    },
    planType: {
      type: String,
      enum: Object.values(MembershipPlanType),
      required: [true, 'Membership plan type is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    paymentHistory: [PaymentRecordSchema],
    membershipNumber: {
      type: String,
      unique: true,
      required: [true, 'Membership number is required']
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for remaining days calculation
MembershipSchema.virtual('remainingDays').get(function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Pre-save hook to generate membership number if not provided
MembershipSchema.pre('save', async function(next) {
  if (!this.membershipNumber) {
    // Generate a random membership number with prefix "MEM-" followed by 8 digits
    this.membershipNumber = `MEM-${Math.floor(10000000 + Math.random() * 90000000)}`;
  }
  next();
});

// Create and export the Membership model
export default mongoose.models.Membership as mongoose.Model<IMembership> || 
  mongoose.model<IMembership>('Membership', MembershipSchema); 