// This file is used to start background jobs for the application
import { startBackgroundJobs } from './utils/jobs';

// Start background jobs when the server starts
startBackgroundJobs();

console.log('Server started with background jobs'); 