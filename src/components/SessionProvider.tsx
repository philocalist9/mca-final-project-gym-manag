'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, authUtils } from '@/lib/authUtils';

// Create a context to share session state across the app
const SessionContext = createContext<{
  session: Session | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  update: () => Promise<Session | null>;
}>({
  session: null,
  status: 'loading',
  update: async () => null
});

// Custom hook to use session context
export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ 
  children,
  session: initialSession
}: { 
  children: React.ReactNode;
  session: any;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');

  useEffect(() => {
    // Browser-only code
    if (typeof window !== 'undefined') {
      console.log('SessionProvider: Initializing...');
      // Get session from localStorage on client-side
      const clientSession = authUtils.getSession();
      console.log('SessionProvider: Retrieved session from localStorage:', clientSession);
      setSession(clientSession);
      setStatus(clientSession ? 'authenticated' : 'unauthenticated');
      console.log('SessionProvider: Updated status to:', clientSession ? 'authenticated' : 'unauthenticated');
    }
  }, []);

  const update = async () => {
    if (typeof window === 'undefined') return null;
    
    console.log('SessionProvider: Updating session...');
    const updatedSession = authUtils.getSession();
    console.log('SessionProvider: Updated session data:', updatedSession);
    setSession(updatedSession);
    setStatus(updatedSession ? 'authenticated' : 'unauthenticated');
    console.log('SessionProvider: Updated status to:', updatedSession ? 'authenticated' : 'unauthenticated');
    return updatedSession;
  };

  return (
    <SessionContext.Provider value={{ session, status, update }}>
      {children}
    </SessionContext.Provider>
  );
} 