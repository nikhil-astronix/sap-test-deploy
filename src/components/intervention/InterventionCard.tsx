import { useState } from "react";
import { motion } from "framer-motion";
import ViewDescriptionModal from "./ViewDescriptionModal";

interface InterventionCardProps {
	type: "Custom" | "Default";
	title: string;
	description: string;
	isArchived: boolean;
	viewMode: "active" | "archived"; // New prop to determine view mode
	onEdit: () => void;
	onArchive: () => void;
}

export default function InterventionCard({
	type,
	title,
	description,
	isArchived,
	viewMode, // New prop
	onEdit,
	onArchive,
}: InterventionCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Determine button text based on viewMode instead of isArchived
	const buttonText = viewMode === "archived" ? "Restore" : "Archive";
	const buttonClasses = `text-sm transition-colors px-4 py-1.5 rounded-full ${
		viewMode === "archived"
			? "text-[#2264AC] bg-[#E9F3FF] hover:bg-blue-100"
			: "text-red-600 bg-red-100 hover:bg-red-200"
	}`;

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className='bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-md transition-shadow h-[250px] flex flex-col'
			>
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className='flex items-center gap-2 mb-2'
				>
					<div className='flex items-center gap-2 '>
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
				</motion.div>

				<motion.h3
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className='text-md font-semibold mb-2'
				>
					{title}
				</motion.h3>

				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.3 }}
					className='flex gap-4 mb-2'
				>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onEdit}
						className='text-white text-sm transition-colors px-4 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800'
					>
						Edit
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onArchive}
						className={buttonClasses}
					>
						{buttonText}
					</motion.button>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.3 }}
					className='relative flex-1'
				>
					<p className='text-gray-600 text-sm line-clamp-3'>{description}</p>
					{description.length > 150 && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							onClick={() => setIsModalOpen(true)}
							className='text-emerald-700 text-sm hover:underline mt-1 absolute bottom-0 left-0'
						>
							View more
						</motion.button>
					)}
				</motion.div>
			</motion.div>

			<ViewDescriptionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={title}
				description={description}
				type={type}
				isArchived={isArchived}
				viewMode={viewMode} // Pass viewMode to the modal
				onEdit={onEdit}
				onArchive={onArchive}
			/>
		</>
	);
}
