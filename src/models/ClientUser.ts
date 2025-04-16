// Client-side version of User model (no mongoose dependencies)

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  GYM_OWNER = 'GYM_OWNER',
  TRAINER = 'TRAINER',
  MEMBER = 'MEMBER'
}

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuperAdmin extends BaseUser {
  role: UserRole.SUPER_ADMIN;
}

export interface GymOwner extends BaseUser {
  role: UserRole.GYM_OWNER;
  gymName: string;
  phone: string;
  address: string;
  isApproved: boolean;
  approvedBy?: string; // ID of the Super Admin who approved
  approvedAt?: Date;
}

export interface Trainer extends BaseUser {
  role: UserRole.TRAINER;
  phone: string;
  isApproved: boolean;
  approvedBy?: string; // ID of the Owner who approved
  approvedAt?: Date;
  assignedMembers?: string[]; // Array of member IDs
  gymId: string; // ID of the gym they belong to
}

export interface Member extends BaseUser {
  role: UserRole.MEMBER;
  phone: string;
  isApproved: boolean;
  approvedBy?: string; // ID of the Owner who approved
  approvedAt?: Date;
  assignedTrainer?: string; // ID of the assigned trainer
  gymId: string; // ID of the gym they belong to
  workoutPlans?: string[]; // Array of workout plan IDs
  attendanceHistory?: Date[];
  progressReports?: {
    date: Date;
    report: string;
    trainerId: string;
  }[];
}

export type User = SuperAdmin | GymOwner | Trainer | Member;

// Basic user interface for client-side use
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Export default empty object to prevent import errors
export default {}; 