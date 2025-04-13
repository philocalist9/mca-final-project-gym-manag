import dbConnect from '@/lib/db';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * Seed the database with an initial admin user
 */
export async function seedAdmin() {
  try {
    await dbConnect();

    // Check if an admin already exists
    const adminExists = await User.findOne({ role: UserRole.GYM_OWNER });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Gym Owner',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.GYM_OWNER,
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

/**
 * Run all seed functions
 */
export async function seedDatabase() {
  await seedAdmin();
  console.log('Database seeding completed');
}

// Allow running directly via command line
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error seeding database:', error);
      process.exit(1);
    });
} 