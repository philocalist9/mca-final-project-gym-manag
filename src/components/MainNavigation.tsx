'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/components/SessionProvider';
import ThemeToggle from './ThemeToggle';
import { authUtils } from '@/lib/authUtils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current: boolean;
}

export default function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const userNavigation = [
    { name: 'Your Profile', href: '/dashboard/profile' },
    { 
      name: 'Sign out', 
      href: '#',
      onClick: () => {
        authUtils.logout();
        router.push('/login');
      }
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Gym Sync</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/about') 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/contact') 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                Contact
              </Link>
              {session && (
                <Link 
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname?.startsWith('/dashboard') 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
            <div className="flex items-center ml-4 space-x-2">
              <ThemeToggle />
              
              {!session ? (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="ml-3 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="flex items-center">
                  <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                    Hi, {session.user?.name || 'User'}
                  </span>
                  <Link
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      authUtils.logout();
                      router.push('/login');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' 
                  : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' 
                  : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/contact') 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' 
                  : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Contact
            </Link>
            {session && (
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname?.startsWith('/dashboard') 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 px-5">
              {!session ? (
                <>
                  <Link 
                    href="/login" 
                    className="block py-2 text-base font-medium text-center text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-md"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="block py-2 text-base font-medium text-center text-white bg-indigo-600 dark:bg-indigo-500 rounded-md"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <div className="py-2 text-base font-medium text-center text-gray-600 dark:text-gray-300">
                    Hi, {session.user?.name || 'User'}
                  </div>
                  <Link
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      authUtils.logout();
                      router.push('/login');
                    }}
                    className="block py-2 text-base font-medium text-center text-white bg-indigo-600 dark:bg-indigo-500 rounded-md"
                  >
                    Sign out
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 