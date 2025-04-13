import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/models/User';
import { authUtils } from '@/lib/authUtils';

/**
 * Get the user session from the server (now a mock implementation)
 */
export const getServerUser = async () => {
  // This is now a client-side only implementation
  // Note: In a real application, this would use cookies and validate on the server
  if (typeof window !== 'undefined') {
    const session = authUtils.getSession();
    return session?.user || null;
  }
  return null;
};

/**
 * Authorization middleware for API routes (now a mock implementation)
 */
export const authorize = (
  requiredRoles: UserRole[] = Object.values(UserRole)
) => {
  return async (req: NextRequest) => {
    try {
      // In a real app, we'd extract and verify a JWT token from cookies/headers
      // For our mock implementation, we'll just return a basic response
      return NextResponse.json(
        { message: "Authorization is now client-side only" },
        { status: 200 }
      );
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}; 