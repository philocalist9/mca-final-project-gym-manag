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
      // Simulate API call for development
      // In a real app, replace this with your actual API call
      const fakeLogin = (email: string, password: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // For demo purposes, accept any email/password combo
            // In production, this would validate against your backend
            let defaultRole = UserRole.MEMBER;
            
            // Role determination based on email for testing purposes
            if (email.includes('admin')) {
              defaultRole = UserRole.ADMIN;
            } else if (email.includes('trainer')) {
              defaultRole = UserRole.TRAINER;
            } else if (email.includes('owner')) {
              defaultRole = UserRole.GYM_OWNER;
            }
            
            const user = {
              id: `user-${Math.floor(Math.random() * 1000)}`,
              name: email.split('@')[0],
              email,
              role: defaultRole
            };
            
            const token = `fake-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
            
            resolve({ user, token });
          }, 500);
        });
      };
      
      // Use the fake login for now
      console.log('Performing login...');
      const { user, token } = await fakeLogin(email, password);
      
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
      // Simulate API call for development
      const fakeRegister = (userData: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Validate password length
            if (userData.password.length < 6) {
              reject(new Error('Password should be at least 6 characters long'));
              return;
            }
            
            const user = {
              id: `user-${Math.floor(Math.random() * 1000)}`,
              name: userData.name,
              email: userData.email,
              role: userData.role || UserRole.MEMBER
            };
            
            resolve({ user });
          }, 500);
        });
      };
      
      // Use fake register
      await fakeRegister(userData);
      
      // Auto login
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