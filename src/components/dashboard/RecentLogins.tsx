"use client";

import {
  Users,
  Building2,
  Clock,
  Mail,
  UserCircle,
  Calendar,
  Laptop
} from 'lucide-react';
import DashboardTable, { TableRow, Column } from './DashboardTable';

const RecentLogins = () => {
  // Sample data for Recent Logins tab
  const loginData: TableRow[] = [
    {
      id: 1,
      userName: 'John Smith',
      email: 'jsmith@edu.org',
      district: 'New York City Department of Education',
      role: 'Admin',
      lastLogin: 'May 7, 2025 9:30 AM',
      loginCount: 42,
      device: 'Desktop - Chrome'
    },
    {
      id: 2,
      userName: 'Maria Lopez',
      email: 'mlopez@laedu.net',
      district: 'Los Angeles Unified School District',
      role: 'Teacher',
      lastLogin: 'May 7, 2025 8:45 AM',
      loginCount: 87,
      device: 'Mobile - Safari'
    },
    {
      id: 3,
      userName: 'Robert Chen',
      email: 'rchen@cps.edu',
      district: 'Chicago Public Schools',
      role: 'Teacher',
      lastLogin: 'May 6, 2025 3:22 PM',
      loginCount: 33,
      device: 'Tablet - Chrome'
    },
    {
      id: 4,
      userName: 'Sarah Johnson',
      email: 'sjohnson@ccsd.net',
      district: 'Clark County School District',
      role: 'Admin',
      lastLogin: 'May 6, 2025 11:05 AM',
      loginCount: 126,
      device: 'Desktop - Firefox'
    },
    {
      id: 5,
      userName: 'David Miller',
      email: 'dmiller@browardschools.com',
      district: 'Broward County Public Schools',
      role: 'Coach',
      lastLogin: 'May 5, 2025 4:17 PM',
      loginCount: 58,
      device: 'Desktop - Edge'
    },
    {
      id: 6,
      userName: 'Jessica Williams',
      email: 'jwilliams@houstonisd.org',
      district: 'Houston Independent School District',
      role: 'Admin',
      lastLogin: 'May 5, 2025 1:30 PM',
      loginCount: 92,
      device: 'Mobile - Chrome'
    },
    {
      id: 7,
      userName: 'Michael Davis',
      email: 'mdavis@hawaiidoe.org',
      district: 'Hawaii Department of Education',
      role: 'Teacher',
      lastLogin: 'May 4, 2025 9:12 AM',
      loginCount: 41,
      device: 'Desktop - Safari'
    },
    {
      id: 8,
      userName: 'Jennifer Lee',
      email: 'jlee@ocps.net',
      district: 'Orange County Public Schools',
      role: 'Coach',
      lastLogin: 'May 3, 2025 10:45 AM',
      loginCount: 75,
      device: 'Tablet - Safari'
    },
    {
      id: 9,
      userName: 'Thomas Brown',
      email: 'tbrown@palmbeachschools.org',
      district: 'School District of Palm Beach County',
      role: 'Admin',
      lastLogin: 'May 3, 2025 8:30 AM',
      loginCount: 103,
      device: 'Desktop - Chrome'
    },
  ];

  // Column definitions for Recent Logins tab
  const loginColumns: Column[] = [
    { key: 'userName', label: 'User Name', icon: <UserCircle size={16} />, sortable: true },
    { key: 'email', label: 'Email', icon: <Mail size={16} />, sortable: true },
    { key: 'district', label: 'District', icon: <Building2 size={16} />, sortable: true },
    { key: 'role', label: 'Role', icon: <Users size={16} />, sortable: true },
    { key: 'lastLogin', label: 'Last Login', icon: <Calendar size={16} />, sortable: true },
    { key: 'loginCount', label: 'Login Count', icon: <Clock size={16} />, sortable: true },
    { key: 'device', label: 'Device', icon: <Laptop size={16} />, sortable: true },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Logins</h2>
      <DashboardTable 
        data={loginData} 
        columns={loginColumns}
        headerColor="purple-600"
      />
    </div>
  );
};

export default RecentLogins;