'use client';

import { useState, useEffect } from 'react';
import { authUtils } from '@/lib/authUtils';

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const checkSession = () => {
      try {
        const userData = authUtils.getSession();
        if (userData) {
          setSession(userData);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  return { data: session, status, update: setSession };
} 