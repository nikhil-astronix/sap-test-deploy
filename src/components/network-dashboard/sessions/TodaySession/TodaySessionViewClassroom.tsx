import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, ChevronRight, Search, User, Book, FileText } from 'lucide-react';
import NetworkDashboardTable, { NetworkTableRow, NetworkColumn } from '../../NetworkDashboardTable';

// Define types directly in the component file
interface ClassroomData {
  id: string;
  teacher: string;
  course: string;
  grade: number;
  instructionalMaterials: string[];
  action?: string;
}

interface SchoolData {
  id: string;
  name: string;
  date: string;
  observationTool: string;
  classrooms: ClassroomData[];
}

interface ViewClassroomProps {
  schoolId?: string;
  onBack?: () => void;
}

// Mock data
const mockSchoolData: SchoolData[] = [
  {
    id: '1',
    name: 'Elmwood Elementary School',
    date: 'Jan 20',
    observationTool: 'Literacy FS',
    classrooms: [
      {
        id: '1',
        teacher: 'Teacher Sample A',
        course: 'Course Sample A',
        grade: 2,
        instructionalMaterials: ['Illustrative Math', 'Amplify', '2 more']
      },
      {
        id: '2',
        teacher: 'Teacher Sample B',
        course: 'Course Sample B',
        grade: 2,
        instructionalMaterials: ['Amplify', 'Illustrative Math', '3 more']
      },
      {
        id: '3',
        teacher: 'Teacher Sample C',
        course: 'Course Sample C',
        grade: 3,
        instructionalMaterials: ['Amplify', 'Illustrative Math']
      },
      {
        id: '4',
        teacher: 'Teacher Sample D',
        course: 'Course Sample D',
        grade: 4,
        instructionalMaterials: ['Illustrative Math', 'Amplify']
      },
      {
        id: '5',
        teacher: 'Teacher Sample E',
        course: 'Course Sample E',
        grade: 5,
        instructionalMaterials: ['Amplify', 'Illustrative Math', '1 more']
      },
      {
        id: '6',
        teacher: 'Teacher Sample F',
        course: 'Course Sample F',
        grade: 6,
        instructionalMaterials: ['Illustrative Math', 'Amplify']
      },
      {
        id: '7',
        teacher: 'Teacher Sample G',
        course: 'Course Sample G',
        grade: 7,
        instructionalMaterials: ['Amplify', 'Illustrative Math', '3 more']
      },
      {
        id: '8',
        teacher: 'Teacher Sample H',
        course: 'Course Sample H',
        grade: 8,
        instructionalMaterials: ['Illustrative Math', 'Amplify', '2 more']
      },
      {
        id: '9',
        teacher: 'Teacher Sample I',
        course: 'Course Sample I',
        grade: 9,
        instructionalMaterials: ['Amplify', 'Illustrative Math', '3 more']
      }
    ]
  },
  {
    id: '2',
    name: 'Riverside Middle School',
    date: 'Jan 22',
    observationTool: 'Math FS',
    classrooms: [
      {
        id: '10',
        teacher: 'Teacher Sample J',
        course: 'Course Sample J',
        grade: 6,
        instructionalMaterials: ['Illustrative Math', 'Amplify', '1 more']
      },
      {
        id: '11',
        teacher: 'Teacher Sample K',
        course: 'Course Sample K',
        grade: 7,
        instructionalMaterials: ['Amplify', 'Illustrative Math', '2 more']
      }
    ]
  }
];

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
    { key: 'teacher', label: 'Teacher', icon: <User size={16} />, sortable: true },
    { key: 'course', label: 'Course/Subject', icon: <Book size={16} />, sortable: true },
    { key: 'grade', label: 'Grade', icon: <FileText size={16} />, sortable: true },
    { key: 'instructionalMaterials', label: 'Instructional Material(s)', icon: <FileText size={16} />, sortable: false },
    { key: 'action', label: 'Action', icon: <FileText size={16} />, sortable: false }
  ];

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
    // Using dummy/mock data rather than API calls
    setIsLoading(true);
    
    // Simulate a brief loading time
    const timeoutId = setTimeout(() => {
      if (schoolId) {
        const foundSchool = mockSchoolData.find(school => school.id === schoolId);
        setSchoolData(foundSchool || null);
        
        if (foundSchool && foundSchool.classrooms && foundSchool.classrooms.length > 0) {
          // Transform classrooms to match NetworkTableRow format
          const tableData: NetworkTableRow[] = foundSchool.classrooms.map(classroom => ({
            id: classroom.id,
            name: `${classroom.teacher}'s Classroom`, // Required by NetworkTableRow type
            teacher: classroom.teacher,
            course: classroom.course,
            grade: classroom.grade,
            instructionalMaterials: classroom.instructionalMaterials,
            action: ""
          }));
          setClassroomTableData(tableData);
          setTotalRecords(tableData.length);
          setTotalPages(Math.ceil(tableData.length / pageSize));
        } else {
          // If no classrooms found or empty classrooms array, provide dummy data
          const dummyData = createDummyClassroomData();
          setClassroomTableData(dummyData);
          setTotalRecords(dummyData.length);
          setTotalPages(Math.ceil(dummyData.length / pageSize));
        }
      } else {
        // Use first school as default if no schoolId provided
        const defaultSchool = mockSchoolData[0];
        setSchoolData(defaultSchool || null);
        
        if (defaultSchool && defaultSchool.classrooms && defaultSchool.classrooms.length > 0) {
          const tableData: NetworkTableRow[] = defaultSchool.classrooms.map(classroom => ({
            id: classroom.id,
            name: `${classroom.teacher}'s Classroom`, // Required by NetworkTableRow type
            teacher: classroom.teacher,
            course: classroom.course,
            grade: classroom.grade,
            instructionalMaterials: classroom.instructionalMaterials,
            action: 'view'
          }));
          setClassroomTableData(tableData);
          setTotalRecords(tableData.length);
          setTotalPages(Math.ceil(tableData.length / pageSize));
        } else {
          // If no classrooms found or empty classrooms array, provide dummy data
          const dummyData = createDummyClassroomData();
          setClassroomTableData(dummyData);
          setTotalRecords(dummyData.length);
          setTotalPages(Math.ceil(dummyData.length / pageSize));
        }
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [schoolId, pageSize]);

  // Custom render function for cells
  const renderCell = (row: NetworkTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-teal-600 hover:text-teal-800 flex items-center bg-teal-100 px-3 py-1 rounded-md"
          >
            <span className="mr-1">Edit Observation</span>
          </button>
          <span className="mx-1">|</span>
          <button 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">View Calibration</span>
          </button>
        </div>
      );
    }

    if (column === 'instructionalMaterials') {
      const materials = row[column] as string[];
      return materials?.length ? (
        <div className="flex flex-col gap-1">
          {materials.map((material, index) => (
            <span key={index} className="text-sm">{material}</span>
          ))}
        </div>
      ) : (
        "No materials"
      );
    }

    return undefined;
  };

  // Always render component with table headers, even if no school data is found
  const hasClassroomData = classroomTableData && classroomTableData.length > 0;
  
  // Create a default school name if schoolData is null
  const schoolName = schoolData ? schoolData.name : "Unknown School";
  const sessionDate = schoolData ? schoolData.date : "Today";
  const observationTool = schoolData ? schoolData.observationTool : "Not Available";
  

  return (
    <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button 
          onClick={onBack} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>
      </div>

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
      </div>
    </div>
  );
}