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
	const [name, setName] = useState(intervention.name);
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
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen px-4'>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.3 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className='fixed inset-0 bg-black'
							onClick={onClose}
						/>

						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className='relative bg-white rounded-lg w-full max-w-lg p-6 shadow-xl max-h-sm'
						>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={onClose}
								className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors'
							>
								<XMarkIcon className='w-6 h-6' />
							</motion.button>

							<div className='space-y-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Type
									</label>
									<div className='flex gap-1'>
										{(
											[
												InterventionType.Default,
												InterventionType.Custom,
											] as const
										).map((typeOption) => (
											<button
												key={typeOption}
												onClick={() => setType(typeOption)}
												className={`px-4 py-2 rounded-lg text-sm ${
													type === typeOption
														? "bg-emerald-700 text-white"
														: "bg-gray-100 text-gray-600 hover:bg-gray-200"
												}`}
											>
												{typeOption}
											</button>
										))}
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Title
									</label>
									<input
										type='text'
										value={name}
										onChange={(e) => setName(e.target.value)}
										className='w-full text-md text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 transition-all duration-200'
										placeholder='Enter name'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Description
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										rows={6}
										className='w-full bg-gray-50 text-gray-600 text-sm px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500 resize-none transition-all duration-200'
										placeholder='Enter description'
									/>
								</div>

								<div>
									<label className='flex items-center space-x-2 cursor-pointer'>
										<div className='relative'>
											<input
												type='checkbox'
												checked={isArchived}
												onChange={(e) => setIsArchived(e.target.checked)}
												className='sr-only peer'
											/>
											<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
										</div>
										<span className='text-sm font-medium text-gray-700'>
											Archived
										</span>
									</label>
								</div>
							</div>

							<div className='flex justify-end gap-3 mt-8'>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onClose}
									className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium bg-gray-50 rounded-[6px]'
								>
									Reset
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleSubmit}
									className='px-6 py-2 bg-emerald-700 text-white rounded-[6px] hover:bg-emerald-800 transition-colors font-medium'
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
