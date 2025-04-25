import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: 'Custom' | 'Default';
    title: string;
    itemType: 'Curriculum' | 'Intervention';
    isArchived: boolean;
  };
  onArchive: () => void;
}

export default function ArchiveModal({
  isOpen,
  onClose,
  item,
  onArchive,
}: ArchiveModalProps) {
  const actionText = item.isArchived ? 'unarchive' : 'archive';
  const buttonClass = item.isArchived 
    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
    : 'bg-red-600 text-white hover:bg-red-700';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black"
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white rounded-lg w-full max-w-lg shadow-xl"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.button>

              <div className="p-6">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm3-5h2.55v3h2.9v-3H16l-4-4z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-md capitalize">{actionText}</span>
                </motion.div>

                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 mb-4 text-sm"
                >
                  Are you sure you want to {actionText} this {item.itemType}?
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-50 p-2 rounded-lg shadow-md mb-4 flex justify-between items-center"
                >
                  <span className="text-gray-900 text-sm">{item.title}</span>
                  <span className="text-gray-500 text-sm">{item.itemType}</span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`${item.isArchived ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg overflow-hidden flex`}
                >
                  <div className={`w-1 ${item.isArchived ? 'bg-emerald-600' : 'bg-red-600'}`}></div>
                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-2">
                      <div>
                        <h3 className={`${item.isArchived ? 'text-emerald-600' : 'text-red-600'} font-medium mb-1 flex items-center gap-2`}>
                          <ExclamationTriangleIcon className={`w-5 h-5 ${item.isArchived ? 'text-emerald-600' : 'text-red-600'} flex-shrink-0`} />
                          {item.isArchived ? 'Note' : 'Warning'}
                        </h3>
                        <p className={`${item.isArchived ? 'text-emerald-600' : 'text-red-600'} text-xs`}>
                          {item.isArchived 
                            ? `Unarchiving this ${item.itemType.toLowerCase()} will make it visible in active views and restore all related access.`
                            : `Archiving this ${item.itemType.toLowerCase()} will remove it from active views and disable all related access.`}
                          {!item.isArchived && ' Any users, tools, or sessions connected to this ' + item.itemType.toLowerCase() + ' will no longer be accessible.'}
                          {' '}Please confirm before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-600 mr-auto bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onArchive}
                    className={`px-6 py-1 text-sm rounded-lg ${buttonClass}`}
                  >
                    {item.isArchived ? 'Unarchive' : 'Archive'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 