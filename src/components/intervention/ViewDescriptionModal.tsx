import { motion, AnimatePresence } from "framer-motion";

interface ViewDescriptionModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	type: "Custom" | "Default";
	isArchived: boolean;
	viewMode: string; // Add the viewMode prop
	onEdit: () => void;
	onArchive: () => void;
}

export default function ViewDescriptionModal({
	isOpen,
	onClose,
	title,
	description,
	type,
	isArchived,
	viewMode, // Add the viewMode prop
	onEdit,
	onArchive,
}: ViewDescriptionModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className='fixed inset-0 bg-black'
						onClick={onClose}
					/>

					<div className='flex items-center justify-center min-h-screen px-4'>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative'
						>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className='absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors'
							>
								<svg
									className='w-6 h-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</motion.button>

							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
								className='mb-4'
							>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										type === "Custom"
											? "bg-purple-100 text-purple-800"
											: "bg-emerald-100 text-emerald-800"
									}`}
								>
									<div
										className={`w-2 h-2 rounded-full mr-1 ${
											type === "Custom" ? "bg-purple-800" : "bg-emerald-800"
										}`}
									/>
									{type}
								</span>
							</motion.div>

							<motion.h2
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className='text-xl font-semibold mb-4'
							>
								{title}
							</motion.h2>

							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.3 }}
								className='flex gap-4 mb-4'
							>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										onEdit();
										onClose();
									}}
									className='text-white text-sm transition-colors px-4 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800'
								>
									Edit
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										onArchive();
										onClose();
									}}
									className={`text-sm transition-colors px-4 py-1 rounded-full ${
										isArchived
											? "text-emerald-600 bg-emerald-100 hover:bg-emerald-200"
											: "text-red-600 bg-red-100 hover:bg-red-200"
									}`}
								>
									{isArchived ? "Unarchive" : "Archive"}
								</motion.button>
							</motion.div>

							<motion.p
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.3 }}
								className='text-gray-600 text-sm'
							>
								{description}
							</motion.p>
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
}
