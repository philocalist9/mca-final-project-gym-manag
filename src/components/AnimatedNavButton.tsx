'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AnimatedNavButtonProps {
  href: string;
  children: React.ReactNode;
  icon: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function AnimatedNavButton({ 
  href, 
  children, 
  icon, 
  isActive = false,
  onClick 
}: AnimatedNavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonContent = (
    <motion.div
      className={`relative px-4 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-2">
        <motion.span
          animate={{ y: isHovered ? -5 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {icon}
        </motion.span>
        <span>{children}</span>
      </div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        {buttonContent}
      </button>
    );
  }

  return (
    <Link href={href} className="focus:outline-none">
      {buttonContent}
    </Link>
  );
} 