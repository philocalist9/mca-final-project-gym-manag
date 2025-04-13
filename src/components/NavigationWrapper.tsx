'use client';

import { ReactNode } from 'react';
import SessionProvider from './SessionProvider';
import MainNavigation from './MainNavigation';

interface NavigationWrapperProps {
  children?: ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  // Create empty session for initial state
  const mockSession = { user: null };
  
  return (
    <SessionProvider session={mockSession}>
      <MainNavigation />
      {children}
    </SessionProvider>
  );
}
