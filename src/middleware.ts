import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authUtils } from '@/lib/authUtils';
import { UserRole } from '@/models/ClientUser';

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/admin': [UserRole.SUPER_ADMIN, UserRole.OWNER],
  '/admin/users': [UserRole.SUPER_ADMIN, UserRole.OWNER],
  '/admin/trainers': [UserRole.SUPER_ADMIN, UserRole.OWNER],
  '/admin/members': [UserRole.SUPER_ADMIN, UserRole.OWNER],
  '/admin/reports': [UserRole.SUPER_ADMIN, UserRole.OWNER],
  '/trainer': [UserRole.TRAINER],
  '/trainer/members': [UserRole.TRAINER],
  '/trainer/plans': [UserRole.TRAINER],
  '/member': [UserRole.MEMBER],
  '/member/workouts': [UserRole.MEMBER],
  '/member/progress': [UserRole.MEMBER],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const routeRoles = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  )?.[1];

  if (routeRoles) {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user role
    const userRole = authUtils.getUserRole();
    
    // Check if user has required role
    if (!userRole || !routeRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // For Owner, Trainer, and Member, check if they are approved
    if (userRole !== UserRole.SUPER_ADMIN) {
      const user = authUtils.getUser();
      if (!user?.isApproved) {
        return NextResponse.redirect(new URL('/pending-approval', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/trainer/:path*',
    '/member/:path*',
  ],
}; 