'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/components/SessionProvider';
import ThemeToggle from './ThemeToggle';
import { authUtils } from '@/lib/authUtils';
import AnimatedNavButton from './AnimatedNavButton';

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

  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    ...(session ? [{ name: 'Dashboard', href: '/dashboard', icon: '📊' }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <AnimatedNavButton href="/" icon="🏋️" isActive={isActive('/')}>
              Gym Sync
            </AnimatedNavButton>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navigationItems.map((item) => (
                <AnimatedNavButton
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActive(item.href)}
                >
                  {item.name}
                </AnimatedNavButton>
              ))}
            </div>
            <div className="flex items-center ml-4 space-x-2">
              <ThemeToggle />
              
              {!session ? (
                <>
                  <AnimatedNavButton href="/login" icon="🔑">
                    Log in
                  </AnimatedNavButton>
                  <AnimatedNavButton href="/signup" icon="✍️">
                    Sign up
                  </AnimatedNavButton>
                </>
              ) : (
                <div className="flex items-center">
                  <span className="mr-3 text-sm text-gray-600 dark:text-gray-300">
                    Hi, {session.user?.name || 'User'}
                  </span>
                  <AnimatedNavButton
                    href="#"
                    icon="🚪"
                    onClick={(e) => {
                      e.preventDefault();
                      authUtils.logout();
                      router.push('/login');
                    }}
                  >
                    Sign out
                  </AnimatedNavButton>
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
            {navigationItems.map((item) => (
              <AnimatedNavButton
                key={item.href}
                href={item.href}
                icon={item.icon}
                isActive={isActive(item.href)}
              >
                {item.name}
              </AnimatedNavButton>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 px-5">
              {!session ? (
                <>
                  <AnimatedNavButton href="/login" icon="🔑">
                    Log in
                  </AnimatedNavButton>
                  <AnimatedNavButton href="/signup" icon="✍️">
                    Sign up
                  </AnimatedNavButton>
                </>
              ) : (
                <>
                  <div className="py-2 text-base font-medium text-center text-gray-600 dark:text-gray-300">
                    Hi, {session.user?.name || 'User'}
                  </div>
                  <AnimatedNavButton
                    href="#"
                    icon="🚪"
                    onClick={(e) => {
                      e.preventDefault();
                      authUtils.logout();
                      router.push('/login');
                    }}
                  >
                    Sign out
                  </AnimatedNavButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 