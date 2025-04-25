import React from 'react';
import MultiSelectDropdown from '../../MultiSelectDropdown';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AssignUsersStepProps {
  users: User[];
  selectedUsers: string[];
  sessionAdmin: string;
  onUsersChange: (userIds: string[]) => void;
  onSessionAdminChange: (userId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const AssignUsersStep = ({
  users,
  selectedUsers,
  sessionAdmin,
  onUsersChange,
  onSessionAdminChange,
  onNext,
  onBack,
  onCancel,
}: AssignUsersStepProps) => {
  // Convert users to options format
  const userOptions = users.map(user => ({
    id: user.id,
    label: user.name,
    value: user.id,
    email: user.email
  }));

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
              label="Users"
              options={userOptions}
              selectedValues={selectedUsers}
              onChange={onUsersChange}
              placeholder="Select users"
              required
              isMulti={true}
              showTags={true}
              showEmail={true}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Session Admin"
              options={userOptions}
              selectedValues={sessionAdmin ? [sessionAdmin] : []}
              onChange={(values) => onSessionAdminChange(values[0] || '')}
              placeholder="Select session admin"
              required
              allowClear={false}
              isMulti={false}
              showEmail={true}
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

export default AssignUsersStep; 