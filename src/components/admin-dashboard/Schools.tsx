"use client";

import { useState, useEffect } from 'react';
import { 
  School as SchoolIcon, 
  Hash, 
  BookOpen, 
  Clock, 
  Settings,
  Info
} from 'lucide-react';
import AdminDashboardTable, { TableRow, Column } from './AdminDashboardTable';

interface SchoolsProps {
  searchTerm?: string;
}

const Schools = ({ searchTerm = '' }: SchoolsProps) => {
  // Sample data for Schools tab
  const schoolsData: TableRow[] = [
    {
      id: 1,
      name: 'Elmwood Elementary School',
      classrooms: 0,
      observationTools: [],
      lastSession: null,
      setupStatus: 'Incomplete',
      setupStatusData: {
        classrooms: 0,
        tools: 0
      }
    },
    {
      id: 2,
      name: 'Jefferson Middle School',
      classrooms: 0,
      observationTools: [],
      lastSession: null,
      setupStatus: 'Incomplete',
      setupStatusData: {
        classrooms: 0,
        tools: 0
      }
    },
    {
      id: 3,
      name: 'Lincoln Middle School',
      classrooms: 5,
      observationTools: [],
      lastSession: null,
      setupStatus: 'Partial',
      setupStatusData: {
        classrooms: 20,
        tools: 0
      }
    },
    {
      id: 4,
      name: 'Eastwood High School',
      classrooms: 20,
      observationTools: [],
      lastSession: null,
      setupStatus: 'Partial',
      setupStatusData: {
        classrooms: 20,
        tools: 0
      }
    },
    {
      id: 5,
      name: 'Riverside Elementary School',
      classrooms: 10,
      observationTools: ['e³ Math'],
      lastSession: 'April 6, 2025',
      setupStatus: 'Complete',
      setupStatusData: {
        classrooms: 10,
        tools: 1
      }
    },
    {
      id: 6,
      name: 'Westview High School',
      classrooms: 20,
      observationTools: ['IPG Literacy'],
      lastSession: 'March 17, 2025',
      setupStatus: 'Complete',
      setupStatusData: {
        classrooms: 20,
        tools: 1
      }
    },
    {
      id: 7,
      name: 'Northgate Middle School',
      classrooms: 9,
      observationTools: ['IPG Literacy', 'e³ Literacy FS'],
      lastSession: 'February 25, 2025',
      setupStatus: 'Complete',
      setupStatusData: {
        classrooms: 4,
        tools: 2
      }
    },
    {
      id: 8,
      name: 'Pinecrest High School',
      classrooms: 4,
      observationTools: ['e³ Literacy FS', 'IPG Literacy'],
      lastSession: 'December 10, 2025',
      setupStatus: 'Complete',
      setupStatusData: {
        classrooms: 4,
        tools: 2
      }
    },
    {
      id: 9,
      name: 'George High School',
      classrooms: 17,
      observationTools: ['e³ Literacy FS'],
      lastSession: 'October 27, 2025',
      setupStatus: 'Complete',
      setupStatusData: {
        classrooms: 17,
        tools: 1
      }
    },
  ];

  // Column definitions for Schools tab
  const schoolsColumns: Column[] = [
    { key: 'name', label: 'School', icon: <SchoolIcon size={16} />, sortable: true },
    { key: 'classrooms', label: 'Number of Classrooms', icon: <Hash size={16} />, sortable: true },
    { key: 'observationTools', label: 'Observation Tool(s)', icon: <BookOpen size={16} />, sortable: true },
    { key: 'lastSession', label: 'Last Session', icon: <Clock size={16} />, sortable: true },
    { key: 'setupStatus', label: 'Setup Status', icon: <Settings size={16} />, sortable: true },
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'observationTools') {
      const tools = row[column] as string[];
      if (!tools || tools.length === 0) return 'None';
      
      return (
        <div className="flex flex-col space-y-1">
          {tools.map((tool: string, i: number) => (
            <span 
              key={i} 
              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                tool.includes('IPG') ? 'bg-green-100 text-green-800' : 
                tool.includes('Math') ? 'bg-purple-100 text-purple-800' : 
                'bg-blue-100 text-blue-800'
              }`}
            >
              {tool}
            </span>
          ))}
        </div>
      );
    }
    
    if (column === 'lastSession') {
      return row[column] || 'None';
    }
    
    if (column === 'setupStatus') {
      const status = row[column] as string;
      const statusData = (row as any).setupStatusData;
      
      let color = '';
      let dotColor = '';
      
      switch (status) {
        case 'Incomplete':
          color = 'text-red-800';
          dotColor = 'bg-red-600';
          break;
        case 'Partial':
          color = 'text-yellow-800';
          dotColor = 'bg-yellow-600';
          break;
        case 'Complete':
          color = 'text-green-800';
          dotColor = 'bg-green-600';
          break;
        default:
          color = 'text-gray-800';
          dotColor = 'bg-gray-600';
      }
      
      return (
        <div className="relative group">
          <div className={`inline-flex items-center gap-1 ${status === 'Incomplete' ? 'bg-red-200' : status === 'Partial' ? 'bg-yellow-200' : 'bg-green-200'} ${color} px-2 py-1 rounded-full text-xs`}>
            <span className={`w-2 h-2 ${dotColor} rounded-full`}></span>
            {status}
          </div>
          {statusData && (
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
              <div className="flex items-center justify-between whitespace-nowrap">
                <span>Classroom {statusData.classrooms}</span>
                <span className="mx-1">|</span>
                <span>Tools {statusData.tools}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return row[column];
  };

  return (
    <AdminDashboardTable 
      data={schoolsData}
      columns={schoolsColumns}
      headerColor="blue-500"
      rowColor="blue-50"
      renderCell={renderCell}
      searchTerm={searchTerm}
    />
  );
};

export default Schools;