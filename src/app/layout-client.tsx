'use client';

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import { initializeAuth } from "@/lib/authUtils";

interface ClientLayoutProps {
  children: ReactNode;
  geistSansVariable: string;
  geistMonoVariable: string;
}

export default function ClientLayout({
  children,
  geistSansVariable,
  geistMonoVariable
}: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);
  
  // Initialize app when it loads
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      try {
        // Initialize the database with default users if needed
        initializeAuth().catch(error => {
          console.error('Error initializing auth:', error);
        });
      } catch (error) {
        console.error('Error initializing:', error);
      }
      setMounted(true);
    }
  }, []);
  
  // Debug to check if this component is mounting
  console.log('ClientLayout rendering, mounted:', mounted);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <NavigationWrapper />
        <main className="flex-grow">
          {/* Only render children once the component is mounted client-side */}
          {mounted ? children : 
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
} 