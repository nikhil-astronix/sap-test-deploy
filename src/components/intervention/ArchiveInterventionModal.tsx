import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Archive } from "lucide-react";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: "Custom" | "Default";
    title: string;
    itemType: "Curriculum" | "Intervention";
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
  const actionText = item.isArchived ? "unarchive" : "archive";
  const buttonClass = item.isArchived
    ? "bg-emerald-600 text-white hover:bg-emerald-700"
    : "bg-[#C23E19] text-white hover:bg-red-700";

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
              className="relative bg-white rounded-xl  w-full max-w-lg shadow-xl"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-800 hover:text-gray-900 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.button>

              <div className="p-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Archive className="text-gray-600" size={24} />
                  <span className="text-[16px] text-black font-medium capitalize">
                    {actionText}
                  </span>
                </motion.div>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-black mb-4 text-[14px] font-medium"
                >
                  Are you sure you want to {actionText} this{" "}
                  {item.itemType == "Curriculum"
                    ? "Instructional Material"
                    : "Tags & Attributes"}
                  ?
                </motion.p>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-[#F4F6F8] p-2 rounded-[6px] shadow-md mb-4 flex justify-between items-center py-4"
                >
                  <span className="text-black-400 text-[14px] font-semibold">
                    {item.title}
                  </span>
                  <span className="text-black-400 text-[14px] font-semibold">
                    {item.itemType === "Curriculum"
                      ? "Instructional Material"
                      : "Tags & Attributes"}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`${
                    item.isArchived ? "bg-emerald-50" : "bg-red-50"
                  } rounded-lg overflow-hidden flex`}
                >
                  <div
                    className={`w-1 ${
                      item.isArchived ? "bg-emerald-600" : "bg-[#FFF5F5]"
                    }`}
                  ></div>
                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-2">
                      <div>
                        <h3
                          className={`${
                            item.isArchived
                              ? "text-emerald-600"
                              : "text-[#C23E19]"
                          } font-medium mb-1 flex items-center gap-2`}
                        >
                          <ExclamationTriangleIcon
                            className={`w-5 h-5 ${
                              item.isArchived
                                ? "text-emerald-600"
                                : "text-[#C23E19]"
                            } flex-shrink-0 font-medium`}
                          />
                          {item.isArchived ? "Note" : "Warning"}
                        </h3>
                        <p
                          className={`${
                            item.isArchived
                              ? "text-emerald-600"
                              : "text-[#C23E19]"
                          } text-sm font-medium`}
                        >
                          {item.isArchived
                            ? `Unarchiving this Tags & Attributes will make it visible in active views and restore all related access.`
                            : item.itemType === "Curriculum"
                            ? "Archiving this Instructional Material will remove it from active views. It will no longer be accessible to add to a classroom or school. Please confirm before proceeding."
                            : `Archiving this Tags & Attributes will remove it from active views. It will become accessible for adding to classrooms or schools. Please confirm before proceeding.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-end gap-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-600 mr-auto  rounded-[6px] font-medium "
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onArchive}
                    className={`px-6 py-1 text-[16px] font-medium rounded-[6px] ${buttonClass}`}
                  >
                    {item.isArchived ? "Unarchive" : "Archive"}
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
