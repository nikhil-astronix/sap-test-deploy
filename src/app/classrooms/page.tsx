import React from 'react';
import Link from 'next/link';

export default function ClassroomsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Classrooms</h1>
        <Link 
          href="/classrooms/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Add New Classroom
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Classroom cards will be added here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Classroom Name</h2>
          <p className="text-gray-600 mb-4">Grade: 5</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Students: 25</span>
            <button className="text-emerald-600 hover:text-emerald-800">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
} 