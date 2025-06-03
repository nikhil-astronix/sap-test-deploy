import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { InterventionType } from "@/types/interventionData";

interface EditInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  intervention: {
    id: string;
    type: InterventionType;
    name: string;
    description: string;
    isArchived: boolean;
    district_id: string;
    createdAt: Date;
    title?: string;
  };
  onSave: (intervention: {
    id: string;
    type: InterventionType;
    name: string;
    description: string;
    isArchived: boolean;
    createdAt: Date;
    district_id: string;
  }) => void;
}

export default function EditInterventionModal({
  isOpen,
  onClose,
  intervention,
  onSave,
}: EditInterventionModalProps) {
  const [type, setType] = useState<InterventionType>(intervention.type);
  const [name, setName] = useState(
    intervention.name || intervention.title || ""
  );
  const [description, setDescription] = useState(intervention.description);
  const [isArchived, setIsArchived] = useState(intervention.isArchived);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      name,
      id: intervention.id,
      description,
      isArchived,
      createdAt: intervention.createdAt,
      district_id: intervention.district_id,
    });
    onClose();
  };

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
              className="relative bg-white rounded-xl w-full max-w-lg p-6 shadow-xl max-h-sm"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-800 hover:text-gray-900 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 mb-2" />
              </motion.button>

              {/* Add type indicator badge */}
              <div className="my-3 ">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium ${
                        type === "Custom"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-[#F2FAF6] text-[#2A7251]"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          type === "Custom" ? "bg-purple-800" : "bg-emerald-800"
                        }`}
                      />
                      {type}
                    </span>
                  </div>
                  <p className="text-[#B5B5B5] text-sm">Editing</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-md text-gray-black bg-[#F4F6F8] px-4 py-3 rounded-[6px] border-0 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#F4F6F8] text-gray-600 text-sm px-4 py-3 rounded-[6px] border-0 focus:ring-2 focus:ring-emerald-500 resize-none transition-all duration-200"
                    placeholder="Enter description"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-[6px]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#2A7251] text-white rounded-[6px] hover:bg-emerald-800 transition-colors font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
