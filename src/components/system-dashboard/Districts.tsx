"use client";

import { useState, useEffect } from 'react';
import { 
  Network,
  Building2,
  Users,
  Hash,
  Clock,
  ActivitySquare,
  Settings
} from 'lucide-react';
import DashboardTable, { TableRow, Column } from './DashboardTable';

interface DistrictsProps {
  searchTerm?: string;
}

const Districts = ({ searchTerm = '' }: DistrictsProps) => {
  // Sample data for Districts tab
  const districtsData: TableRow[] = [
    {
      id: 1,
      network: 'Blue Ridge Charter Collaborative',
      district: 'New York City Department of Education',
      admins: { names: ['Jane Doe', 'John Doe'], more: 2 },
      users: 0,
      lastSession: null,
      sessionStatus: 'No Session',
      setupStatus: 'Incomplete',
    },
    {
      id: 2,
      network: 'Cedar Grove Charter Network',
      district: 'Los Angeles Unified School District',
      admins: { names: ['John Doe'], more: 0 },
      users: 0,
      lastSession: null,
      sessionStatus: 'No Session',
      setupStatus: 'Incomplete',
    },
    {
      id: 3,
      network: 'Charter Network',
      district: 'Chicago Public Schools',
      admins: { names: ['Jane Doe'], more: 0 },
      users: 5,
      lastSession: null,
      sessionStatus: 'No Session',
      setupStatus: 'Partial',
    },
    {
      id: 4,
      network: 'Charter Network',
      district: 'Clark County School District',
      admins: { names: ['John Doe'], more: 0 },
      users: 20,
      lastSession: 'April 2, 2025',
      sessionStatus: 'Inactive',
      setupStatus: 'Complete',
    },
    {
      id: 5,
      network: 'None',
      district: 'Broward County Public Schools',
      admins: { names: ['Jane Doe', 'John Doe'], more: 2 },
      users: 5,
      lastSession: 'April 6, 2025',
      sessionStatus: 'Inactive',
      setupStatus: 'Complete',
    },
    {
      id: 6,
      network: 'None',
      district: 'Houston Independent School District',
      admins: { names: ['Jane Doe'], more: 0 },
      users: 20,
      lastSession: 'April 6, 2025',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
    {
      id: 7,
      network: 'Foundations Education Collaborative',
      district: 'Hawaii Department of Education',
      admins: { names: ['John Doe'], more: 0 },
      users: 9,
      lastSession: 'February 25, 2025',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
    {
      id: 8,
      network: 'None',
      district: 'Orange County Public Schools',
      admins: { names: ['Jane Doe'], more: 0 },
      users: 4,
      lastSession: 'December 10, 2025',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
    {
      id: 9,
      network: 'Pinnacle Charter Network',
      district: 'School District of Palm Beach County',
      admins: { names: ['Jane Doe', 'John Doe'], more: 3 },
      users: 17,
      lastSession: 'October 27, 2025',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
  ];

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>(districtsData);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(districtsData);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = districtsData.filter(row => {
      return (
        (row.network && row.network.toLowerCase().includes(lowercasedTerm)) ||
        (row.district && row.district.toLowerCase().includes(lowercasedTerm)) ||
        (row.admins && row.admins.names.some(name => name.toLowerCase().includes(lowercasedTerm))) ||
        (row.lastSession && row.lastSession.toLowerCase().includes(lowercasedTerm)) ||
        (row.sessionStatus && row.sessionStatus.toLowerCase().includes(lowercasedTerm)) ||
        (row.setupStatus && row.setupStatus.toLowerCase().includes(lowercasedTerm)) ||
        (row.users !== undefined && row.users.toString().includes(searchTerm))
      );
    });

    setFilteredData(filtered);
  }, [searchTerm]);

  // Column definitions for Districts tab
  const districtsColumns: Column[] = [
    { key: 'network', label: 'Network', icon: <Network size={16} />, sortable: true },
    { key: 'district', label: 'District', icon: <Building2 size={16} />, sortable: true },
    { key: 'admins', label: 'Admins', icon: <Users size={16} />, sortable: false },
    { key: 'users', label: 'Number of Users', icon: <Hash size={16} />, sortable: true },
    { key: 'lastSession', label: 'Last Session', icon: <Clock size={16} />, sortable: true },
    { key: 'sessionStatus', label: 'Session Status', icon: <ActivitySquare size={16} />, sortable: true },
    { key: 'setupStatus', label: 'Setup Status', icon: <Settings size={16} />, sortable: true },
  ];

  // Render custom cells with tooltip
  const renderSessionCell = (row: TableRow, column: string) => {
    // Handle admins column specifically
    if (column === 'admins' && row.admins) {
      const { names, more } = row.admins;
      return (
        <div>
          {names.join(', ')}
          {more ? ` +${more} more` : ''}
        </div>
      );
    }
    
    // Handle session status column
    if (column === 'sessionStatus') {
      const status = row[column] as string;
      let bgColor, textColor, completedCount, upcomingCount;
      
      switch (status) {
        case 'Active':
          bgColor = 'bg-green-200';
          textColor = 'text-green-800';
          completedCount = 15;
          upcomingCount = 0;
          break;
        case 'Inactive':
          bgColor = 'bg-yellow-200';
          textColor = 'text-yellow-800';
          completedCount = 15;
          upcomingCount = 0;
          break;
        case 'No Session':
          bgColor = 'bg-red-200';
          textColor = 'text-red-800';
          completedCount = 0;
          upcomingCount = 0;
          break;
        default:
          return status;
      }
      
      return (
        <div className="relative group">
          <span className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}>
            <span className="w-2 h-2 bg-black rounded-full"></span> {status}
          </span>
          <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
            <div className="flex items-center justify-between whitespace-nowrap">
              <span>Completed {completedCount}</span>
              <span className="mx-1">|</span>
              <span>Upcoming {upcomingCount}</span>
            </div>
          </div>
        </div>
      );
    }
    
    // For other columns, check if the value is an object
    const value = row[column];
    if (value !== null && typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return value;
  };

  return (
    <div>
      <DashboardTable 
        data={filteredData} 
        columns={districtsColumns}
        headerColor="blue-700"
        renderCell={renderSessionCell}
        rowColor="blue-50"
      />
    </div>
  );
};

export default Districts;