"use client";

import { useState } from 'react';
import DashboardTable from '@/components/dashboard/DashboardTable';
import TabComponent from '@/components/dashboard/TabComponent';
import Districts from '@/components/dashboard/Districts';
import ObservationTools from '@/components/dashboard/ObservationTools';
import RecentLogins from '@/components/dashboard/RecentLogins';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Districts');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Districts':
        return <Districts />;
      case 'Observation Tools':
        return <ObservationTools />;
      case 'Recent Logins':
        return <RecentLogins />;
      default:
        return null;
    }
  };

  const colorClasses = ['emerald', 'green-600', 'purple-600'];
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Welcome, Jane Doe</h1>
        <p className="text-gray-600">You have full access to view districts, users, and observation tools across the system.</p>
      </div>
      
      <TabComponent 
        tabs={['Districts', 'Observation Tools', 'Recent Logins']} 
        colorClasses={colorClasses}
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
        />

        <div className="mt-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}