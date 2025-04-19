import React from 'react';

interface Classroom {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

interface SchoolClassroomStepProps {
  schools: School[];
  classrooms: Classroom[];
  selectedSchool: string;
  selectedClassrooms: string[];
  onSchoolChange: (schoolId: string) => void;
  onClassroomChange: (classroomIds: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const SchoolClassroomStep = ({
  schools,
  classrooms,
  selectedSchool,
  selectedClassrooms,
  onSchoolChange,
  onClassroomChange,
  onNext,
  onBack,
  onCancel,
}: SchoolClassroomStepProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">School</label>
          <select
            className="w-full p-2 bg-gray-50 border rounded-md"
            value={selectedSchool}
            onChange={(e) => onSchoolChange(e.target.value)}
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Classroom(s)</label>
          <div className="space-y-2">
            {selectedClassrooms.map((id) => {
              const classroom = classrooms.find((c) => c.id === id);
              if (!classroom) return null;
              return (
                <div
                  key={id}
                  className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full mr-2"
                >
                  <span>{classroom.name}</span>
                  <button
                    onClick={() =>
                      onClassroomChange(selectedClassrooms.filter((cid) => cid !== id))
                    }
                    className="ml-2"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          <select
            className="w-full p-2 bg-gray-50 border rounded-md mt-2"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onClassroomChange([...selectedClassrooms, e.target.value]);
              }
            }}
          >
            <option value="">Select classrooms</option>
            {classrooms
              .filter((c) => !selectedClassrooms.includes(c.id))
              .map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observation Tool</label>
          <select className="w-full p-2 bg-gray-50 border rounded-md">
            <option value="">Select an observation tool</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Back
          </button>
          <button onClick={onCancel} className="px-4 py-2 text-gray-700 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolClassroomStep; 