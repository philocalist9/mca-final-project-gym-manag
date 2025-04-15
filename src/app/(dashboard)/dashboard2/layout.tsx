'use client';

import React from 'react';
import { useSession } from '@/components/SessionProvider';

export default function Dashboard2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Dashboard header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold ml-2">Trainer Dashboard 2.0</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Profile info */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {session?.user?.name?.charAt(0) || 'T'}
            </div>
            <span className="ml-2 font-medium hidden md:inline-block">
              {session?.user?.name || 'Trainer'}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
} 