"use client";

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Building2,
  FileText,
  User,
  UserCheck,
  Calendar,
  CheckCircle,
  Hash
} from 'lucide-react';
import DashboardTable, { TableRow, Column } from './DashboardTable';

interface ObservationToolsProps {
  searchTerm?: string;
}

const ObservationTools = ({ searchTerm = '' }: ObservationToolsProps) => {
  // Sample data for Observation Tools tab
  const observationData: TableRow[] = [
    {
      id: 1,
      observationTool: 'e³ Literacy FS',
      totalSessions: 60,
      usedInDistricts: 5,
      usedInSchools: 12,
      createdBy: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      }
    },
    {
      id: 2,
      observationTool: 'IPG Literacy',
      totalSessions: 45,
      usedInDistricts: 4,
      usedInSchools: 9,
      createdBy: {
        name: 'Jane Doe',
        email: 'janedoe@example.com'
      }
    },
    {
      id: 3,
      observationTool: 'e³ Literacy FS',
      totalSessions: 33,
      usedInDistricts: 3,
      usedInSchools: 11,
      createdBy: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      }
    },
    {
      id: 4,
      observationTool: 'Board e³ Literacy',
      totalSessions: 20,
      usedInDistricts: 2,
      usedInSchools: 20,
      createdBy: {
        name: 'Jane Doe',
        email: 'janedoe@example.com'
      }
    },
    {
      id: 5,
      observationTool: 'e³ Math',
      totalSessions: 18,
      usedInDistricts: 2,
      usedInSchools: 9,
      createdBy: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      }
    },
    {
      id: 6,
      observationTool: 'IPG Literacy',
      totalSessions: 15,
      usedInDistricts: 3,
      usedInSchools: 5,
      createdBy: {
        name: 'Jane Doe',
        email: 'janedoe@example.com'
      }
    },
    {
      id: 7,
      observationTool: 'e³ Literacy FS',
      totalSessions: 9,
      usedInDistricts: 3,
      usedInSchools: 3,
      createdBy: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      }
    },
    {
      id: 8,
      observationTool: 'e³ Math',
      totalSessions: 4,
      usedInDistricts: 2,
      usedInSchools: 4,
      createdBy: {
        name: 'Jane Doe',
        email: 'janedoe@example.com'
      }
    },
    {
      id: 9,
      observationTool: 'Board e³ Literacy',
      totalSessions: 1,
      usedInDistricts: 1,
      usedInSchools: 1,
      createdBy: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      }
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

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>(observationData);

  // Filter data when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(observationData);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = observationData.filter(row => {
      return (
        (row.toolName && row.toolName.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.district && row.district.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.category && row.category.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.creator && row.creator.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.lastUsed && row.lastUsed.toString().toLowerCase().includes(lowercasedTerm)) ||
        (row.timesUsed !== undefined && row.timesUsed.toString().includes(searchTerm)) ||
        (row.isActive !== undefined && (row.isActive ? 'active' : 'inactive').includes(lowercasedTerm))
      );
    });

    setFilteredData(filtered);
  }, [searchTerm]);

  // Column definitions for Observation Tools tab
  const observationColumns: Column[] = [
    { key: 'observationTool', label: 'Observation Tool', icon: <ClipboardList size={16} />, sortable: true },
    { key: 'totalSessions', label: 'Total Sessions', icon: <Hash size={16} />, sortable: true },
    { key: 'usedInDistricts', label: 'Used in Districts', icon: <Hash size={16} />, sortable: true },
    { key: 'usedInSchools', label: 'Used in Schools', icon: <Hash size={16} />, sortable: true },
    { key: 'createdBy', label: 'Created By', icon: <User size={16} />, sortable: true },
  ];

  // Custom rendering for columns
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'createdBy' && row.createdBy) {
      const creator = row.createdBy as { name: string; email: string };
      return (
        <div>
          <div>{creator.name}</div>
          <div className="text-xs text-gray-500">{creator.email}</div>
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
        columns={observationColumns}
        headerColor="purple-800"
        renderCell={renderCell}
        rowColor="purple-50"
      />
    </div>
  );
};

export default ObservationTools;