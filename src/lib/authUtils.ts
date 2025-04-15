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

    console.log('Attempting login for:', email);

    try {
      // Make actual API call to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user, token } = await response.json();
      
      // Store token and user data in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Force a global session update event to notify components that session has changed
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('auth-state-changed', { detail: { authenticated: true } });
        window.dispatchEvent(event);
      }
      
      console.log('Login successful for user:', user.name, 'with role:', user.role);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    if (typeof window === 'undefined') return;
    
    console.log('Logging out user');
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Force a global session update event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('auth-state-changed', { detail: { authenticated: false } });
      window.dispatchEvent(event);
    }
  },
  
  // Get current session
  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userJSON = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!userJSON || !token) {
        console.log('No session found in localStorage');
        return null;
      }
      
      const user = JSON.parse(userJSON);
      console.log('getSession found user:', user.name, 'with role:', user.role);
      
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
    
    console.log('Registering new user:', userData.email);
    
    try {
      // Make actual API call to register endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { user } = await response.json();
      
      // Auto login after successful registration
      console.log('Registration successful, logging in...');
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
    // For development purposes, we'll create a sample login if none exists
    // In a real app, you would have a proper database initialization
    const isAuthenticated = authUtils.isAuthenticated();
    
    if (!isAuthenticated) {
      console.log('No authenticated user found, you can login with any email/password combination.');
      console.log('For testing different roles, use emails containing: admin, trainer, or owner.');
    } else {
      const session = authUtils.getSession();
      console.log('Authenticated as:', session?.user?.name, 'with role:', session?.user?.role);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
} 