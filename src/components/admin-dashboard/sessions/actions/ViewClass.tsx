"use client";

import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { TableRow } from '../../AdminDashboardTable';

interface ViewClassProps {
  session: TableRow;
  sessionType?: 'today' | 'upcoming' | 'past';
  onBack?: () => void;
}

const ViewClass = ({ session, sessionType = 'today', onBack }: ViewClassProps) => {
  // Sample classroom data
  const classrooms = [
    { id: 1, teacher: 'Teacher Sample A', course: 'Course Sample A', grade: 2, materials: 'Illustrative Math, Amplify', hasMore: true, moreCount: 2 },
    { id: 2, teacher: 'Teacher Sample B', course: 'Course Sample B', grade: 2, materials: 'Amplify, Illustrative Math', hasMore: true, moreCount: 3 },
    { id: 3, teacher: 'Teacher Sample C', course: 'Course Sample C', grade: 3, materials: 'Amplify, Illustrative Math', hasMore: false },
    { id: 4, teacher: 'Teacher Sample D', course: 'Course Sample D', grade: 4, materials: 'Illustrative Math, Amplify', hasMore: false },
    { id: 5, teacher: 'Teacher Sample E', course: 'Course Sample E', grade: 5, materials: 'Amplify, Illustrative Math', hasMore: true, moreCount: 1 },
    { id: 6, teacher: 'Teacher Sample F', course: 'Course Sample F', grade: 6, materials: 'Illustrative Math, Amplify', hasMore: false },
    { id: 7, teacher: 'Teacher Sample G', course: 'Course Sample G', grade: 7, materials: 'Amplify, Illustrative Math', hasMore: true, moreCount: 3 },
    { id: 8, teacher: 'Teacher Sample H', course: 'Course Sample H', grade: 8, materials: 'Illustrative Math, Amplify', hasMore: true, moreCount: 2 },
    { id: 9, teacher: 'Teacher Sample I', course: 'Course Sample I', grade: 9, materials: 'Amplify, Illustrative Math', hasMore: true, moreCount: 3 },
  ];

  return (
    <div className="w-full">
        <h2 className="text-xl font-medium mb-4">Observation Classrooms</h2>
        
        {/* Classrooms table */}
        <div className="overflow-hidden border border-gray-200 rounded-md w-full mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="bg-teal-600 border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Teacher</span>
                    </div>
                  </th>
                  <th className="bg-teal-600 border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Course/Subject</span>
                    </div>
                  </th>
                  <th className="bg-teal-600 border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Grade</span>
                    </div>
                  </th>
                  <th className="bg-teal-600 border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Instructional Material(s)</span>
                    </div>
                  </th>
                  <th className="bg-teal-600 border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom, rowIndex) => (
                  <tr key={classroom.id} className={`hover:bg-gray-50 ${rowIndex % 2 === 1 ? 'bg-teal-100' : 'bg-white'}`}>
                    <td className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm">
                      <div className="text-sm font-medium text-gray-900">{classroom.teacher}</div>
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm">
                      <div className="text-sm text-gray-900">{classroom.course}</div>
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm text-center">
                      <div className="text-sm text-gray-900">{classroom.grade}</div>
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm">
                      <div className="text-sm text-gray-900">
                        {classroom.materials}
                        {classroom.hasMore && <span className="ml-1 text-green-600">+{classroom.moreCount}more</span>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm">
                      <button className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-2 py-1 rounded text-xs font-medium">
                        <span className="mr-1">View Calibration</span>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">9</span> of{' '}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
                <select className="mr-4 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value={5}>5</option>
                  <option value={9} selected>9</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">First</span>
                    <ChevronLeft size={14} />
                    <ChevronLeft size={14} className="-ml-1" />
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={14} />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">1</button>
                  <button className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight size={14} />
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Last</span>
                    <ChevronRight size={14} />
                    <ChevronRight size={14} className="-ml-1" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
    </div>
  );
};

export default ViewClass;