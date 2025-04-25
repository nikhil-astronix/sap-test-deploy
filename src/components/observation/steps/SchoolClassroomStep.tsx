import React, { useState } from 'react';
import MultiSelectDropdown from '../../MultiSelectDropdown';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedObservationTool, setSelectedObservationTool] = useState<string>('');

  // Convert schools to options format
  const schoolOptions = schools.map(school => ({
    id: school.id,
    label: school.name,
    value: school.id
  }));

  // Convert classrooms to options format
  const classroomOptions = classrooms.map(classroom => ({
    id: classroom.id,
    label: classroom.name,
    value: classroom.id
  }));

  // Convert observation tools to options format (placeholder)
  const observationToolOptions = [
    { id: '1', label: 'Tool 1', value: '1' },
    { id: '2', label: 'Tool 2', value: '2' }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <MultiSelectDropdown
              label="School"
              options={schoolOptions}
              selectedValues={selectedSchool ? [selectedSchool] : []}
              onChange={(values) => onSchoolChange(values[0] || '')}
              placeholder="Select a school"
              required
              allowClear={false}
              isMulti={false}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Classroom(s)"
              options={classroomOptions}
              selectedValues={selectedClassrooms}
              onChange={onClassroomChange}
              placeholder="Select classrooms"
              required
              isMulti={true}
              showTags={true}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Observation Tool"
              options={observationToolOptions}
              selectedValues={selectedObservationTool ? [selectedObservationTool] : []}
              onChange={(values) => setSelectedObservationTool(values[0] || '')}
              placeholder="Select an observation tool"
              required
              isMulti={false}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={onBack}
              className="px-4 py-2 text-emerald-700 hover:text-emerald-900 mr-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none" 
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back
            </button>
            <button 
              onClick={onCancel} 
              className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-100 rounded-md"
            >
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
      </motion.div>
    </AnimatePresence>
  );
};

export default SchoolClassroomStep; 