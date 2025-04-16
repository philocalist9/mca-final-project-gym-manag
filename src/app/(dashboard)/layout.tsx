'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/components/SessionProvider';
import { UserRole } from '@/models/ClientUser';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Debug session state
  React.useEffect(() => {
    console.log('DashboardLayout - Session status:', status);
    console.log('DashboardLayout - Session data:', session);
  }, [session, status]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated' && !pathname.includes('/login')) {
      console.log('DashboardLayout - Redirecting to login');
      router.push('/login');
    }
  }, [status, router, pathname]);

  // Show loading state while checking auth
  if (status === 'loading') {
    console.log('DashboardLayout - Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sidebar navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Profile', href: '/dashboard/profile', icon: '👤' },
    { name: 'My Workouts', href: '/dashboard/workouts', icon: '💪' },
    { name: 'Progress Tracker', href: '/dashboard/progress', icon: '📈' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: '📅' },
    { name: 'Membership', href: '/dashboard/membership', icon: '🏋️' },
  ];

  // Admin & trainer specific navigation
  if (session?.user?.role === UserRole.SUPER_ADMIN || session?.user?.role === UserRole.TRAINER) {
    navigation.push(
      { name: 'Manage Members', href: '/dashboard/members', icon: '👥' }
    );
  }

  // Admin specific navigation
  if (session?.user?.role === UserRole.ADMIN) {
    navigation.push(
      { name: 'Manage Staff', href: '/dashboard/staff', icon: '👨‍💼' },
      { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
    );
  }

  console.log('DashboardLayout - Rendering with session:', session);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gym Sync</h2>
        </div>
        <nav className="mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                pathname === item.href ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
} 