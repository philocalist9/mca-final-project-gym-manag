'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/authUtils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is already logged in
      if (authUtils.isAuthenticated()) {
        const userRole = authUtils.getUserRole();
        console.log('Auth Layout - Current user role:', userRole);
        
        if (userRole === 'admin') {
          console.log('Auth Layout - Redirecting to admin panel');
          router.push('/admin');
        } else {
          console.log('Auth Layout - Redirecting to dashboard');
          router.push('/dashboard');
        }
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
} 