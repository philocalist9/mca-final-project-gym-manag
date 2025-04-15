/**
 * MongoDB Atlas Configuration
 * This file contains configuration settings for MongoDB Atlas connection
 */

// MongoDB Connection Options
export const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

// MongoDB Clusters - Configured with MongoDB Atlas cluster
export const MONGODB_CLUSTERS = {
  development: 'mongodb+srv://shivam52567:9506125436@cluster0.dhrxicv.mongodb.net/gym-management',
  test: 'mongodb+srv://shivam52567:9506125436@cluster0.dhrxicv.mongodb.net/gym-management-test',
  production: 'mongodb+srv://shivam52567:9506125436@cluster0.dhrxicv.mongodb.net/gym-management-prod'
};

// Get current environment (defaults to development)
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Get MongoDB URI based on environment
export const getMongoDBUri = (): string => {
  return process.env.MONGODB_URI || MONGODB_CLUSTERS[NODE_ENV as keyof typeof MONGODB_CLUSTERS] || MONGODB_CLUSTERS.development;
};

// Database Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  TRAINERS: 'trainers',
  WORKOUTS: 'workouts',
  WORKOUT_PLANS: 'workoutplans',
  APPOINTMENTS: 'appointments',
  MEMBERSHIPS: 'memberships',
  PROFILES: 'profiles',
  PROGRESS: 'progress',
  ATTENDANCE: 'attendance'
};

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
}; 