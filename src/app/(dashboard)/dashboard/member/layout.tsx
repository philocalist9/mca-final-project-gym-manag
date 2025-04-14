'use client';

import { useState } from 'react';
import { useSession } from '@/components/SessionProvider';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Bell, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { authUtils } from '@/lib/authUtils';

const MemberLayout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/member', icon: '🏠' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { name: 'Workout Plans', href: '/dashboard/member/workouts', icon: '💪' },
    { name: 'Class Schedule', href: '/dashboard/member/schedule', icon: '📅' },
    { name: 'Progress Tracking', href: '/dashboard/member/progress', icon: '📊' },
    { name: 'Nutrition Log', href: '/dashboard/member/nutrition', icon: '🥗' },
    { name: 'Payments/Billing', href: '/dashboard/member/billing', icon: '💰' },
    { name: 'Account Settings', href: '/dashboard/member/settings', icon: '⚙️' },
  ];

  // Handle sign out
  const handleSignOut = () => {
    authUtils.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Mobile menu button */}
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard/member" className="flex items-center">
                  <span className="text-2xl font-bold text-[#2A5C99] dark:text-white">GymSync</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5" />
              </button>

              {/* Profile dropdown */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Link href="/dashboard/profile">
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={(session?.user as any)?.image || '/default-avatar.svg'}
                      alt="Profile"
                      width={32}
                      height={32}
                    />
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Link href="/dashboard/profile" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {session?.user?.name}
                  </Link>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberLayout; 