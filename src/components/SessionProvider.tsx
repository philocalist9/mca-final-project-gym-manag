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
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Load session on mount
  useEffect(() => {
    console.log('SessionProvider mounted, loading session from localStorage');
    
    // Browser-only code
    if (typeof window !== 'undefined') {
      try {
        // Get session from localStorage on client-side
        const clientSession = authUtils.getSession();
        console.log('Session from localStorage:', clientSession ? 'found' : 'not found');
        
        if (clientSession) {
          setSession(clientSession);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
        setSessionLoaded(true);
      } catch (error) {
        console.error('Error loading session:', error);
        setSession(null);
        setStatus('unauthenticated');
        setSessionLoaded(true);
      }
    }
  }, []);
  
  // Listen for auth state change events
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent) => {
      console.log('Auth state changed:', event.detail);
      
      try {
        const updatedSession = authUtils.getSession();
        console.log('Session after auth change:', updatedSession ? 'authenticated' : 'unauthenticated');
        
        if (updatedSession) {
          setSession(updatedSession);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error updating session from auth event:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };
    
    // Add event listener for auth state changes
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-state-changed', handleAuthChange as EventListener);
      
      // Clean up
      return () => {
        window.removeEventListener('auth-state-changed', handleAuthChange as EventListener);
      };
    }
  }, []);

  // Update the session
  const update = async () => {
    console.log('Updating session');
    if (typeof window === 'undefined') return null;
    
    try {
      const updatedSession = authUtils.getSession();
      console.log('Updated session:', updatedSession ? 'found' : 'not found');
      
      if (updatedSession) {
        setSession(updatedSession);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
      return updatedSession;
    } catch (error) {
      console.error('Error updating session:', error);
      setSession(null);
      setStatus('unauthenticated');
      return null;
    }
  };

  // Debug current session state
  useEffect(() => {
    console.log('Session state changed:', { 
      status, 
      loaded: sessionLoaded,
      user: session?.user?.name,
      role: session?.user?.role
    });
  }, [session, status, sessionLoaded]);

  return (
    <SessionContext.Provider value={{ session, status, update }}>
      {children}
    </SessionContext.Provider>
  );
} 