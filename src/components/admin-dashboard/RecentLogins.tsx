"use client";

import { 
  User, 
  Calendar, 
  Clock, 
  School,
  Laptop
} from 'lucide-react';
import AdminDashboardTable, { TableRow, Column } from './AdminDashboardTable';

interface RecentLoginsProps {
  searchTerm?: string;
}

const RecentLogins = ({ searchTerm = '' }: RecentLoginsProps) => {
  // Sample data for Recent Logins tab
  const loginsData: TableRow[] = [
    {
      id: 1,
      user: 'John Doe',
      role: 'Admin',
      school: 'Elmwood Elementary School',
      date: 'May 9, 2025',
      time: '9:00 AM',
      device: 'Desktop - Chrome',
      admins: {
        names: ['John Doe'],
        more: 0
      }
    },
    {
      id: 2,
      user: 'Jane Smith',
      role: 'Teacher',
      school: 'Jefferson Middle School',
      date: 'May 9, 2025',
      time: '8:45 AM',
      device: 'Mobile - Safari',
      admins: {
        names: ['Jane Smith'],
        more: 0
      }
    },
    {
      id: 3,
      user: 'Robert Johnson',
      role: 'Principal',
      school: 'Lincoln Middle School',
      date: 'May 9, 2025',
      time: '8:30 AM',
      device: 'Tablet - Chrome',
      admins: {
        names: ['Robert Johnson'],
        more: 0
      }
    },
    {
      id: 4,
      user: 'Emily Davis',
      role: 'Teacher',
      school: 'Eastwood High School',
      date: 'May 9, 2025',
      time: '8:15 AM',
      device: 'Desktop - Firefox',
      admins: {
        names: ['Emily Davis'],
        more: 0
      }
    },
    {
      id: 5,
      user: 'Michael Wilson',
      role: 'Admin',
      school: 'Riverside Elementary School',
      date: 'May 8, 2025',
      time: '4:30 PM',
      device: 'Desktop - Edge',
      admins: {
        names: ['Michael Wilson'],
        more: 0
      }
    },
    {
      id: 6,
      user: 'Sarah Brown',
      role: 'Teacher',
      school: 'Westview High School',
      date: 'May 8, 2025',
      time: '3:45 PM',
      device: 'Mobile - Chrome',
      admins: {
        names: ['Sarah Brown'],
        more: 0
      }
    },
    {
      id: 7,
      user: 'David Miller',
      role: 'Principal',
      school: 'Northgate Middle School',
      date: 'May 8, 2025',
      time: '2:30 PM',
      device: 'Desktop - Chrome',
      admins: {
        names: ['David Miller'],
        more: 0
      }
    },
    {
      id: 8,
      user: 'Jennifer Taylor',
      role: 'Teacher',
      school: 'Pinecrest High School',
      date: 'May 8, 2025',
      time: '1:15 PM',
      device: 'Tablet - Safari',
      admins: {
        names: ['Jennifer Taylor'],
        more: 0
      }
    },
    {
      id: 9,
      user: 'James Anderson',
      role: 'Admin',
      school: 'George High School',
      date: 'May 8, 2025',
      time: '11:00 AM',
      device: 'Desktop - Chrome',
      admins: {
        names: ['James Anderson'],
        more: 0
      }
    }
  ];

  // Column definitions for Recent Logins tab
  const loginsColumns: Column[] = [
    { key: 'user', label: 'User', icon: <User size={16} />, sortable: true },
    { key: 'role', label: 'Role', icon: <User size={16} />, sortable: true },
    { key: 'school', label: 'School', icon: <School size={16} />, sortable: true },
    { key: 'date', label: 'Date', icon: <Calendar size={16} />, sortable: true },
    { key: 'time', label: 'Time', icon: <Clock size={16} />, sortable: true },
    { key: 'device', label: 'Device', icon: <Laptop size={16} />, sortable: true },
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'role') {
      const role = row[column] as string;
      return (
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            role === 'Admin' ? 'bg-blue-100 text-blue-800' : 
            role === 'Principal' ? 'bg-purple-100 text-purple-800' : 
            'bg-green-100 text-green-800'
          }`}
        >
          {role}
        </span>
      );
    }
    
    return row[column];
  };

  return (
    <AdminDashboardTable 
      data={loginsData}
      columns={loginsColumns}
      headerColor="green-800"
      rowColor="green-50"
      renderCell={renderCell}
      searchTerm={searchTerm}
    />
  );
};

export default RecentLogins;
