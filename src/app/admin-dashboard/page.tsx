'use client';

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from 'lucide-react';
import AdminTabComponent from "@/components/admin-dashboard/AdminTabComponent";
import TodaysSessions from "@/components/admin-dashboard/sessions/TodaysSessions";
import UpcomingSessions from "@/components/admin-dashboard/sessions/UpcomingSessions";
import PastSessions from "@/components/admin-dashboard/sessions/PastSessions";
import ObservationTools from "@/components/admin-dashboard/ObservationTools";
import RecentLogins from "@/components/admin-dashboard/RecentLogins";
import Schools from "@/components/admin-dashboard/Schools";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Todays Sessions');
  const colorClasses = ['teal-600', 'blue-500', 'purple-800', 'green-800'];
  const tabs = ['Todays Sessions', 'Schools', 'Observation Tools', 'Recent Logins'];

  const [searchTerm, setSearchTerm] = useState('');
  const [sessionViewType, setSessionViewType] = useState('today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewingClassrooms, setViewingClassrooms] = useState<any>(null);
  
  // Listen for messages from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VIEW_CLASSROOMS') {
        setViewingClassrooms(event.data.session);
      } else if (event.data && event.data.type === 'CLOSE_CLASSROOMS') {
        setViewingClassrooms(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
    
    const renderSessionComponent = () => {
      switch (sessionViewType) {
        case 'today':
          return <TodaysSessions searchTerm={searchTerm} viewClassroomsSession={viewingClassrooms} />;
        case 'upcoming':
          return <UpcomingSessions viewClassroomsSession={viewingClassrooms} />;
        case 'past':
          return <PastSessions viewClassroomsSession={viewingClassrooms} />;
        default:
          return <TodaysSessions searchTerm={searchTerm} viewClassroomsSession={viewingClassrooms} />;
      }
    };

    const renderTabContent = () => {
      switch (activeTab) {
        case 'Todays Sessions':
          return renderSessionComponent();
        case 'Schools':
          return <Schools searchTerm={searchTerm} />;
        case 'Observation Tools':
          return <ObservationTools searchTerm={searchTerm} />;
        case 'Recent Logins':
          return <RecentLogins searchTerm={searchTerm} />;
        default:
          return null;
      }
    };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {viewingClassrooms ? (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setViewingClassrooms(null)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4 flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <div className="bg-teal-600 text-white rounded-md h-8 w-8 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">{viewingClassrooms.date.split(' ')[1]}</span>
                </div>
                <h1 className="text-xl font-bold">{viewingClassrooms.school} Observation Session</h1>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {viewingClassrooms.observationTool}
            </div>
          </div>
          
          <h2 className="text-xl font-medium mb-4">Observation Classrooms</h2>
        </div>
      ) : (
        <div className="mb-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-1">Welcome, John Doe</h1>
          <p className="text-gray-600">This dashboard provides a quick overview of platform usage within your system. You can also view scheduled observation sessions and participate as needed.</p>
        </div>
      )}
      
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <AdminTabComponent 
          tabs={tabs} 
          colorClasses={colorClasses}
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          sessionViewType={sessionViewType}
          setSessionViewType={setSessionViewType}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
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