import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ViewDescriptionModal from '../intervention/ViewDescriptionModal';
import EditInterventionModal from '../intervention/EditInterventionModal';
import ArchiveModal from '../intervention/ArchiveInterventionModal';

interface CurriculumCardProps {
  title: string;
  description: string;
  type: 'Default' | 'Custom';
  isArchived: boolean;
  onEdit: () => void;
  onArchive: () => void;
}

const CurriculumCard: React.FC<CurriculumCardProps> = ({
  title,
  description,
  type,
  isArchived,
  onEdit,
  onArchive,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleArchive = () => {
    setIsArchiveModalOpen(true);
  };

  const handleSaveEdit = (editedIntervention: {
    type: 'Custom' | 'Default';
    title: string;
    description: string;
    isArchived: boolean;
    createdAt: Date;
  }) => {
    onEdit();
    setIsEditModalOpen(false);
  };

  const handleConfirmArchive = () => {
    onArchive();
    setIsArchiveModalOpen(false);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-[250px] flex flex-col"
      >
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-2"
        >
          <motion.span 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={`inline-block flex flex-row items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${
              type === 'Custom' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className={`w-2 h-2 rounded-full mr-1 ${
                type === 'Custom' ? 'bg-purple-800' : 'bg-emerald-800'
              }`}
            />
            {type}
          </motion.span>
        </motion.div>
        
        <motion.h3 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </motion.h3>
        
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex gap-2 mb-2 pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEdit}
            className="px-4 py-1 text-sm font-medium text-white bg-emerald-700 rounded-full hover:bg-emerald-800"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleArchive}
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              isArchived 
                ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200'
                : 'text-red-600 bg-red-100 hover:bg-red-200'
            }`}
          >
            {isArchived ? 'Unarchive' : 'Archive'}
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex-grow overflow-hidden"
        >
          <div className="relative h-full">
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-gray-600 text-sm line-clamp-3"
            >
              {description}
            </motion.p>
            {description.length > 150 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent pt-4 pb-1"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsViewModalOpen(true)}
                  className="text-emerald-700 text-sm font-medium hover:text-emerald-800"
                >
                  View More
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ViewDescriptionModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={title}
        description={description}
        type={type}
        isArchived={isArchived}
        onEdit={handleEdit}
        onArchive={handleArchive}
      />

      <EditInterventionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        intervention={{
          id: '0', // Temporary ID since we don't have one in props
          type,
          title,
          description,
          isArchived: false,
          createdAt: new Date(),
        }}
        onSave={handleSaveEdit}
      />

      <ArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        item={{ type, title, itemType: 'Curriculum', isArchived }}
        onArchive={handleConfirmArchive}
      />
    </>
  );
};

export default CurriculumCard; 