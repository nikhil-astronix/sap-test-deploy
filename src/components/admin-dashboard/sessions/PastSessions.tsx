"use client";

import { 
  Calendar, 
  Clock, 
  School, 
  User,
  Activity,
  Play,
} from 'lucide-react';
import AdminDashboardTable, { TableRow, Column, StatusType } from '../AdminDashboardTable';
import { useState } from 'react';
import ViewClass from './actions/ViewClass';

interface PastSessionsProps {
  searchTerm?: string;
  viewClassroomsSession?: any;
}

const PastSessions = ({ searchTerm = '', viewClassroomsSession }: PastSessionsProps) => {
  // Sample data for Past Sessions tab
  const sessionsData: TableRow[] = [
    {
      id: 1,
      school: 'Elmwood Elementary School',
      date: 'March 15, 2024',
      startTime: '8:00 AM',
      endTime: '9:30 AM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 2,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe', 'John Doe'],
        more: 2
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 2,
      school: 'Jefferson Middle School',
      date: 'March 16, 2024',
      startTime: '9:30 AM',
      endTime: '10:30 AM',
      sessionAdmin: 'John Doe (You)',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'IPG Literacy'
    },
    {
      id: 3,
      school: 'Eastwood High School',
      date: 'March 17, 2024',
      startTime: '10:30 AM',
      endTime: '11:30 AM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 4,
      school: 'Lincoln Middle School',
      date: 'March 20, 2024',
      startTime: '11:30 AM',
      endTime: '12:30 PM',
      sessionAdmin: 'John Doe',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'e³ Math'
    },
    {
      id: 5,
      school: 'Riverside Elementary School',
      date: 'March 22, 2024',
      startTime: '12:30 PM',
      endTime: '1:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 2,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe', 'John Doe'],
        more: 2
      },
      observationTool: 'e³ Math'
    },
    {
      id: 6,
      school: 'Westview High School',
      date: 'March 25, 2024',
      startTime: '1:30 PM',
      endTime: '2:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 7,
      school: 'Northgate Middle School',
      date: 'March 28, 2024',
      startTime: '2:30 PM',
      endTime: '3:30 PM',
      sessionAdmin: 'John Doe',
      observer: 'John Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['John Doe'],
        more: 0
      },
      observationTool: 'IPG Literacy'
    },
    {
      id: 8,
      school: 'Pinecrest High School',
      date: 'March 29, 2024',
      startTime: '3:30 PM',
      endTime: '4:30 PM',
      sessionAdmin: 'Jane Doe',
      observer: 'Jane Doe',
      observerCount: 0,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe'],
        more: 0
      },
      observationTool: 'e³ Literacy FS'
    },
    {
      id: 9,
      school: 'George High School',
      date: 'March 29, 2024',
      startTime: '4:30 PM',
      endTime: '5:30 PM',
      sessionAdmin: 'Jane Doe, John Doe',
      observer: 'Jane Doe, John Doe',
      observerCount: 2,
      action: 'Edit Session',
      viewClassrooms: true,
      sessionStatus: 'No Session' as StatusType,
      admins: {
        names: ['Jane Doe', 'John Doe'],
        more: 2
      },
      observationTool: 'e³ Literacy FS'
    }
  ];

  // Column definitions for Sessions tab
  const sessionsColumns: Column[] = [
    { key: 'school', label: 'School', icon: <School size={16} />, sortable: true },
    { key: 'date', label: 'Date', icon: <Calendar size={16} />, sortable: true },
    { key: 'startTime', label: 'Start Time', icon: <Clock size={16} />, sortable: true },
    { key: 'endTime', label: 'End Time', icon: <Clock size={16} />, sortable: true },
    { key: 'sessionAdmin', label: 'Session Admin', icon: <User size={16} />, sortable: true },
    { key: 'observationTool', label: 'Observation Tool(s)', icon: <Activity size={16} />, sortable: true },
    { key: 'action', label: 'Action', icon: <Activity size={16} />, sortable: false }
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button className="text-teal-600 hover:text-teal-800 flex items-center">
            <span className="mr-1">Edit Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          {row.viewClassrooms && (
            <button 
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => {
                window.postMessage({ type: 'VIEW_CLASSROOMS', session: row }, '*');
              }}
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
      let bgColor = '';
      let textColor = '';
      
      if (tool.includes('Literacy')) {
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
      } else if (tool.includes('Math')) {
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
      } else {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
      }
      
      return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
          {tool}
        </span>
      );
    }
    
    return row[column];
  };

  return (
    <div>
      {!viewClassroomsSession ? (
        <AdminDashboardTable 
          data={sessionsData}
          columns={sessionsColumns}
          headerColor="teal-600"
          rowColor="teal-50"
          renderCell={renderCell}
          searchTerm={searchTerm}
        />
      ) : (
        <ViewClass 
          session={viewClassroomsSession}
          sessionType="past"
          onBack={() => window.postMessage({ type: 'CLOSE_CLASSROOMS' }, '*')} 
        />
      )}
    </div>
  );
};

export default PastSessions;