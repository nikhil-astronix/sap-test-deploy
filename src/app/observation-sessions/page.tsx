import React from 'react';
import Link from 'next/link';

export default function ObservationSessionsPage() {
  return (
    <div className="max-w-6xl h-full mx-auto py-8  bg-white rounded-lg border p-6 shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Observation Sessions</h1>
        <Link
          href="/observation-sessions/schedule"
          className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
        >
          Schedule New Session
        </Link>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-500 text-center py-8">No sessions scheduled yet.</p>
      </div>
    </div>
  );
} 