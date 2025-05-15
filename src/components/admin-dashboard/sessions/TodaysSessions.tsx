"use client";

import { 
  Calendar, 
  Clock, 
  School, 
  User,
  Activity,
  Play,
} from 'lucide-react';
import AdminDashboardTable, { TableRow, Column } from '../AdminDashboardTable';
import { useState } from 'react';
import ViewClass from './actions/ViewClass';
import EditSession from './actions/EditSession';

interface TodaysSessionsProps {
  searchTerm?: string;
  viewClassroomsSession?: any;
}

const TodaysSessions = ({ searchTerm = '', viewClassroomsSession }: TodaysSessionsProps) => {
  // State for session view type
  const [sessionViewType, setSessionViewType] = useState<'today' | 'upcoming' | 'past'>('today');
  
  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewClassroomsOpen, setIsViewClassroomsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TableRow | null>(null);

  // Sample data for Today's Sessions tab
  const sessionsData: TableRow[] = [
    {
      id: 1,
      school: 'Elmwood Elementary School',
      date: 'April 30, 2025',
      startTime: '8:00 AM',
      endTime: '9:30 AM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 2,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['Jane Doe', 'John Doe'],
        more: 2
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 2,
      school: 'Jefferson Middle School',
      date: 'April 30, 2025',
      startTime: '9:30 AM',
      endTime: '10:30 AM',
      sessionAdmin: 'John Doe (You)',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'Active',
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'IPG Literacy'
    },
    {
      id: 3,
      school: 'Eastwood High School',
      date: 'April 30, 2025',
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 4,
      school: 'Lincoln Middle School',
      date: 'May 1, 2025',
      startTime: '11:30 AM',
      endTime: '12:30 PM',
      sessionAdmin: 'John Doe',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'e³ Math'
    },
    {
      id: 5,
      school: 'Riverside Elementary School',
      date: 'May 2, 2025',
      startTime: '12:30 PM',
      endTime: '1:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 3,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'Inactive',
      admins: {
        names: ['Jane Doe'],
        more: 3
      },
      observationTool: 'e³ Math'
    },
    {
      id: 6,
      school: 'Westview High School',
      date: 'May 6, 2025',
      startTime: '1:30 PM',
      endTime: '2:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'Inactive',
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 7,
      school: 'Northgate Middle School',
      date: 'May 6, 2025',
      startTime: '2:30 PM',
      endTime: '3:30 PM',
      sessionAdmin: 'John Doe',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'IPG Literacy'
    },
    {
      id: 8,
      school: 'Pinecrest High School',
      date: 'May 7, 2025',
      startTime: '3:30 PM',
      endTime: '4:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 9,
      school: 'George High School',
      date: 'May 8, 2025',
      startTime: '4:30 PM',
      endTime: '5:30 PM',
      sessionAdmin: 'John Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 2,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session',
      admins: {
        names: ['Jane Doe', 'John Doe'],
        more: 2
      },
      observationTool: 'e³ Literacy FS'
    }
  ];

  // Column definitions for Today's Sessions tab
  const sessionsColumns: Column[] = [
    { key: 'school', label: 'School', icon: <School size={16} />, sortable: true },
    { key: 'date', label: 'Date', icon: <Calendar size={16} />, sortable: true },
    { key: 'startTime', label: 'Start Time', icon: <Clock size={16} />, sortable: true },
    { key: 'endTime', label: 'End Time', icon: <Clock size={16} />, sortable: true },
    { key: 'sessionAdmin', label: 'Session Admin', icon: <User size={16} />, sortable: true },
    { key: 'observer', label: 'Observer(s)', icon: <User size={16} />, sortable: true },
    { key: 'observationTool', label: 'Observation Tool(s)', icon: <Activity size={16} />, sortable: true },
    { key: 'action', label: 'Action', icon: <Activity size={16} />, sortable: false },
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSession(row)}
            className="text-teal-600 hover:text-teal-800 flex items-center"
          >
            <span className="mr-1">Edit Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          {row.viewClassrooms && (
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => handleViewClassrooms(row)}
            >
              <span className="mr-1">View Classrooms</span>
              <Play size={16} />
            </button>
          )}
        </div>
      );
    }
    
    if (column === 'observationTool') {
      const tool = row[column] as string;
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
    
    if (column === 'observer') {
      const observers = row[column] as string;
      const count = row.observerCount as number;
      return (
        <div className="text-sm">
          {observers}
          {count > 0 ? ` +${count} more` : ''}
        </div>
      );
    }
    
    return undefined;
  };

  const handleEditSession = (session: TableRow) => {
    setSelectedSession(session);
    setIsEditModalOpen(true);
  };

  const handleViewClassrooms = (session: TableRow) => {
    // Send message to parent component to show classrooms
    window.postMessage({ type: 'VIEW_CLASSROOMS', session }, '*');
  };

  const handleSaveSession = () => {
    setIsEditModalOpen(false);
  };

  // Filter data based on session view type
  const getFilteredData = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    switch (sessionViewType) {
      case 'today':
        // Show sessions for today
        return sessionsData;
      case 'upcoming':
        // Show future sessions
        return sessionsData.filter(session => {
          const sessionDate = new Date(session.date as string);
          return sessionDate > today;
        });
      case 'past':
        // Show past sessions
        return sessionsData.filter(session => {
          const sessionDate = new Date(session.date as string);
          return sessionDate < today;
        });
      default:
        return sessionsData;
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-4">
      {/* Sessions Table */}
      <AdminDashboardTable
        data={filteredData}
        columns={sessionsColumns}
        headerColor="teal-600"
        rowColor="teal-100"
        renderCell={renderCell}
        searchTerm={searchTerm}
      />

      {/* Edit Session Modal */}
      {isEditModalOpen && selectedSession && (
        <EditSession
          session={selectedSession}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveSession}
        />
      )}

      {/* View Classrooms Modal removed - now handled by parent component */}
    </div>
  );
};

export default TodaysSessions;