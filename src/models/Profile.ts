import mongoose, { Document, Schema } from 'mongoose';

// Enum for gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Enum for fitness goals
export enum FitnessGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  OVERALL_FITNESS = 'overall_fitness',
  ATHLETIC_PERFORMANCE = 'athletic_performance',
  REHABILITATION = 'rehabilitation',
  MAINTENANCE = 'maintenance'
}

// Enum for fitness levels
export enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

// Interface for address information
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Interface for fitness profile
export interface IFitnessProfile {
  height: number; // in cm
  weight: number; // in kg
  bmi?: number;
  bodyFat?: number; // percentage
  fitnessLevel: FitnessLevel;
  fitnessGoals: FitnessGoal[];
  medicalConditions?: string[];
  allergies?: string[];
  injuries?: string[];
  preferredWorkoutDays?: string[];
}

// Interface for emergency contact
export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Interface for the profile document
export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  gender: Gender;
  dateOfBirth: Date;
  phoneNumber: string;
  address: IAddress;
  profileImage?: string;
  bio?: string;
  fitnessProfile: IFitnessProfile;
  emergencyContact: IEmergencyContact;
  preferredTrainers?: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for address
const AddressSchema = new Schema<IAddress>({
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'United States'
  }
});

// Schema for fitness profile
const FitnessProfileSchema = new Schema<IFitnessProfile>({
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [50, 'Height cannot be less than 50cm']
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
  fitnessLevel: {
    type: String,
    enum: Object.values(FitnessLevel),
    default: FitnessLevel.BEGINNER
  },
  fitnessGoals: [{
    type: String,
    enum: Object.values(FitnessGoal)
  }],
  medicalConditions: [String],
  allergies: [String],
  injuries: [String],
  preferredWorkoutDays: [String]
});

// Virtual for BMI calculation
FitnessProfileSchema.virtual('bmi').get(function() {
  // BMI = weight (kg) / (height (m))^2
  const heightInMeters = this.height / 100;
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Schema for emergency contact
const EmergencyContactSchema = new Schema<IEmergencyContact>({
  name: {
    type: String,
    required: [true, 'Emergency contact name is required']
  },
  relationship: {
    type: String,
    required: [true, 'Relationship is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  }
});

// Schema for user profile
const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: [true, 'Gender is required']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required']
    },
    address: {
      type: AddressSchema,
      required: [true, 'Address information is required']
    },
    profileImage: {
      type: String
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    fitnessProfile: {
      type: FitnessProfileSchema,
      required: [true, 'Fitness profile is required']
    },
    emergencyContact: {
      type: EmergencyContactSchema,
      required: [true, 'Emergency contact is required']
    },
    preferredTrainers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create and export the Profile model
export default mongoose.models.Profile as mongoose.Model<IProfile> || 
  mongoose.model<IProfile>('Profile', ProfileSchema); 