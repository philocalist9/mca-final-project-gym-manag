// Client-side version of User model (no mongoose dependencies)

export enum UserRole {
  GYM_OWNER = 'gym_owner',
  ADMIN = 'admin',
  TRAINER = 'trainer',
  MEMBER = 'member'
}

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