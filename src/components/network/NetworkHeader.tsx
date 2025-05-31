import React from "react";
import { motion } from "framer-motion";
import { Plus, MagnifyingGlass, ClockClockwise } from "@phosphor-icons/react";
import { Archive, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface NetworkHeaderProps {
  title: string;
  description: string;
  search: string;
  setSearch: (value: string) => void;
  active: boolean;
  setActive: (value: React.SetStateAction<boolean>) => void;
  hasSelectedItems: () => boolean;
  setShowArchiveModal: (show: boolean) => void;
  setShowRestoreModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  addButtonLink?: string;
  addButtonText?: string;
  // New props for editing mode
  isEditing?: boolean;
  onSave?: () => void;
  onClose?: () => void;
  saveButtonText?: string;
  closeButtonText?: string;
  // For active/archived labels
  activeLabel?: string;
  archivedLabel?: string;
  isActiveArchived?: boolean; // If true, "active" means "archived" (reversed logic)
}

const NetworkHeader: React.FC<NetworkHeaderProps> = ({
  title,
  description,
  search,
  setSearch,
  active,
  setActive,
  hasSelectedItems,
  setShowArchiveModal,
  setShowRestoreModal,
  setShowDeleteModal,
  addButtonLink = "/network/new",
  addButtonText = "Add",
  // New props with defaults
  isEditing = false,
  onSave,
  onClose,
  saveButtonText = "Save Changes",
  closeButtonText = "Close",
  activeLabel = "Active",
  archivedLabel = "Archived",
  isActiveArchived = false,
}) => {
  const router = useRouter();

  return (
    <>
      <h1 className="text-2xl text-center font-medium mb-2">{title}</h1>
      <p className="text-center text-gray-600 mb-6">{description}</p>

      {isEditing ? (
        // Editing mode - show Save/Close buttons
        <div className="flex items-center gap-4 mb-4">
          <button
            className="text-gray-700 text-sm font-medium"
            onClick={onClose}
          >
            {closeButtonText}
          </button>
          <button
            className="bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors"
            onClick={onSave}
          >
            {saveButtonText}
          </button>
        </div>
      ) : (
        // Normal mode - show search and action buttons
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-[35%]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Determine which button to show based on active state and isActiveArchived flag */}
              {(isActiveArchived ? active : !active) ? (
                <button
                  className={`p-2 ${
                    hasSelectedItems()
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!hasSelectedItems()}
                  onClick={() =>
                    hasSelectedItems() && setShowArchiveModal(true)
                  }
                  title={
                    hasSelectedItems()
                      ? "Archive selected"
                      : "Select items to archive"
                  }
                >
                  <Archive size={20} className="text-black" />
                </button>
              ) : (
                <button
                  className={`p-2 ${
                    hasSelectedItems()
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!hasSelectedItems()}
                  onClick={() =>
                    hasSelectedItems() && setShowRestoreModal(true)
                  }
                  title={
                    hasSelectedItems()
                      ? "Restore selected"
                      : "Select items to restore"
                  }
                >
                  <ClockClockwise size={20} className="text-black" />
                </button>
              )}

              {/* Rest of the button section remains the same */}
              <button
                className={`p-2 ${
                  hasSelectedItems()
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!hasSelectedItems()}
                onClick={() => hasSelectedItems() && setShowDeleteModal(true)}
                title={
                  hasSelectedItems()
                    ? "Delete selected"
                    : "Select items to delete"
                }
              >
                <Trash2 size={20} className="text-black" />
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(addButtonLink)}
                className="flex gap-2 items-center bg-[#2A7251] text-white px-6 py-2 rounded-[6px] hover:bg-[#2A7251] transition-colors"
              >
                <Plus size={16} />
                {addButtonText}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 mt-4">
            <div className="flex items-center space-x-2">
              <span
                className={`text-12px ${
                  active ? "text-[#494B56]" : "text-[#000] font-medium"
                }`}
              >
                {activeLabel}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActive((a) => !a)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-[#2A7251]"
              >
                <motion.span
                  layout
                  initial={false}
                  animate={{
                    x: active ? 24 : 4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="inline-block h-4 w-4 rounded-full bg-white"
                />
              </motion.button>
              <span
                className={`text-12px ${
                  active ? "text-[#000] font-medium" : "text-[#494B56]"
                }`}
              >
                {archivedLabel}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NetworkHeader;
