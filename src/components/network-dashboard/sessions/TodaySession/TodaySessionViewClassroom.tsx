import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import ClassroomTable, { ClassroomTableRow, ClassroomColumn } from '../../sessions/ClassroomTable';

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
  const [classroomTableData, setClassroomTableData] = useState<ClassroomTableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Define columns for classroom table
  const classroomColumns: ClassroomColumn[] = [
    { key: 'teacher', label: 'Teacher', icon: <span className="flex items-center">👨‍🏫</span>, sortable: true },
    { key: 'course', label: 'Course/Subject', icon: <span className="flex items-center">📚</span>, sortable: true },
    { key: 'grade', label: 'Grade', icon: <span className="flex items-center">🏫</span>, sortable: true },
    { key: 'instructionalMaterials', label: 'Instructional Material(s)', icon: <span className="flex items-center">📖</span>, sortable: true },
    { key: 'action', label: 'Action', icon: <span className="flex items-center">⚡</span>, sortable: false }
  ];

  useEffect(() => {
    // Using dummy/mock data rather than API calls
    setIsLoading(true);
    
    // Simulate a brief loading time
    const timeoutId = setTimeout(() => {
      if (schoolId) {
        const foundSchool = mockSchoolData.find(school => school.id === schoolId);
        setSchoolData(foundSchool || null);
        
        if (foundSchool) {
          // Transform classrooms to match ClassroomTableRow format
          const tableData: ClassroomTableRow[] = foundSchool.classrooms.map(classroom => ({
            id: classroom.id,
            teacher: classroom.teacher,
            course: classroom.course,
            grade: classroom.grade,
            instructionalMaterials: classroom.instructionalMaterials,
            action: ""
          }));
          setClassroomTableData(tableData);
        }
      } else {
        // Use first school as default if no schoolId provided
        setSchoolData(mockSchoolData[0]);
        
        if (mockSchoolData[0]) {
          const tableData: ClassroomTableRow[] = mockSchoolData[0].classrooms.map(classroom => ({
            id: classroom.id,
            teacher: classroom.teacher,
            course: classroom.course,
            grade: classroom.grade,
            instructionalMaterials: classroom.instructionalMaterials,
            action: 'view'
          }));
          setClassroomTableData(tableData);
        }
      }
      setIsLoading(false);
    }, 800); // 800ms delay to simulate loading
    
    return () => clearTimeout(timeoutId);
  }, [schoolId]);

  // Custom render function for cells
  const renderCell = (row: ClassroomTableRow, column: string) => {
    if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-teal-600 hover:text-teal-800 flex items-center bg-teal-100 px-3 py-1 rounded-md"
          >
            <span className="mr-1">Edit Observation</span>
            <span>✏️</span>
          </button>
          <span className="mx-1">|</span>
          <button 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">View Calibration</span>
            <span>👁️</span>
          </button>
        </div>
      );
    }
    
    if (column === 'instructionalMaterials') {
      return (
        <div>
          {row.instructionalMaterials}
        </div>
      );
    }
    
    return undefined;
  };

  if (!schoolData) {
    return <div className="p-4">No school data found</div>;
  }

  return (
    <div className="border border-gray-200 rounded-md shadow-sm overflow-hidden">
      {/* Back button and header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <button 
          onClick={onBack} 
          className="text-gray-600 hover:text-gray-800 flex items-center mb-4 transition"
        >
          <ChevronLeft className="mr-1" size={16} />
          Back
        </button>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-teal-600 text-white rounded-md px-2 py-1 text-sm mr-2">
              {schoolData.date}
            </div>
            <h2 className="text-lg font-medium">{schoolData.name} Observation Session</h2>
          </div>
          <div className="flex items-center">
            <a href="#" className="text-blue-500 hover:text-blue-700 flex items-center transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-right mr-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
              </svg>
              {schoolData.observationTool}
            </a>
          </div>
        </div>
      </div>

      {/* Observation Classrooms heading */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium">Observation Classrooms</h3>
      </div>

      {/* Table */}
      <div>
        <ClassroomTable 
          data={classroomTableData}
          columns={classroomColumns}
          headerColor="#007778"
          rowColor="#EDFFFF"
          renderCell={renderCell}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}