import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/initDb';

export async function POST(request: NextRequest) {
  try {
    // Initialize the database with default users if needed
    await initializeDatabase();
    
    return NextResponse.json(
      { success: true, message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in init-db API route:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'Error initializing database' },
      { status: 500 }
    );
  }
} 