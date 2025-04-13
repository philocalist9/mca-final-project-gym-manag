'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/components/SessionProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking auth
  if (status === 'loading') {
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
  if (session?.user?.role === 'admin' || session?.user?.role === 'trainer') {
    navigation.push(
      { name: 'Manage Members', href: '/dashboard/members', icon: '👥' }
    );
  }

  // Admin specific navigation
  if (session?.user?.role === 'admin') {
    navigation.push(
      { name: 'Manage Staff', href: '/dashboard/staff', icon: '👨‍💼' },
      { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Gym Sync</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <span className="mr-3 h-6 w-6 text-center">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="mr-3 h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {session?.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-500 capitalize">
                    {session?.user?.role || 'Member'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Gym Sync</span>
          <button className="text-gray-600 dark:text-gray-300">
            ≡
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 pt-8 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 