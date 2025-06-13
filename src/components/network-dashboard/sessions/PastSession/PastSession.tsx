import { useState, useEffect } from 'react';
import { getSessionsByNetwork, SessionFilterType } from '@/services/networkService';
import NetworkDashboardTable, { NetworkTableRow, NetworkColumn } from '../../NetworkDashboardTable';
import PastSessionViewClassroom from './PastSessionViewClassroom';
import {GraduationCap, CalendarDots, Clock, Users, UserGear, ArrowDownRight, Play, Toolbox} from "@phosphor-icons/react";

interface PastSessionProps {
  searchTerm?: string;
  parentViewClassroomMode?: boolean;
  setParentViewClassroomMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setParentSchoolData?: (data: {
    name: string;
    date: string;
    observationTool: string;
  } | null) => void;
}

export default function PastSession({ 
  searchTerm = '',
  parentViewClassroomMode,
  setParentViewClassroomMode,
  setParentSchoolData
}: PastSessionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<NetworkTableRow[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [viewClassroomMode, setViewClassroomMode] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');

  // Column definitions for sessions table
  const sessionsColumns: NetworkColumn[] = [
    { key: 'school', label: 'School', icon: <GraduationCap size={20} />, sortable: true },
    { key: 'date', label: 'Date', icon: <CalendarDots size={20} />, sortable: true },
    { key: 'startTime', label: 'Start Time', icon: <Clock size={20} />, sortable: true },
    { key: 'endTime', label: 'End Time', icon: <Clock size={20} />, sortable: true },
    { key: 'sessionAdmin', label: 'Session Admin', icon: <UserGear size={20} />, sortable: true },
    { key: 'observer', label: 'Observer(s)', icon: <Users size={20} />, sortable: true },
    { key: 'observationTool', label: 'Observation Tool(s)', icon: <Toolbox size={20} />, sortable: true },
    { key: 'action', label: 'Action', icon: <ArrowDownRight size={20} />, sortable: false },
  ];

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Specifically get past sessions
      const response = await getSessionsByNetwork('past');
      if (response.success && response.data) {
        // Transform the API response to match our NetworkTableRow structure
        const transformedData = response?.data?.sessions.map((session: any) => ({
          id: session.id || `session-${Math.random().toString(36).substr(2, 9)}`,
          school: session.school || 'Unknown School',
          date: formatDate(session.date),
          startTime: formatTime(session.start_time),
          endTime: formatTime(session.end_time),
          sessionAdmin: session.session_admin,
          observer: session.observers,
          observationTool: session.observation_tool,
          sessionStatus: 'Completed',
          // Add any other fields needed
        }));
        
        setSessionData(transformedData);
      } else {
        setError('Failed to fetch past session data');
      }
    } catch (err) {
      console.error('Error fetching past sessions:', err);
      setError('An error occurred while fetching past sessions');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper functions to format date and time
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    const timePart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
    const time = timePart.split('+')[0]; // Remove timezone part if present
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const bgColors = [
    "bg-[#E9F3FF]",
    "bg-[#D1FAE5]",
    "bg-[#EDFFFF]",
    "bg-[#FFFCDD]",
    "bg-[#F4EBFF]",
    "bg-[#EDFFFF]",
    "bg-[#F9F5FF]",
  ];
  
  // Custom render function for cells
  const renderCell = (row: NetworkTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-[#007778] hover:text-white hover:bg-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors duration-200"
            onClick={() => {
              // Store the selected school ID and switch to classroom view
              setSelectedSchoolId(row.id);
              setViewClassroomMode(true);
              
              // Use postMessage to communicate with parent component
              window.postMessage({
                type: 'VIEW_CLASSROOMS',
                session: {
                  id: row.id,
                  school: row.school,
                  date: row.date,
                  observation_tool: row.observationTool
                }
              }, '*');
              
              // Also update the parent state if available (legacy approach)
              if (setParentViewClassroomMode) {
                setParentViewClassroomMode(true);
              }
              
              // Pass school data to parent component (legacy approach)
              if (setParentSchoolData) {
                setParentSchoolData({
                  name: row.school as string,
                  date: row.date as string,
                  observationTool: row.observationTool as string
                });
              }
            }}
          >
            <span className="mr-1">View Classrooms</span>
            <Play size={20} />
          </button>
        </div>
      );
    }
    
    if (column === 'observer') {
      const observers = row[column] as string[];
      if (!observers || observers.length === 0) return '-';
      
      // Show first two observers with comma separation
      const displayObservers = observers.slice(0, 2).join(', ');
      
      // If more than 2 observers, show +X more
      const extraCount = observers.length > 2 ? observers.length - 2 : 0;
      
      return (
        <div>
          <span className="text-xs">{displayObservers}</span>
          {extraCount > 0 && (
            <span className="text-[#2264AC] text-xs ml-1">+{extraCount} more</span>
          )}
        </div>
      );
    }
    
    if (column === 'observationTool') {
      const tool = row[column] as string;
      if (!tool) return '-';
      
      // Get index based on row index to cycle through background colors
      const index = sessionData.findIndex(item => item === row);
      const bgColor = bgColors[index % bgColors.length];
      
      return (
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
        >
          {tool}
        </span>
      );
    }
    
    return undefined;
  };

  // Update localSearchTerm when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Function to handle going back from classroom view to session list
  const handleBack = () => {
    setViewClassroomMode(false);
    setSelectedSchoolId('');
    
    // Also update the parent state if available
    if (setParentViewClassroomMode) {
      setParentViewClassroomMode(false);
    }
    
    // Clear parent school data when navigating back
    if (setParentSchoolData) {
      setParentSchoolData(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {viewClassroomMode ? (
        // Show classroom view when a school is selected
        <PastSessionViewClassroom 
          schoolId={selectedSchoolId} 
          onBack={handleBack}
        />
      ) : (
        // Show sessions table when no school is selected
        <>
          <NetworkDashboardTable 
            data={sessionData}
            columns={sessionsColumns}
            headerColor="#007778"
            rowColor="#EDFFFF"
            renderCell={renderCell}
            searchTerm={localSearchTerm}
            isLoading={isLoading}
            error={error}
          />
          {isLoading &&
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            </div>
          }
        </>
      )}
    </div>
  );
}