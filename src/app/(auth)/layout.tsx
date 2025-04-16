'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/components/SessionProvider';
import { UserRole } from '@/models/ClientUser';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'authenticated' && session?.user) {
        const userRole = session.user.role;
        
        if (userRole === UserRole.OWNER) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [status, session, router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
} 