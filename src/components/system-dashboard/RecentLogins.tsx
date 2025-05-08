"use client";

import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Clock,
  Mail,
  UserCircle,
  User,
  Network,
  Calendar,
  Laptop
} from 'lucide-react';
import DashboardTable, { TableRow, Column } from './DashboardTable';

interface RecentLoginsProps {
  searchTerm?: string;
}

const RecentLogins = ({ searchTerm = '' }: RecentLoginsProps) => {
  // Sample data for Recent Logins tab
  const loginData: TableRow[] = [
    {
      id: 1,
      userName: 'John Smith',
      network: 'Blue Ridge Charter Collaborative',
      district: 'New York City Department of Education',
      role: 'System Admin',
      lastLogin: 'May 7, 2025 9:30 AM',
      loginCount: 42,
      device: 'Desktop - Chrome'
    },
    {
      id: 2,
      userName: 'Maria Lopez',
      network: 'Cedar Grove Charter Network',
      district: 'Los Angeles Unified School District',
      role: 'Observer',
      lastLogin: 'May 7, 2025 8:45 AM',
      loginCount: 87,
      device: 'Mobile - Safari'
    },
    {
      id: 3,
      userName: 'Robert Chen',
      network: 'Charter Network',
      district: 'Chicago Public Schools',
      role: 'Admin',
      lastLogin: 'May 6, 2025 3:22 PM',
      loginCount: 33,
      device: 'Tablet - Chrome'
    },
    {
      id: 4,
      userName: 'Sarah Johnson',
      network: 'Charter Network',
      district: 'Clark County School District',
      role: 'Observer',
      lastLogin: 'May 6, 2025 11:05 AM',
      loginCount: 126,
      device: 'Desktop - Firefox'
    },
    {
      id: 5,
      userName: 'David Miller',
      network: 'None',
      district: 'Broward County Public Schools',
      role: 'System Admin',
      lastLogin: 'May 5, 2025 4:17 PM',
      loginCount: 58,
      device: 'Desktop - Edge'
    },
    {
      id: 6,
      userName: 'Jessica Williams',
      network: 'None',
      district: 'Houston Independent School District',
      role: 'Observer',
      lastLogin: 'May 5, 2025 1:30 PM',
      loginCount: 92,
      device: 'Mobile - Chrome'
    },
    {
      id: 7,
      userName: 'Michael Davis',
      network: 'Foundations Education Collaborative',
      district: 'Hawaii Department of Education',
      role: 'Admin',
      lastLogin: 'May 4, 2025 9:12 AM',
      loginCount: 41,
      device: 'Desktop - Safari'
    },
    {
      id: 8,
      userName: 'Jennifer Lee',
      network: 'None',
      district: 'Orange County Public Schools',
      role: 'Observer',
      lastLogin: 'May 3, 2025 10:45 AM',
      loginCount: 75,
      device: 'Tablet - Safari'
    },
    {
      id: 9,
      userName: 'Thomas Brown',
      network: 'Pinnacle Charter Network',
      district: 'School District of Palm Beach County',
      role: 'System Admin',
      lastLogin: 'May 3, 2025 8:30 AM',
      loginCount: 103,
      device: 'Desktop - Chrome'
    },
  ];

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>(loginData);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(loginData);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = loginData.filter(row => {
      return (
        (row.userName && row.userName.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.network && row.network.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.district && row.district.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.role && row.role.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.lastLogin && row.lastLogin.toString().toLowerCase().includes(lowercasedTerm))
        // (row.device && row.device.toString().toLowerCase().includes(lowercasedTerm)) ||
        // (row.loginCount !== undefined && row.loginCount.toString().includes(searchTerm))
      );
    });

    setFilteredData(filtered);
  }, [searchTerm]);

  // Column definitions for Recent Logins tab
  const loginColumns: Column[] = [
    { key: 'userName', label: 'User', icon: <User size={16} />, sortable: true },
    { key: 'network', label: 'Network', icon: <Network size={16} />, sortable: true },
    { key: 'district', label: 'District', icon: <Building2 size={16} />, sortable: true },
    { key: 'role', label: 'Role', icon: <Users size={16} />, sortable: true },
    { key: 'lastLogin', label: 'Date', icon: <Calendar size={16} />, sortable: true },
    // { key: 'loginCount', label: 'Login Count', icon: <Clock size={16} />, sortable: true },
    // { key: 'device', label: 'Device', icon: <Laptop size={16} />, sortable: true },
  ];
  

  // Custom rendering for roles with background colors
  const renderRoleCell = (row: TableRow, column: string) => {
    if (column === 'role' && row.role) {
      const role = row.role as string;
      let bgColor, textColor, dotColor;
      
      switch (role) {
        case 'System Admin':
          bgColor = 'bg-purple-200';
          textColor = 'text-purple-800';
          dotColor = 'bg-purple-800';
          break;
        case 'Admin':
          bgColor = 'bg-blue-200';
          dotColor = 'bg-blue-800';
          textColor = 'text-blue-800';
          break;
        case 'Observer':
          bgColor = 'bg-green-200';
          dotColor = 'bg-green-800';
          textColor = 'text-green-800';
          break;
        default:
          bgColor = 'bg-gray-200';
          dotColor = 'bg-gray-800';
          textColor = 'text-gray-800';
      }
      
      return (
        <span className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-md text-xs`}>
          <span className={`w-2 h-2 ${dotColor} rounded-md`}></span> {role}
        </span>
      );
    }
    return row[column];
  };

  return (
    <div>
      <DashboardTable 
        data={filteredData} 
        columns={loginColumns}
        headerColor="green-800"
        renderCell={renderRoleCell}
        rowColor="green-50"
      />
    </div>
  );
};

export default RecentLogins;