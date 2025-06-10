import React from "react";
import { motion } from "framer-motion";
import {
	Plus,
	MagnifyingGlass,
	ClockClockwise,
	Archive,
	Trash,
} from "@phosphor-icons/react";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../Header";

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

	// Add new prop for active tab
	activeTab?: "Today" | "Upcoming" | "Past";
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
	activeTab, // Add this new prop
}) => {
	const router = useRouter();

	// Determine if archive/restore actions should be disabled (when on Today's tab)
	const disableArchiveActions = activeTab === "Today";

	return (
		<>
			<Header title={title} description={description} />

			{isEditing ? (
				// Editing mode - show Save/Close buttons
				<div className='flex items-center gap-4 mb-4'>
					<button
						className='text-gray-700 text-sm font-medium'
						onClick={onClose}
					>
						{closeButtonText}
					</button>
					<button
						className='bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors'
						onClick={onSave}
					>
						{saveButtonText}
					</button>
				</div>
			) : (
				// Normal mode - show search and action buttons
				<>
					<div className='flex items-center justify-between mb-2'>
						<div className='relative w-[35%]'>
							<MagnifyingGlass
								size={16}
								className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
							/>
							<input
								className='w-full border rounded-lg pl-10 pr-3 py-2 text-sm'
								placeholder='Search'
								value={search}
								onChange={(e) => {
									const value = e.target.value;
									setSearch(value);
								}}
							/>
						</div>

						<div className='flex items-center gap-1'>
							{/* Archive/Restore button - disable if on Today's tab */}
							{(isActiveArchived ? active : !active) ? (
								<button
									className={`py-2 ${
										hasSelectedItems() && !disableArchiveActions
											? "text-gray-500 hover:text-gray-700"
											: "text-gray-300 cursor-not-allowed"
									}`}
									disabled={!hasSelectedItems() || disableArchiveActions}
									onClick={() =>
										hasSelectedItems() &&
										!disableArchiveActions &&
										setShowArchiveModal(true)
									}
									title={
										disableArchiveActions
											? "Archiving not available for Today's Sessions"
											: hasSelectedItems()
											? "Archive selected"
											: "Select items to archive"
									}
								>
									<Archive
										size={24}
										className={
											disableArchiveActions ? "text-gray-300" : "text-black"
										}
									/>
								</button>
							) : (
								<button
									className={`py-2 ${
										hasSelectedItems() && !disableArchiveActions
											? "text-gray-500 hover:text-gray-700"
											: "text-gray-300 cursor-not-allowed"
									}`}
									disabled={!hasSelectedItems() || disableArchiveActions}
									onClick={() =>
										hasSelectedItems() &&
										!disableArchiveActions &&
										setShowRestoreModal(true)
									}
									title={
										disableArchiveActions
											? "Restoring not available for Today's Sessions"
											: hasSelectedItems()
											? "Restore selected"
											: "Select items to restore"
									}
								>
									<ClockClockwise
										size={24}
										className={
											disableArchiveActions ? "text-gray-300" : "text-black"
										}
									/>
								</button>
							)}

							{/* Delete button - disable if on Today's tab */}
							<button
								className={`p-2 ${
									hasSelectedItems() && !disableArchiveActions
										? "text-gray-500 hover:text-gray-700"
										: "text-gray-300 cursor-not-allowed"
								}`}
								disabled={!hasSelectedItems() || disableArchiveActions}
								onClick={() =>
									hasSelectedItems() &&
									!disableArchiveActions &&
									setShowDeleteModal(true)
								}
								title={
									disableArchiveActions
										? "Deletion not available for Today's Sessions"
										: hasSelectedItems()
										? "Delete selected"
										: "Select items to delete"
								}
							>
								<Trash
									size={24}
									className={
										disableArchiveActions ? "text-gray-300" : "text-black"
									}
								/>
							</button>

							{/* Add button */}
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => router.push(addButtonLink)}
								className='flex gap-2 items-center bg-[#2A7251] text-white px-6 py-2 rounded-[6px] hover:bg-[#2A7251] transition-colors'
							>
								<Plus size={16} />
								{addButtonText}
							</motion.button>
						</div>
					</div>

					{/* Switch button is completely removed - no conditional rendering */}
				</>
			)}
		</>
	);
};

export default NetworkHeader;
