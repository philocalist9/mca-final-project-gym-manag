import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/models/User';

// Export authOptions for compatibility with existing code
export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: 'mock-secret-for-client-side-auth',
};

// Mock authentication implementation using localStorage
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Authentication endpoint is now client-side only using localStorage"
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: "Authentication endpoint is now client-side only using localStorage"
  });
}

// Note: The actual authentication logic has been moved to client-side
// and uses localStorage instead of a server-side implementation 