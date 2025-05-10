"use client";

import { 
  BookOpen, 
  Hash, 
  School, 
  User
} from 'lucide-react';
import AdminDashboardTable, { TableRow, Column } from './AdminDashboardTable';

interface ObservationToolsProps {
  searchTerm?: string;
}

const ObservationTools = ({ searchTerm = '' }: ObservationToolsProps) => {
  // Sample data for Observation Tools tab
  const observationToolsData: TableRow[] = [
    {
      id: 1,
      name: 'e³ Literacy FS',
      totalSessions: 60,
      schools: {
        name: 'Elmwood Elementary School',
        moreCount: 4
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe', 'Jane Smith'],
        more: 2
      }
    },
    {
      id: 2,
      name: 'e³ Math',
      totalSessions: 45,
      schools: {
        name: 'Jefferson Middle School',
        moreCount: 6
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe', 'Jane Smith'],
        more: 1
      }
    },
    {
      id: 3,
      name: 'IPG Literacy',
      totalSessions: 33,
      schools: {
        name: 'Eastwood High School',
        moreCount: 2
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe'],
        more: 0
      }
    },
    {
      id: 4,
      name: 'e³ Literacy FS',
      totalSessions: 20,
      schools: {
        name: 'Lincoln Middle School',
        moreCount: 2
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe', 'Jane Smith'],
        more: 0
      }
    },
    {
      id: 5,
      name: 'AAPS Literacy',
      totalSessions: 19,
      schools: {
        name: 'Riverside Elementary School',
        moreCount: 5
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe'],
        more: 3
      }
    },
    {
      id: 6,
      name: 'IPG Literacy',
      totalSessions: 15,
      schools: {
        name: 'Westview High School',
        moreCount: 7
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe', 'Jane Smith'],
        more: 1
      }
    },
    {
      id: 7,
      name: 'IPG Literacy',
      totalSessions: 9,
      schools: {
        name: 'Northgate Middle School',
        moreCount: 3
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe'],
        more: 0
      }
    },
    {
      id: 8,
      name: 'Board e³ Literacy',
      totalSessions: 4,
      schools: {
        name: 'Pinecrest High School',
        moreCount: 1
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe', 'Jane Smith'],
        more: 0
      }
    },
    {
      id: 9,
      name: 'e³ Math',
      totalSessions: 1,
      schools: {
        name: 'George High School',
        moreCount: 8
      },
      createdBy: {
        name: 'John Doe',
        date: 'April 13, 2025'
      },
      admins: {
        names: ['John Doe'],
        more: 0
      }
    }
  ];

  // Column definitions for Observation Tools tab
  const toolsColumns: Column[] = [
    { key: 'name', label: 'Observation Tool', icon: <BookOpen size={16} />, sortable: true },
    { key: 'totalSessions', label: 'Total Sessions', icon: <Hash size={16} />, sortable: true },
    { key: 'schools', label: 'School', icon: <School size={16} />, sortable: true },
    { key: 'createdBy', label: 'Created By', icon: <User size={16} />, sortable: true },
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'name') {
      const name = row[column] as string;
      return (
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            name.includes('IPG') ? 'bg-green-100 text-green-800' : 
            name.includes('Math') ? 'bg-purple-100 text-purple-800' : 
            name.includes('AAPS') ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          {name}
        </span>
      );
    }
    
    if (column === 'schools') {
      const schools = row[column] as { name: string; moreCount: number };
      return (
        <div>
          {schools.name}
          {schools.moreCount > 0 && (
            <span className="ml-1 text-xs text-gray-400">+{schools.moreCount} more</span>
          )}
        </div>
      );
    }
    
    if (column === 'createdBy') {
      const createdBy = row[column] as { name: string; date: string };
      return (
        <div>
          {createdBy.name}
          <div className="text-xs text-gray-400">{createdBy.date}</div>
        </div>
      );
    }
    
    return row[column];
  };

  return (
    <AdminDashboardTable 
      data={observationToolsData}
      columns={toolsColumns}
      headerColor="purple-800"
      rowColor="purple-50"
      renderCell={renderCell}
      searchTerm={searchTerm}
    />
  );
};

export default ObservationTools;
