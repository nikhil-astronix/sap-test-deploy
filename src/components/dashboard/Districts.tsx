"use client";

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

const Districts = () => {
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
      lastSession: 'December 10, 2024',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
    {
      id: 9,
      network: 'Pinnacle Charter Network',
      district: 'School District of Palm Beach County',
      admins: { names: ['Jane Doe', 'John Doe'], more: 3 },
      users: 17,
      lastSession: 'October 27, 2024',
      sessionStatus: 'Active',
      setupStatus: 'Complete',
    },
  ];

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Districts</h2>
      <DashboardTable 
        data={districtsData} 
        columns={districtsColumns}
        headerColor="blue-600"
      />
    </div>
  );
};

export default Districts;