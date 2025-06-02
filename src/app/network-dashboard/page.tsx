'use client';

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from 'lucide-react';
import NetworkTabComponent from "@/components/network-dashboard/NetworkTabComponent";
import TodaySession from "@/components/network-dashboard/sessions/TodaySession";
import UpcomingSession from "@/components/network-dashboard/sessions/UpcomingSession";
import PastSession from "@/components/network-dashboard/sessions/PastSession";
import Districts from "@/components/network-dashboard/Districts";
import ObservationTools from "@/components/network-dashboard/ObservationTools";
import { getDistrictsByNetwork } from "@/services/networkService";
import { PiNetworkLight } from "react-icons/pi";

export default function NetworkDashboard() {
  const [activeTab, setActiveTab] = useState('Sessions');
  const colorClasses = ['#007778', '#2264AC', '#6C4996'];
  const tabs = ['Sessions', 'Districts', 'Observation Tools'];

  const [searchTerm, setSearchTerm] = useState('');
  const [sessionViewType, setSessionViewType] = useState('today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Single state for the currently viewed classroom session
  const [viewingClassrooms, setViewingClassrooms] = useState<any>(null);
  const [networkName, setNetworkName] = useState<any>([]);  
  // Custom tab change handler to reset views
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset classroom view when switching tabs
    if (tab !== 'Sessions') {
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

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await getDistrictsByNetwork();
        if (response && response.data && 
            response.data.networks && 
            response.data.networks.length > 0 && 
            response.data.networks[0].name) {
          setNetworkName(response.data.networks[0].name);
        } else {
          // Set a default name if network data is unavailable
          setNetworkName('Network Dashboard');
          console.log('Network data not available or in unexpected format');
        }
      } catch (error) {
        console.error('Error fetching network districts:', error);
        setNetworkName('Network Dashboard'); // Fallback name
      }
    };
    fetchDistricts();
  }, []);
    
  const renderSessionComponent = () => {
    // If viewing classrooms, show classroom details component
    if (viewingClassrooms && activeTab === 'Sessions') {
      // This part would show a ViewClass component in the admin dashboard
      // For now, just show a placeholder
      return (
        <div className="p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Classroom Details</h2>
          <p>Viewing classroom details for session at {viewingClassrooms?.school}</p>
        </div>
      );
    }
    
    // Otherwise show the regular session components
    switch (sessionViewType) {
      case 'today':
        return <TodaySession searchTerm={searchTerm} />;
      case 'upcoming':
        return <UpcomingSession searchTerm={searchTerm} />;
      case 'past':
        return <PastSession searchTerm={searchTerm} />;
      default:
        return <TodaySession searchTerm={searchTerm} />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Sessions':
        return renderSessionComponent();
      case 'Districts':
        return <Districts searchTerm={searchTerm} />;
      case 'Observation Tools':
        return <ObservationTools searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  // Determine if we should show session details or welcome message
  const showSessionDetails = viewingClassrooms !== null && activeTab === 'Sessions';
    
  return (
    <div className="p-6 pl-[20px] pr-[20px] w-full shadow-lg rounded-lg bg-white border border-gray-200">
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
        <div className="mb-6 rounded-md shadow-sm border border-gray-200">          
          <div className="flex items-center mb-2">            
            <div className="flex items-center">
              <div className="bg-teal-600 text-white rounded-md h-8 w-8 flex items-center justify-center mr-2" style={{ backgroundColor: '#007778' }}>
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
        <div className="mb-6">
          {/* <div className="mb-4 rounded-md">
            <h1 className="text-2xl font-bold mb-1">Welcome, Network Admin</h1>
            <p className="text-gray-600">This dashboard provides a quick overview of network metrics and scheduled observation sessions. You can manage districts, sessions, and observation tools from here.</p>
          </div> */}
          <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome, Network Admin</h1>
        <p className="text-gray-600">This dashboard provides a quick overview of network metrics and scheduled observation sessions. You can manage districts, sessions, and observation tools from here.</p>
      </div>
          <div className="flex flex-row gap-3 mb-6 p-3 bg-gray-100 items-center rounded-xl border border-gray-200">
            <PiNetworkLight size={22} className="text-gray-600" />
            <h1 className="text-lg font-semibold">{networkName}</h1>
          </div>  
        </div>
      )}
      
      <div className="rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <NetworkTabComponent 
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