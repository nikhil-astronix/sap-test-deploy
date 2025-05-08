"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import DashboardTable from '@/components/system-dashboard/DashboardTable';
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

  const colorClasses = ['blue-700', 'purple-800', 'green-800'];
  
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <div className="mb-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-1">Welcome, Jane Doe</h1>
        <p className="text-gray-600">You have full access to view districts, users, and observation tools across the system.</p>
      </div>
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
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