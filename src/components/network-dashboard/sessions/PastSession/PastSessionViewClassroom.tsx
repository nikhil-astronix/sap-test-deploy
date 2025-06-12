import React, { useState, useEffect } from 'react';
import {Student, Exam, ArrowDownRight, Eye, Notebook, Book } from "@phosphor-icons/react";
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



export default function PastSessionViewClassroom({ schoolId, onBack }: ViewClassroomProps) {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [classroomTableData, setClassroomTableData] = useState<NetworkTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getClassroomData = async () => {
    if (!schoolId) return;
    
    try {
      setIsLoading(true);
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
            materials: classroom.curriculums.join(', '),
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

  useEffect(() => {
    getClassroomData();
  }, [schoolId]);

  // Define columns for the NetworkDashboardTable
  const classroomColumns: NetworkColumn[] = [
    { key: 'teacher', label: 'Teacher', sortable: true, icon: <Student size={20} /> },
    { key: 'course', label: 'Course/Subject', sortable: true, icon: <Notebook size={20} /> },
    { key: 'grade', label: 'Grade', sortable: true, icon: <Exam size={20} /> },
    { key: 'materials', label: 'Instructional Material(s)', sortable: false, icon: <Book size={20} /> },
    { key: 'action', label: 'Action', sortable: false, icon: <ArrowDownRight size={20} /> }
  ];

  // Custom render function for cells
  const renderCell = (row: NetworkTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          {/* <button 
            className="text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors duration-200"
            onClick={() => console.log('Edit observation for classroom:', row.id)}
          >
            <span className="mr-1">Edit Observation</span>
          </button>
          <span className="mx-1">|</span> */}
          <button 
            className="text-[#007778] hover:text-white hover:bg-[#007778] flex items-center px-3 py-1 rounded-md transition-colors duration-200"
            onClick={() => console.log('View calibration for classroom:', row.id)}
          >
            <span className="mr-1">View Calibration</span>
            <Eye size={20} />
          </button>
        </div>
      );
    }
    
    if (column === 'materials' || column === 'instructionalMaterials') {
      const materials = row[column] as string[] || [];
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

  // Create a default school name if schoolData is null
  const schoolName = schoolData ? schoolData.school : "Unknown School";
  const sessionDate = schoolData ? schoolData.date : "Past Date";
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