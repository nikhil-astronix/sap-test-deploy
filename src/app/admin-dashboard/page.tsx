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
import ViewClass from "@/components/admin-dashboard/sessions/actions/ViewClass";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Todays Sessions');
  const colorClasses = ['teal-600', 'blue-500', 'purple-800', 'green-800'];
  const tabs = ['Todays Sessions', 'Schools', 'Observation Tools', 'Recent Logins'];

  const [searchTerm, setSearchTerm] = useState('');
  const [sessionViewType, setSessionViewType] = useState('today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Single state for the currently viewed classroom session
  const [viewingClassrooms, setViewingClassrooms] = useState<any>(null);
  
  // Custom tab change handler to reset views
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset classroom view when switching tabs
    if (tab !== 'Todays Sessions') {
      setViewingClassrooms(null);
    }
  };
  
  // Custom session type change handler
  const handleSessionTypeChange = (type: string) => {
    setSessionViewType(type);
    // Reset classroom view when switching session types
    setViewingClassrooms(null);
  };
  
  // Listen for messages from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VIEW_CLASSROOMS') {
        // Store the classroom data
        setViewingClassrooms(event.data.session);
      } else if (event.data && event.data.type === 'CLOSE_CLASSROOMS') {
        // Clear the classroom data
        setViewingClassrooms(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);  // No dependencies needed
    
    const renderSessionComponent = () => {
      // If viewing classrooms, show the ViewClass component
      if (viewingClassrooms && activeTab === 'Todays Sessions') {
        return (
          <ViewClass 
            session={viewingClassrooms} 
            onBack={() => setViewingClassrooms(null)}
          />
        );
      }
      
      // Otherwise show the regular session components
      switch (sessionViewType) {
        case 'today':
          return <TodaysSessions searchTerm={searchTerm} />;
        case 'upcoming':
          return <UpcomingSessions />;
        case 'past':
          return <PastSessions />;
        default:
          return <TodaysSessions searchTerm={searchTerm} />;
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

  // Determine if we should show session details or welcome message
  const showSessionDetails = viewingClassrooms !== null && activeTab === 'Todays Sessions';
    
  return (
    <div className="p-6 w-full pl-16 pr-16 mx-auto bg-gray-50">
      {showSessionDetails && (
        <div className="mb-4">
          <button 
            onClick={() => setViewingClassrooms(null)}
            className="flex items-center bg-gray-300 rounded-full p-1 pl-2 pr-4 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      )}
      
      {showSessionDetails ? (
        <div className="mb-6 bg-white p-4 rounded-md shadow-sm border border-gray-200">          
          <div className="flex items-center mb-2">            
            <div className="flex items-center">
              <div className="bg-teal-600 text-white rounded-md h-8 w-8 flex items-center justify-center mr-2">
                <span className="text-sm font-medium">{viewingClassrooms?.date.split(' ')[1]}</span>
              </div>
              <h1 className="text-xl font-bold">{viewingClassrooms?.school} Observation Session</h1>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Viewing classrooms for observation session on {viewingClassrooms?.date}</p>
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {viewingClassrooms?.observationTool}
            </div>
          </div>
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
          onTabChange={handleTabChange}
          sessionViewType={sessionViewType}
          setSessionViewType={handleSessionTypeChange}
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