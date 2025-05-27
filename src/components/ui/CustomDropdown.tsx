"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
	id?: string;
	value?: string;
	label: string;
}

interface CustomDropdownProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	error?: string;
}

export default function CustomDropdown({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	className = "",
	error,
}: CustomDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Find the selected option based on value
	const selectedOption = React.useMemo(() => {
		// Log the value and options to help debug
		console.log("CustomDropdown value:", value);
		console.log("CustomDropdown options:", options);

		return options?.find(
			(option) =>
				// Check for both id and value properties, as your data might use either
				option.id === value ||
				option.value === value ||
				// If the option is a string value
				(typeof option === "string" && option === value)
		);
	}, [options, value]);

	// Determine what text to display in the dropdown
	const displayText = React.useMemo(() => {
		if (selectedOption) {
			return selectedOption.label;
		} else if (value) {
			return value; // Use value as placeholder if it exists but no matching option found
		}
		return placeholder;
	}, [selectedOption, value, placeholder]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleOptionClick = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full px-3 py-2 text-left rounded-lg border ${
					error ? "border-red-500" : "border-gray-200"
				} focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white`}
				aria-expanded={isOpen}
				aria-haspopup='listbox'
			>
				<div className='flex items-center justify-between'>
					<span
						className={
							selectedOption || value ? "text-gray-700" : "text-gray-400"
						}
					>
						{displayText}
					</span>
					<svg
						className={`w-5 h-5 text-gray-400 transition-transform ${
							isOpen ? "transform rotate-180" : ""
						}`}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className='absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto'
						role='listbox'
					>
						{options?.length > 0 ? (
							options.map((option, index) => {
								const optionValue = option.id || option.value || option;
								const isSelected =
									optionValue === value ||
									(selectedOption &&
										(optionValue === selectedOption.id ||
											optionValue === selectedOption.value));
								console.log(
									"Rendering option:",
									optionValue,
									"isSelected:",
									isSelected
								);

								return (
									<div
										key={index}
										onClick={() => handleOptionClick(optionValue)}
										className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
											value === option.label
												? "bg-[#F2FAF6] text-[#2A7251]"
												: ""
										}`}
										role='option'
										aria-selected={isSelected}
									>
										{option.label}
									</div>
								);
							})
						) : (
							<div className='px-4 py-2 text-gray-500'>
								No options available
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
		</div>
	);
}
