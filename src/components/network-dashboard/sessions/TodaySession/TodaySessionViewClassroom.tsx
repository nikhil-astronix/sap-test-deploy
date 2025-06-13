import React, { useState, useEffect } from 'react';
import {Student, Exam, ArrowDownRight, PencilSimpleLine, Eye, Notebook, Book } from "@phosphor-icons/react";
import NetworkDashboardTable, { NetworkTableRow, NetworkColumn } from '../../NetworkDashboardTable';
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

interface SchoolData {
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
  schoolId?: string;
  onBack?: () => void;
}



export default function TodaySessionViewClassroom({ schoolId, onBack }: ViewClassroomProps) {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [classroomTableData, setClassroomTableData] = useState<NetworkTableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Define columns for classroom table
  const classroomColumns: NetworkColumn[] = [
    { key: 'teacher', label: 'Teacher', icon: <Student size={20} />, sortable: true },
    { key: 'course', label: 'Course/Subject', icon: <Notebook size={20} />, sortable: true },
    { key: 'grade', label: 'Grade', icon: <Exam size={20} />, sortable: true },
    { key: 'instructionalMaterials', label: 'Instructional Material(s)', icon: <Book size={20} />, sortable: false },
    { key: 'action', label: 'Action', icon: <ArrowDownRight size={20} />, sortable: false }
  ];

  const getClassroomData = async () => {
    if (!schoolId) return;
    
    try {
      setIsLoading(true);
      console.log("schoolId", schoolId);
      const response = await viewClassroomSession(schoolId);
      
      if (response.success) {
        const data = response.data;
        setSchoolData(data);
        
        if (data.observation_classrooms && data.observation_classrooms.length > 0) {
          // Transform API data to match NetworkTableRow format
          const tableData: NetworkTableRow[] = data.observation_classrooms.map((classroom: ObservationClassroom) => ({
            id: classroom.classroom_id,
            name: classroom.teacher_name, // Required by NetworkTableRow type
            teacher: classroom.teacher_name,
            course: classroom.course,
            grade: classroom.grades.join(', '),
            instructionalMaterials: classroom.curriculums,
            action: classroom.submission_state
          }));
          
          setClassroomTableData(tableData);
          setTotalRecords(data.total_observation_classrooms);
          setTotalPages(data.total_pages);
          setCurrentPage(data.curr_page);
          setPageSize(data.per_page);
        } else {
          setClassroomTableData([]);
          setTotalRecords(0);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error("Error fetching classroom data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create dummy data for when no real data is available
  const createDummyClassroomData = (): NetworkTableRow[] => {
    return [
      {
        id: 'dummy-1',
        name: 'Sample Classroom 1', // Required by NetworkTableRow type
        teacher: 'Sample Teacher 1',
        course: 'Sample Course 1',
        grade: 3,
        instructionalMaterials: ['Sample Material 1'],
        action: 'view'
      },
      {
        id: 'dummy-2',
        name: 'Sample Classroom 2', // Required by NetworkTableRow type
        teacher: 'Sample Teacher 2',
        course: 'Sample Course 2',
        grade: 5,
        instructionalMaterials: ['Sample Material 3'],
        action: 'view'
      }
    ];
  };

  useEffect(() => {
    getClassroomData();
  }, [schoolId]);

  // Custom render function for cells
  const renderCell = (row: NetworkTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors duration-200"
          >
            <span className="mr-1">Edit Observation</span>
            <PencilSimpleLine size={20} />
          </button>
          <span className="mx-1">|</span>
          <button 
            className="text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors duration-200"
          >
            <span className="mr-1">View Calibration</span>
            <Eye size={20} />
          </button>
        </div>
      );
    }

    if (column === 'instructionalMaterials') {
      const materials = row[column] as string[];
      if (!materials || materials.length === 0) return 'No materials';
      
      // Show first two materials with comma separation
      const displayMaterials = materials.slice(0, 2).join(', ');
      
      // If more than 2 materials, show +X more
      const extraCount = materials.length > 2 ? materials.length - 2 : 0;
      
      return (
        <div>
          <span className="text-sm">{displayMaterials}</span>
          {extraCount > 0 && (
            <span className="text-[#007778] text-xs ml-1">+{extraCount} more</span>
          )}
        </div>
      );
    }

    return undefined;
  };

  // Always render component with table headers, even if no school data is found
  const hasClassroomData = classroomTableData && classroomTableData.length > 0;
  
  // Create a default school name if schoolData is null
  const schoolName = schoolData ? schoolData.school : "Unknown School";
  const sessionDate = schoolData ? schoolData.date : "Today";
  const observationTool = schoolData ? schoolData.observation_tool : "Not Available";
  

  return (
    <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
      {/* Table */}
      <div className="w-full overflow-auto">
        <NetworkDashboardTable
          data={classroomTableData}
          columns={classroomColumns}
          headerColor="#007778"
          rowColor="#EDFFFF"
          renderCell={renderCell}
          pageNumber={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isLoading={isLoading}
        />
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007778]"></div>
          </div>
        )}
      </div>
    </div>
  );
}