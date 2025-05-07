"use client";

import {
  ClipboardList,
  Building2,
  FileText,
  User,
  UserCheck,
  Calendar,
  CheckCircle
} from 'lucide-react';
import DashboardTable, { TableRow, Column } from './DashboardTable';

const ObservationTools = () => {
  // Sample data for Observation Tools tab
  const observationData: TableRow[] = [
    {
      id: 1,
      toolName: 'Classroom Walkthrough',
      district: 'New York City Department of Education',
      category: 'Formative Assessment',
      creator: 'Jane Doe',
      timesUsed: 156,
      lastUsed: 'May 5, 2025',
      isActive: true
    },
    {
      id: 2,
      toolName: 'Teacher Evaluation Form',
      district: 'Los Angeles Unified School District',
      category: 'Summative Assessment',
      creator: 'John Doe',
      timesUsed: 83,
      lastUsed: 'May 6, 2025',
      isActive: true
    },
    {
      id: 3,
      toolName: 'Student Engagement Tracker',
      district: 'Chicago Public Schools',
      category: 'Formative Assessment',
      creator: 'Sarah Johnson',
      timesUsed: 214,
      lastUsed: 'May 7, 2025',
      isActive: true
    },
    {
      id: 4,
      toolName: 'Peer Review Form',
      district: 'Clark County School District',
      category: 'Peer Assessment',
      creator: 'Robert Chen',
      timesUsed: 47,
      lastUsed: 'April 30, 2025',
      isActive: true
    },
    {
      id: 5,
      toolName: 'Professional Development Plan',
      district: 'Broward County Public Schools',
      category: 'Growth Plan',
      creator: 'Maria Lopez',
      timesUsed: 92,
      lastUsed: 'May 2, 2025',
      isActive: true
    },
    {
      id: 6,
      toolName: 'New Teacher Mentoring',
      district: 'Houston Independent School District',
      category: 'Mentoring',
      creator: 'David Miller',
      timesUsed: 29,
      lastUsed: 'April 28, 2025',
      isActive: false
    },
    {
      id: 7,
      toolName: 'Instructional Strategy Feedback',
      district: 'Hawaii Department of Education',
      category: 'Formative Assessment',
      creator: 'Jennifer Lee',
      timesUsed: 118,
      lastUsed: 'May 4, 2025',
      isActive: true
    },
    {
      id: 8,
      toolName: 'Annual Performance Review',
      district: 'Orange County Public Schools',
      category: 'Summative Assessment',
      creator: 'Michael Davis',
      timesUsed: 54,
      lastUsed: 'April 15, 2025',
      isActive: true
    },
    {
      id: 9,
      toolName: 'Classroom Environment Survey',
      district: 'School District of Palm Beach County',
      category: 'Survey',
      creator: 'Thomas Brown',
      timesUsed: 176,
      lastUsed: 'May 3, 2025',
      isActive: true
    },
  ];

  // Column definitions for Observation Tools tab
  const observationColumns: Column[] = [
    { key: 'toolName', label: 'Tool Name', icon: <ClipboardList size={16} />, sortable: true },
    { key: 'district', label: 'District', icon: <Building2 size={16} />, sortable: true },
    { key: 'category', label: 'Category', icon: <FileText size={16} />, sortable: true },
    { key: 'creator', label: 'Creator', icon: <User size={16} />, sortable: true },
    { key: 'timesUsed', label: 'Times Used', icon: <UserCheck size={16} />, sortable: true },
    { key: 'lastUsed', label: 'Last Used', icon: <Calendar size={16} />, sortable: true },
    { key: 'isActive', label: 'Status', icon: <CheckCircle size={16} />, sortable: true },
  ];

  // Custom rendering for the isActive field
  const renderObservationCell = (row: TableRow, column: string) => {
    if (column === 'isActive') {
      return row[column] ? 
        <span className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span> Active
        </span> : 
        <span className="inline-flex items-center gap-1 bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span> Inactive
        </span>;
    }
    return row[column];
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Observation Tools</h2>
      <DashboardTable 
        data={observationData} 
        columns={observationColumns}
        headerColor="green-600"
      />
    </div>
  );
};

export default ObservationTools;