import React, { useState, useEffect } from 'react';

// Define types directly in the component file
interface ClassroomData {
  id: string;
  teacher: string;
  course: string;
  grade: number;
  instructionalMaterials: string[];
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

export default function PastSessionViewClassroom({ schoolId, onBack }: ViewClassroomProps) {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the data based on schoolId
    // For now, using mock data
    if (schoolId) {
      const foundSchool = mockSchoolData.find(school => school.id === schoolId);
      setSchoolData(foundSchool || null);
    } else {
      // Use first school as default if no schoolId provided
      setSchoolData(mockSchoolData[0]);
    }
  }, [schoolId]);

  if (!schoolData) {
    return <div className="p-4">No school data found</div>;
  }

  return (
    <div className="border border-blue-200 rounded-md">
      {/* Back button and header */}
      <div className="p-4 border-b border-blue-200">
        <button 
          onClick={onBack} 
          className="text-blue-500 flex items-center mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left mr-1" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
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
            <a href="#" className="text-blue-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-right mr-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
              </svg>
              {schoolData.observationTool}
            </a>
          </div>
        </div>
      </div>

      {/* Observation Classrooms heading */}
      <div className="p-4 border-b border-blue-200">
        <h3 className="text-lg font-medium">Observation Classrooms</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-200">
        <div className="bg-teal-600 text-white p-3 flex-grow text-center">
          Past Sessions
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down inline-block ml-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
        <div className="p-3 flex-grow text-center">Districts</div>
        <div className="p-3 flex-grow text-center">Observation Tools</div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-blue-200">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full border border-gray-300 rounded-md pl-10 py-2"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search absolute left-3 top-3 text-gray-400" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </div>
      </div>

      {/* Table */}
      {/* Table Component */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-4 py-2 text-left w-1/5">Teacher</th>
              <th className="px-4 py-2 text-left w-1/5">Course/Subject</th>
              <th className="px-4 py-2 text-left w-1/12">Grade</th>
              <th className="px-4 py-2 text-left w-1/5">Instructional Material(s)</th>
              <th className="px-4 py-2 text-left w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {schoolData.classrooms.map((classroom, index) => (
              <tr key={classroom.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 border-b">{classroom.teacher}</td>
                <td className="px-4 py-3 border-b">{classroom.course}</td>
                <td className="px-4 py-3 border-b">{classroom.grade}</td>
                <td className="px-4 py-3 border-b">
                  {classroom.instructionalMaterials.map((material, i) => (
                    <div key={i} className="flex">
                      <span>{material}</span>
                      {i < classroom.instructionalMaterials.length - 1 && i < 2 && <span className="text-teal-600 ml-1">+{classroom.instructionalMaterials.length - i - 1} more</span>}
                    </div>
                  )).slice(0, 1)}
                </td>
                <td className="px-4 py-3 border-b">
                  <button className="text-teal-600 px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">View Calibration</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-sm text-gray-600">1-9 of 97</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option>9</option>
              <option>25</option>
              <option>50</option>
            </select>
            <div className="flex space-x-2">
              <button className="border rounded px-2 py-1 text-sm">&lt;</button>
              <span className="text-sm text-gray-600">1/10</span>
              <button className="border rounded px-2 py-1 text-sm">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}