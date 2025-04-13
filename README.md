# Gym Management System

A full-stack web application built with Next.js, MongoDB, and TypeScript for gym owners and staff to manage gym operations efficiently.

## Features

- 🔐 **Authentication & User Roles**: Secure login with role-based access (Gym Owner, Admin, Trainer)
- 👥 **Client Management**: Add, update, view, and delete client profiles
- 🏋️ **Membership Management**: Track membership details, renewal dates, and status
- 📊 **Health Tracking**: Record and visualize client health metrics over time
- 📋 **Workout & Diet Plans**: Create and assign personalized workout and diet plans to clients
- ✅ **Attendance Tracking**: Mark attendance with optional QR code scanning
- 📱 **Responsive Dashboard**: Modern UI built with Tailwind CSS
- 📧 **Automated Notifications**: Email reminders for membership renewals

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Backend**: Node.js (built into Next.js API routes)
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Email**: Nodemailer
- **Scheduled Tasks**: node-cron
- **TypeScript**: For type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/gym-management-system.git
   cd gym-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-in-production

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/gym-management

   # Email (for nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=no-reply@yourgym.com

   # App URL (used for links in emails)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Seed the database with an initial admin user
   ```bash
   npm run seed
   ```
   This will create an admin user with:
   - Email: admin@example.com
   - Password: admin123

5. Start the development server
   ```bash
   npm run dev
   ```

6. Start the background jobs (for email notifications)
   ```bash
   npm run jobs
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login Credentials

After running the seed script, you can log in with:
- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

- `/src/app`: Next.js pages and layouts
- `/src/components`: Reusable UI components
- `/src/lib`: Utility libraries (database connection, etc.)
- `/src/models`: MongoDB schema models
- `/src/utils`: Utility functions (auth, email, etc.)
- `/public`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.
