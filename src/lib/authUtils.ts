import { UserRole } from '@/models/ClientUser';
import { useState, useEffect } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Session {
  user: User;
  expires: string;
}

// Constants
const AUTH_TOKEN_KEY = 'gym_auth_token';
const USER_KEY = 'gym_user';

// Authentication utilities
export const authUtils = {
  // Login user and store in localStorage
  login: async (email: string, password: string): Promise<User> => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called in the browser');
    }

    try {
      console.log('Attempting login for:', email);
      // Call the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and session data in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.session));
      console.log('Session stored in localStorage:', data.session);

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Get current session
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null;
    
    const userJSON = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    console.log('Getting session - Token exists:', !!token);
    console.log('Getting session - User exists:', !!userJSON);
    
    if (!userJSON || !token) {
      return null;
    }
    
    try {
      const user = JSON.parse(userJSON);
      console.log('Session user:', user);
      return {
        user,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
    } catch (error) {
      console.error('Error parsing user data', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> => {
    if (typeof window === 'undefined') {
      throw new Error('This function can only be called in the browser');
    }
    
    try {
      // Call the register API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login
      return authUtils.login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

// DO NOT USE THIS DIRECTLY - Use the hook exported from SessionProvider.tsx instead
// This function is kept only for compatibility, but the actual implementation
// is in the SessionProvider component
export function useSession() {
  console.warn('Direct import of useSession from authUtils is deprecated. Please import it from SessionProvider component instead.');
  
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const session = authUtils.getSession();
      setSessionData(session);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    }
  }, []);
  
  const update = async () => {
    if (typeof window === 'undefined') return null;
    
    const updatedSession = authUtils.getSession();
    setSessionData(updatedSession);
    setStatus(updatedSession ? 'authenticated' : 'unauthenticated');
    return updatedSession;
  };
  
  return {
    session: sessionData,
    status,
    update
  };
}

// Initialize database with default users if needed
export async function initializeAuth() {
  if (typeof window === 'undefined') return;
  
  try {
    // Call the init-db API endpoint to ensure default users exist
    const response = await fetch('/api/init-db', { method: 'POST' });
    
    if (!response.ok) {
      console.error('Failed to initialize database');
    } else {
      console.log('Database initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
} 