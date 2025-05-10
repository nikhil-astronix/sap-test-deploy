"use client";

import { ChevronLeft, Eye } from 'lucide-react';

interface ViewClassProps {
  session: any;
  sessionType: 'today' | 'upcoming' | 'past';
  onBack: () => void;
}

const ViewClass = ({ session, sessionType, onBack }: ViewClassProps) => {
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
      
      {/* Classrooms table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teacher
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course/Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructional Material(s)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classrooms.map((classroom) => (
              <tr key={classroom.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{classroom.teacher}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{classroom.course}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900">{classroom.grade}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {classroom.materials}
                    {classroom.hasMore && <span className="ml-1 text-green-600">+{classroom.moreCount}more</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="flex items-center bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700">
                    <span className="mr-1">View Calibration</span>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div>1-9 of 97</div>
        <div className="flex items-center">
          <span className="mr-2">Rows per page: 9</span>
          <button className="mx-1 px-2 py-1 rounded hover:bg-gray-200">&lt;</button>
          <button className="mx-1 px-2 py-1 rounded hover:bg-gray-200">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;