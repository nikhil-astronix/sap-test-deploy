import React from 'react';
import { format } from 'date-fns';

interface ReviewData {
  observationDate: Date;
  startTime: string | null;
  endTime: string | null;
  school: string;
  classrooms: string[];
  observationTool: string;
  users: { name: string; email: string }[];
  sessionAdmin: { name: string; email: string };
}

interface SessionReviewStepProps {
  data: ReviewData;
  onSchedule: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const SessionReviewStep = ({
  data,
  onSchedule,
  onBack,
  onCancel,
}: SessionReviewStepProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-medium mb-2">Observation Date</h3>
          <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{format(data.observationDate, 'MM-dd-yyyy')}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Start Time</h3>
          <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{data.startTime || 'Not set'}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">End Time</h3>
          <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{data.endTime || 'Not set'}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">School</h3>
          <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{data.school}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Classroom(s)</h3>
          <div className="flex flex-wrap gap-2">
            {data.classrooms.map((classroom) => (
              <span
                key={classroom}
                className="inline-flex items-center border border-emerald-500 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none" 
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {classroom}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Observation Tool</h3>
          <p className="text-gray-600 bg-gray-100 p-2 rounded-md">{data.observationTool}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">User(s)</h3>
          <div className="flex flex-wrap gap-2">
            {data.users.map((user) => (
              <span
                key={user.email}
                className="inline-flex items-center border border-emerald-500 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full"
              >
                <svg
                  className="w-4 h-4 mr-1" 
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                {user.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Session Admin</h3>
          <p className="inline-flex items-center border border-emerald-500 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
            <span className="relative inline-flex items-center mr-2">
              <svg
                className="w-4 h-4" 
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            </span>
            {data.sessionAdmin.name}
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onSchedule}
            className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionReviewStep; 