'use client';

import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-full max-w-full bg-gray-50 overflow-y-auto mx-auto">
      <main className="h-full max-w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 