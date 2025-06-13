'use client';

import React, { useState, useEffect } from 'react';
import {Student, Exam, ArrowDownRight, PencilSimpleLine, Eye, Notebook, Book } from "@phosphor-icons/react";
import AdminDashboardTable, { TableRow, Column } from '../../AdminDashboardTable';
import { viewClassroomSession } from '@/services/networkService';

// Define types directly in the component file
interface ObservationClassroom {
  observation_id: string;
  classroom_id: string;
  teacher_name: string;
  course: string;
  grades: string[];
  interventions: string[];
  curriculums: string[];
  submission_state: string;
}

interface SessionData {
  date: string;
  school: string;
  school_id: string;
  observation_tool: string;
  observation_tool_id: string;
  observation_classrooms: ObservationClassroom[];
  total_observation_classrooms: number;
  total_pages: number;
  curr_page: number;
  per_page: number;
}

interface ViewClassroomProps {
  // Although named schoolId, this should actually be the session ID for the API call
  schoolId?: string; // This is the session ID, not the school ID
  onBack?: () => void;
}

// Type guard to check if a value is an object with a name property
function isSchoolObject(value: any): value is { id: string, name: string } {
  return value && typeof value === 'object' && 'name' in value;
}

export default function UpcomingSessionViewClassroom({ schoolId, onBack }: ViewClassroomProps) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [classroomTableData, setClassroomTableData] = useState<TableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Define columns for classroom table
  const classroomColumns: Column[] = [
    { key: 'teacher', label: 'Teacher', icon: <Student size={20} />, sortable: true },
    { key: 'course', label: 'Course/Subject', icon: <Notebook size={20} />, sortable: true },
    { key: 'grade', label: 'Grade', icon: <Exam size={20} />, sortable: true },
    { key: 'instructionalMaterials', label: 'Instructional Material(s)', icon: <Book size={20} />, sortable: false },
    { key: 'action', label: 'Action', icon: <ArrowDownRight size={20} />, sortable: false }
  ];

  console.log('UpcomingSessionViewClassroom initialized with ID:', schoolId);

  // Combined data fetching logic for initial load, search, and pagination
  useEffect(() => {
    // Skip if no schoolId is provided
    if (!schoolId) {
      console.log('Error: No session ID provided');
      return;
    }
    
    const fetchData = async () => {
      // Only show loading on initial load or pagination, not during search
      const isInitialLoad = !searchTerm;
      const isSearching = searchTerm !== '';
      
      // Only show loading indicator for initial load or pagination, not for search
      if (isInitialLoad) {
        setIsLoading(true);
      }
      
      try {
        // Prepare request parameters
        const params: any = {
          page: currentPage,
          limit: pageSize
        };
        
        // Only add search param if there's a search term
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        const response = await viewClassroomSession(schoolId, params);
        
        if (response.success && response.data) {
          setSessionData(response.data);
          
          if (response.data.observation_classrooms && response.data.observation_classrooms.length > 0) {
            const tableData: TableRow[] = response.data.observation_classrooms.map((classroom: any) => ({
              id: classroom.classroom_id,
              name: `${classroom.teacher_name}'s Classroom`,
              teacher: classroom.teacher_name,
              course: classroom.course,
              grade: classroom.grades.join(', '),
              instructionalMaterials: [...classroom.curriculums, ...classroom.interventions],
              school: response.data.school,
              action: classroom.submission_state
            }));
            
            setClassroomTableData(tableData);
            setTotalRecords(response.data.total_observation_classrooms);
            setTotalPages(response.data.total_pages);
            setCurrentPage(response.data.curr_page);
            setPageSize(response.data.per_page);
          } else {
            setClassroomTableData([]);
            setTotalRecords(0);
            setTotalPages(0);
          }
        } else {
          console.error('Failed to fetch session data');
          setClassroomTableData([]);
          setTotalRecords(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
        setClassroomTableData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use debounce for search to avoid too many API calls
    if (searchTerm) {
      const timer = setTimeout(() => {
        fetchData();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // Immediate fetch for initial load or pagination
      fetchData();
    }
  }, [searchTerm, schoolId, currentPage, pageSize]);

  // This useEffect has been consolidated with the one above
  // The combined useEffect now handles both initial data loading and search functionality

  // Handle filters change for server-side pagination, sorting and searching
  const handleFiltersChange = (filters: any) => {
    // Update state with new filter values
    setCurrentPage(filters.page);
    setPageSize(filters.limit);
    
    // The useEffect will automatically trigger a data fetch with the updated values
    // This avoids duplicate API calls and loading states
  };

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2 items-center">
          {/* <button 
            className="text-xs text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors"
          >
            <span className="mr-1">Edit Observation</span>
            <PencilSimpleLine size={20} />
          </button>
          <span className="mx-1 text-xs">|</span> */}
          <button 
            className="text-xs text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors"
          >
            <span className="mr-1">View Calibration</span>
            <Eye size={20} />
          </button>
        </div>
      );
    }

    if (column === 'instructionalMaterials') {
      const materials = row[column] as string[];
      if (!materials?.length) return <span className="text-xs">-</span>;
      
      const displayCount = 2;
      const remaining = materials.length - displayCount;
      
      return (
        <div className="flex flex-col gap-1">
          {materials.slice(0, displayCount).map((material, index) => (
            <span key={index} className="text-xs">{material}{index < displayCount - 1 && materials.length > 1 ? ', ' : ''}</span>
          ))}
          {remaining > 0 && (
            <span className="text-xs text-[#007778]">
              +{remaining} more
            </span>
          )}
        </div>
      );
    }

    if (column === 'grade') {
      return row[column] || "N/A";
    }
    
    // Handle school column to ensure it's rendered as a string
    if (column === 'school') {
      const school = row[column];
      // Use the type guard to safely handle school objects
      if (isSchoolObject(school)) {
        return school.name;
      }
      // Otherwise return the school value directly (should be a string)
      return school || "";
    }

    return undefined;
  };

  // Always render component with table headers, even if no session data is found
  const hasClassroomData = classroomTableData && classroomTableData.length > 0;
  
  // Create a default school name if sessionData is null
  const schoolName = sessionData ? sessionData.school : "Unknown School";
  const sessionDate = sessionData ? sessionData.date : "Upcoming";
  const observationTool = sessionData ? sessionData.observation_tool : "Not Available";

  return (
    <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
      {/* Table */}
      <div className="w-full overflow-auto">
        <AdminDashboardTable
          data={classroomTableData}
          columns={classroomColumns}
          headerColor="bg-[#007778]"
          rowColor="bg-[#EDFFFF]"
          renderCell={renderCell}
          pageNumber={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
          onFiltersChange={handleFiltersChange}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}