import React from 'react';

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
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">User(s)</label>
          <div className="space-y-2">
            {selectedUsers.map((id) => {
              const user = users.find((u) => u.id === id);
              if (!user) return null;
              return (
                <div
                  key={id}
                  className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full mr-2"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() =>
                      onUsersChange(selectedUsers.filter((uid) => uid !== id))
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
                onUsersChange([...selectedUsers, e.target.value]);
              }
            }}
          >
            <option value="">Select users</option>
            {users
              .filter((u) => !selectedUsers.includes(u.id))
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Session Admin</label>
          <select
            className="w-full p-2 bg-gray-50 border rounded-md"
            value={sessionAdmin}
            onChange={(e) => onSessionAdminChange(e.target.value)}
          >
            <option value="">Select session admin</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
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

export default AssignUsersStep; 