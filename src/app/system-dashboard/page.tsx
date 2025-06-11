"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import TabComponent from '@/components/system-dashboard/TabComponent';
import Districts from '@/components/system-dashboard/Districts';
import ObservationTools from '@/components/system-dashboard/ObservationTools';
import RecentLogins from '@/components/system-dashboard/RecentLogins';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Districts');
  const [searchTerm, setSearchTerm] = useState('');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Districts':
        return <Districts searchTerm={searchTerm} />;
      case 'Observation Tools':
        return <ObservationTools searchTerm={searchTerm} />;
      case 'Recent Logins':
        return <RecentLogins searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  const colorClasses = ['#2264AC', '#6C4996', '#007778'];
  
  return (
    // <div className="p-6 w-full shadow-lg rounded-lg bg-white border border-gray-200">
    <div className="p-6 pl-12 pr-12 w-full shadow-lg rounded-lg bg-white border border-gray-200">
      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome, System Admin</h1>
          <p className="text-gray-600">You have full access to view districts, users, and observation tools across the system.</p>
        </div>
      </div>
      
      <div className="rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <TabComponent 
          tabs={['Districts', 'Observation Tools', 'Recent Logins']} 
          colorClasses={colorClasses}
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="p-4">
          <div className="relative w-full md:w-64 mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}