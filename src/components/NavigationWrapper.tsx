'use client';

import { ReactNode } from 'react';
import MainNavigation from './MainNavigation';

interface NavigationWrapperProps {
  children?: ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  return (
    <>
      <MainNavigation />
      {children}
    </>
  );
}
