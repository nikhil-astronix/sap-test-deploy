"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createCurriculum } from "@/services/curriculumsService";
import { createCurriculumPayload } from "@/models/curriculum";

const NewCurriculumPage = () => {
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [type, setType] = React.useState<"Default" | "Custom">("Custom");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const curriculumPayload: createCurriculumPayload = {
			title,
			description,
			type,
		};
		try {
			const response = await createCurriculum(curriculumPayload);
			if (response.success) {
				console.log("Curriculum created!", response.data);
				window.history.back();
			} else {
				console.error("Failed to create curriculum:", response.error);
			}
		} catch (error) {
			console.error("Unexpected error:", error);
		}
	};

	return (
		<AnimatePresence mode='wait'>
			<motion.div
				key='new-curriculum-form'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.4 }}
				className='min-h-full pb-11 p-8 bg-white rounded-lg shadow-md'
			>
				<motion.div
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className='max-w-3xl mx-auto'
				>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl font-semibold mb-2'>Curriculums</h1>
						<p className='text-md text-gray-600'>
							View, edit, and organize all available curriculums in one place.
						</p>
					</div>

					<div className='px-40 py-0'>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.3 }}
							>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Title
								</label>
								<motion.input
									whileFocus={{ scale: 1.01 }}
									transition={{ duration: 0.2 }}
									required
									type='text'
									placeholder='Title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full text-sm px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500'
								/>
							</motion.div>

							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.3 }}
							>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Description
								</label>
								<motion.textarea
									whileFocus={{ scale: 1.01 }}
									transition={{ duration: 0.2 }}
									required
									placeholder='Add your description here'
									rows={4}
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className='w-full text-sm px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[90px]'
								/>
							</motion.div>

							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.3 }}
							>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Type
								</label>
								<div className='flex gap-4 text-sm flex-col'>
									{(["Default", "Custom"] as const).map((option, index) => (
										<motion.label
											key={option}
											className='flex items-center gap-2 cursor-pointer'
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className='relative flex items-center justify-center w-5 h-5'>
												<input
													type='radio'
													value={option}
													checked={type === option}
													onChange={(e) =>
														setType(e.target.value as "Default" | "Custom")
													}
													className='sr-only'
												/>
												<motion.div
													className={`w-4 h-4 rounded-full border-2 ${
														type === option
															? "border-emerald-700"
															: "border-gray-300"
													}`}
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													{type === option && (
														<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full' />
													)}
												</motion.div>
											</div>
											<span className='text-gray-700'>{option}</span>
										</motion.label>
									))}
								</div>
							</motion.div>

							<motion.div
								className='flex gap-4 justify-end pt-4 text-sm'
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.8, duration: 0.3 }}
							>
								<motion.button
									type='button'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => window.history.back()}
									className='px-4 py-2 rounded-[6px] bg-gray-100 hover:bg-gray-50 transition-colors mr-auto'
								>
									Cancel
								</motion.button>
								<motion.button
									type='submit'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='bg-emerald-700 text-white px-4 py-2 rounded-[6px] hover:bg-emerald-800 transition-colors'
								>
									Save
								</motion.button>
							</motion.div>
						</form>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default NewCurriculumPage;
