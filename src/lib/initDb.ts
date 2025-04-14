import dbConnect from './db';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * Initialize the database with default users if they don't already exist
 */
export async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    
    // Only create default users if the database is empty
    if (userCount === 0) {
      console.log('Creating default users...');
      
      // Create default admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.ADMIN
      });
      
      // Create default trainer user
      await User.create({
        name: 'Trainer User',
        email: 'trainer@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.TRAINER
      });
      
      // Create default member user
      await User.create({
        name: 'Member User',
        email: 'member@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MEMBER
      });
      
      console.log('Default users created successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
} 