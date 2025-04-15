const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shivam52567:9506125436@cluster0.dhrxicv.mongodb.net/gym-management';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');

    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Creating default users...');
      
      // Create default admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin'
      });
      
      // Create default trainer user
      await User.create({
        name: 'Trainer User',
        email: 'trainer@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'trainer'
      });
      
      // Create default member user
      await User.create({
        name: 'Member User',
        email: 'member@gym.com',
        password: await bcrypt.hash('password123', 10),
        role: 'member'
      });
      
      console.log('Default users created successfully!');
      console.log('You can now login with:');
      console.log('Admin: admin@gym.com / password123');
      console.log('Trainer: trainer@gym.com / password123');
      console.log('Member: member@gym.com / password123');
    } else {
      console.log('Database already has users. Skipping initialization.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 