'use client';

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from 'lucide-react';
import NetworkTabComponent from "@/components/network-dashboard/NetworkTabComponent";
import TodaySession from "@/components/network-dashboard/sessions/TodaySession/TodaySession";
import UpcomingSession from "@/components/network-dashboard/sessions/UpcomingSession/UpcomingSession";
import PastSession from "@/components/network-dashboard/sessions/PastSession/PastSession";
import Districts from "@/components/network-dashboard/Districts";
import ObservationTools from "@/components/network-dashboard/ObservationTools";
import { getDistrictsByNetwork } from "@/services/networkService";
import { PiNetworkLight } from "react-icons/pi";

export default function NetworkDashboard() {
  const [viewClassroomMode, setViewClassroomMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Sessions');
  const colorClasses = ['#007778', '#2264AC', '#6C4996'];
  const tabs = ['Sessions', 'Districts', 'Observation Tools'];

  const [searchTerm, setSearchTerm] = useState('');
  const [sessionViewType, setSessionViewType] = useState('today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for the currently viewed classroom session
  const [viewingClassrooms, setViewingClassrooms] = useState<any>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [selectedSchoolData, setSelectedSchoolData] = useState<{
    name: string;
    date: string;
    observationTool: string;
  } | null>(null);

  const newName = localStorage.getItem("name");
  console.log("viewClassroomMode checking hrer", viewClassroomMode);

  // Function to handle going back from classroom view to session list
  const handleBack = () => {
    setViewClassroomMode(false);
    setSelectedSchoolId('');
    setSelectedSchoolData(null);
    setSessionViewType('today');
    // Keep the current session view type (today/upcoming/past)
  };

  // Function to set selected school data when switching to classroom view
  const setSchoolData = (data: {
    name: string;
    date: string;
    observationTool: string;
  } | null) => {
    setSelectedSchoolData(data);
  };

  // Custom tab change handler to reset views
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset classroom view when switching tabs
    if (tab !== 'Sessions') {
      setViewingClassrooms(null);
      setViewClassroomMode(false);
      setSelectedSchoolData(null);
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
        return <TodaySession 
          searchTerm={searchTerm} 
          parentViewClassroomMode={viewClassroomMode}
          setParentViewClassroomMode={setViewClassroomMode}
          setParentSchoolData={setSchoolData}
        />;
      case 'upcoming':
        return <UpcomingSession 
          searchTerm={searchTerm} 
          parentViewClassroomMode={viewClassroomMode}
          setParentViewClassroomMode={setViewClassroomMode}
          setParentSchoolData={setSchoolData}
        />;
      case 'past':
        return <PastSession 
          searchTerm={searchTerm} 
          parentViewClassroomMode={viewClassroomMode}
          setParentViewClassroomMode={setViewClassroomMode}
          setParentSchoolData={setSchoolData}
        />;
      default:
        return <TodaySession 
          searchTerm={searchTerm} 
          parentViewClassroomMode={viewClassroomMode}
          setParentViewClassroomMode={setViewClassroomMode}
          setParentSchoolData={setSchoolData}
        />;
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
      <div className="mb-6">
        {viewClassroomMode ? (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <button 
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 flex items-center transition"
              >
                <ChevronLeft className="mr-1" size={16} />
                Back
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-md px-2 py-1 text-sm mr-2 flex flex-col items-center justify-center">
                <span className="text-xs uppercase">March</span>
                <span className="text-base font-bold">{selectedSchoolData?.date?.split(' ')[0] || '20'}</span>
              </div>
              <h2 className="text-lg font-medium">{selectedSchoolData?.name || 'School'} Observation Session</h2>
              <div className="ml-auto">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm">
                  {selectedSchoolData?.observationTool || 'Tool'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Observation Classrooms</h3>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">Welcome, Network Admin</h1>
              <p className="text-gray-600">This dashboard provides a quick overview of network metrics and scheduled observation sessions. You can manage districts, sessions, and observation tools from here.</p>
            </div>
            <div className="flex flex-row gap-3 mb-6 p-3 bg-gray-100 items-center rounded-xl border border-gray-200">
              <PiNetworkLight size={22} className="text-gray-600" />
              <h1 className="text-lg font-semibold">{newName}</h1>
            </div>
          </div>
        )}
      </div>

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