'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { AnimatedContainer } from '@/components/ui/animated-container';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AnimatedContainer variant="fade" className="min-h-screen bg-gray-50 ">
      <Header />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <Sidebar />
        <AnimatedContainer variant="slide" className="flex-1 py-6 px-2 pr-6  w-full ">
          {children}
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  );
};

export default Layout; 