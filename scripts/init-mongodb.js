#!/usr/bin/env node

/**
 * MongoDB Initialization Script
 * Initializes the MongoDB database with sample data for development
 * 
 * Usage:
 * node scripts/init-mongodb.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const API_URL = 'http://localhost:3001/api/init-db';
const AUTH_TOKEN = 'Bearer dev-setup-token';

// Ensure the application is running
let isAppRunning = false;
try {
  // Check if the app is already running by making a simple request
  console.log('Checking if application is running...');
  const result = execSync(`curl -s -o /dev/null -w "%{http_code}" ${API_URL}`).toString().trim();
  isAppRunning = result === '200';
} catch (error) {
  isAppRunning = false;
}

if (!isAppRunning) {
  console.log('Application does not appear to be running. Please start it with:');
  console.log('  npm run dev');
  process.exit(1);
}

// Initialize the database
console.log('Initializing MongoDB with sample data...');
try {
  const result = execSync(`curl -s -X POST ${API_URL} -H "Authorization: ${AUTH_TOKEN}"`).toString();
  
  try {
    const response = JSON.parse(result);
    
    if (response.success) {
      console.log('✅ MongoDB initialized successfully!');
      console.log('Sample data has been created for:');
      console.log('  - Users (members, trainers, admin)');
      console.log('  - Workout Plans');
      console.log('  - Workouts');
      console.log('  - Profiles');
      console.log('  - Memberships');
      console.log('  - Appointments');
      console.log('  - Progress Tracking');
    } else {
      console.error('❌ Failed to initialize MongoDB:', response.message);
      if (response.error) {
        console.error('Error details:', response.error);
      }
      process.exit(1);
    }
  } catch (parseError) {
    console.error('❌ Error parsing response:', result);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error initializing MongoDB:', error.message);
  process.exit(1);
} 