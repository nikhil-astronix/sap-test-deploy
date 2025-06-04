import { useState, useEffect } from 'react';
import { getSessionsByNetwork, SessionFilterType } from '@/services/networkService';
import NetworkDashboardTable, { NetworkTableRow, NetworkColumn } from '../../NetworkDashboardTable';
import UpcomingSessionViewClassroom from './UpcomingSessionViewClassroom';
import {
  Calendar,
  Clock,
  School,
  User,
  Activity,
  Play,
} from 'lucide-react';

interface UpcomingSessionProps {
  searchTerm?: string;
  parentViewClassroomMode?: boolean;
  setParentViewClassroomMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setParentSchoolData?: (data: {
    name: string;
    date: string;
    observationTool: string;
  } | null) => void;
}

export default function UpcomingSession({ 
  searchTerm = '',
  parentViewClassroomMode,
  setParentViewClassroomMode,
  setParentSchoolData
}: UpcomingSessionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<NetworkTableRow[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [viewClassroomMode, setViewClassroomMode] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');

  // Column definitions for sessions table
  const sessionsColumns: NetworkColumn[] = [
    { key: 'school', label: 'School', icon: <School size={16} />, sortable: true },
    { key: 'date', label: 'Date', icon: <Calendar size={16} />, sortable: true },
    { key: 'startTime', label: 'Start Time', icon: <Clock size={16} />, sortable: true },
    { key: 'endTime', label: 'End Time', icon: <Clock size={16} />, sortable: true },
    { key: 'sessionAdmin', label: 'Session Admin', icon: <User size={16} />, sortable: true },
    { key: 'observer', label: 'Observer(s)', icon: <User size={16} />, sortable: true },
    { key: 'observationTool', label: 'Observation Tool(s)', icon: <Activity size={16} />, sortable: true },
    { key: 'action', label: 'Action', icon: <Activity size={16} />, sortable: false },
  ];

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Specifically get upcoming sessions
      const response = await getSessionsByNetwork('upcoming');
      if (response.success && response.data) {
        // Transform the API response to match our NetworkTableRow structure
        const transformedData = response?.data?.sessions?.map((session: any) => ({
          id: session.id || `session-${Math.random().toString(36).substr(2, 9)}`,
          school: session.school || 'Unknown School',
          date: formatDate(session.date),
          startTime: formatTime(session.start_time),
          endTime: formatTime(session.end_time),
          sessionAdmin: session.session_admin,
          observer: session.observers,
          observationTool: session.observation_tool,
          sessionStatus: 'Upcoming',
          // Add any other fields needed
        }));
        
        setSessionData(transformedData);
      } else {
        setError('Failed to fetch upcoming session data');
      }
    } catch (err) {
      console.error('Error fetching upcoming sessions:', err);
      setError('An error occurred while fetching upcoming sessions');
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
  
  // Custom render function for cells
  const renderCell = (row: NetworkTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-teal-600 hover:text-teal-800 flex items-center"
            onClick={() => {
              // Store the selected school ID and switch to classroom view
              setSelectedSchoolId(row.id);
              setViewClassroomMode(true);
              
              // Also update the parent state if available
              if (setParentViewClassroomMode) {
                setParentViewClassroomMode(true);
              }
              
              // Pass school data to parent component
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
            <Play size={16} />
          </button>
        </div>
      );
    }
    
    if (column === 'observationTool') {
      const tool = row[column] as string;
      if (!tool) return '-';
      
      return (
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            tool.includes('IPG') ? 'bg-green-100 text-green-800' : 
            tool.includes('Math') ? 'bg-purple-100 text-purple-800' : 
            tool.includes('AAPS') ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
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
        <UpcomingSessionViewClassroom 
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