'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { any } from 'zod';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

  const [showSetup, setShowSetup] = useState(false);

  const toggleSetup = () => {
    setShowSetup(prevState => !prevState);
  };

  return (
    <AnimatedContainer variant="fade" className="min-h-screen bg-gray-50 ">
      <Header handleSetupClick={toggleSetup} />
      {showSetup ? (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <Sidebar />
          <AnimatedContainer variant="slide" className="flex-1 py-6 px-2 pr-6 w-full">
            {children}
          </AnimatedContainer>
        </div>
      ) : (
        <div className="py-6 px-6">
          {children}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default Layout; 