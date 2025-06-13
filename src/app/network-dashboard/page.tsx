'use client';

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from 'lucide-react';
import {Network} from "@phosphor-icons/react";
import { GoArrowLeft } from "react-icons/go";
import NetworkTabComponent from "@/components/network-dashboard/NetworkTabComponent";
import TodaySession from "@/components/network-dashboard/sessions/TodaySession/TodaySession";
import UpcomingSession from "@/components/network-dashboard/sessions/UpcomingSession/UpcomingSession";
import PastSession from "@/components/network-dashboard/sessions/PastSession/PastSession";
import Districts from "@/components/network-dashboard/Districts";
import ObservationTools from "@/components/network-dashboard/ObservationTools";
import { getDistrictsByNetwork } from "@/services/networkService";
import TodaySessionViewClassroom from "@/components/network-dashboard/sessions/TodaySession/TodaySessionViewClassroom";
import UpcomingSessionViewClassroom from "@/components/network-dashboard/sessions/UpcomingSession/UpcomingSessionViewClassroom";
import PastSessionViewClassroom from "@/components/network-dashboard/sessions/PastSession/PastSessionViewClassroom";

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

  const [newName, setNewName] = useState<string | null>(null);

  // Safely access localStorage only on the client side
  useEffect(() => {
    // Check if window is defined (we're in the browser)
    if (typeof window !== 'undefined') {
      setNewName(localStorage.getItem("name"));
    }
  }, []);

  // Function to handle going back from classroom view to session list
  const handleBack = () => {
    // Clear the classroom view but maintain the session type
    setViewingClassrooms(null);
    setViewClassroomMode(false);
    setSelectedSchoolId('');
    setSelectedSchoolData(null);
    // Don't reset the session view type when going back
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
        // Also update the selected school data
        if (event.data.session) {
          setSelectedSchoolData({
            name: event.data.session.school || '',
            date: event.data.session.date || '',
            observationTool: event.data.session.observation_tool || ''
          });
          setViewClassroomMode(true);
        }
      } else if (event.data && event.data.type === 'CLOSE_CLASSROOMS') {
        // Clear the classroom data
        setViewingClassrooms(null);
        setViewClassroomMode(false);
        setSelectedSchoolData(null);
        // Force re-render by incrementing the refresh key
        setSessionViewType(prev => prev); // Force re-render
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);  // No dependencies needed

  const renderSessionComponent = () => {
    // If viewing classrooms, show classroom details component
    if (viewingClassrooms && activeTab === 'Sessions' && viewClassroomMode) {
      // Render the appropriate view classroom component based on session type
      switch (sessionViewType) {
        case 'today':
          return (
            <TodaySessionViewClassroom
              key={`classroom-view-${sessionViewType}`}
              schoolId={viewingClassrooms.school?.id || viewingClassrooms.id}
              onBack={handleBack}
            />
          );
        case 'upcoming':
          return (
            <UpcomingSessionViewClassroom
              key={`classroom-view-${sessionViewType}`}
              schoolId={viewingClassrooms.school?.id || viewingClassrooms.id}
              onBack={handleBack}
            />
          );
        case 'past':
          return (
            <PastSessionViewClassroom
              key={`classroom-view-${sessionViewType}`}
              schoolId={viewingClassrooms.school?.id || viewingClassrooms.id}
              onBack={handleBack}
            />
          );
        default:
          return (
            <TodaySessionViewClassroom
              key={`classroom-view-${sessionViewType}`}
              schoolId={viewingClassrooms.school?.id || viewingClassrooms.id}
              onBack={handleBack}
            />
          );
      }
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
  
  // Force re-render of session components when viewingClassrooms changes
  useEffect(() => {
    // This will trigger a re-render of the session components
    if (viewingClassrooms === null) {
      // Small delay to ensure state updates properly
      const timer = setTimeout(() => {
        // Force re-render by toggling a state
        setSearchTerm(searchTerm => searchTerm + "");
        setSessionViewType(prev => prev); // Force re-render
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewingClassrooms, viewClassroomMode]);
  
  const CalendarDate = ({ date }: { date: any }) => {
    const dateObj = new Date(date);
    
    // Get month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[dateObj.getMonth()];
    
    // Get day of month
    const dayOfMonth = dateObj.getDate();
    
    return (
      <div className="inline-block">
        {/* Calendar container */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden w-[40px] h-[40px]">
          {/* Month header */}
          <div className="bg-gradient-to-b from-[#10472E] to-[#2A7251] text-white flex items-top text-center justify-center h-[16px]">
            <span className="text-xs h-[16px]">
              {monthName}
            </span>
          </div>
          {/* Day number */}
          {/* <div className="flex items-center text-center justify-center flex-1 h-[24px]">
            <span className="text-md font-bold text-green-600">
              {dayOfMonth}
            </span>
          </div> */}
          <div className="flex items-center text-center justify-center flex-1 h-[24px]">
            <span className="text-md font-bold bg-gradient-to-b from-[#10472E] to-[#2A7251] bg-clip-text text-transparent">
              {dayOfMonth}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pl-12 pr-12 w-full shadow-lg rounded-lg bg-white border border-gray-200">
      {showSessionDetails && (
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex gap-1 rounded-xl text-sm items-center bg-gray-100 rounded-md p-1 pl-2 pr-4 pt-1 pb-1 hover:bg-gray-200"
          >
            <GoArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>
      )}

      {showSessionDetails ? (
        <div className="mb-6">
          <div className="flex items-center mb-2 bg-gray-100 p-2 rounded-xl">
            <div className="flex items-center gap-3">
              <CalendarDate date={viewingClassrooms?.date || selectedSchoolData?.date || new Date()} />
              <h1 className="text-base font-semibold">
                {viewingClassrooms?.school || selectedSchoolData?.name || 'School'} Observation Session
              </h1>
            </div>
            <div className="ml-auto right-0 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {viewingClassrooms?.observation_tool || selectedSchoolData?.observationTool || 'Tool'}
            </div>
          </div>
          <div className="mt-[20px] mb-[-10px] font-semibold text-lg">
            Observation Classrooms
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome, Network Admin</h1>
          <p className="text-gray-600">View and compare data across all districts under your purview. Quickly access insights into observation activity, districts, and tool usage.</p>
          <div className="flex flex-row gap-3 mt-4 p-3 bg-gray-100 items-center rounded-xl border border-gray-200">
            <Network size={22} className="text-gray-600" />
            <h1 className="text-lg font-semibold">{newName}</h1>
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