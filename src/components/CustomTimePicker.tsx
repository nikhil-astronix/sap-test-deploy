import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { IoTimeOutline } from "react-icons/io5";

interface CustomTimePickerProps {
	value: string | null;
	onChange: (time: string | null) => void;
	label: string;
	error?: string;
	disabled?: boolean;
	className?: string;
	isEndTime?: boolean;
	startTime?: string | null;
}

interface ScrollableColumnProps<T> {
	items: T[];
	selectedItem: T;
	setSelectedItem: (value: T) => void;
	highlight?: boolean;
	"aria-label"?: string;
}

const parseTimeString = (
	value: string | null
): { hour: number; minute: number; period: string } => {
	if (!value) {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const period = hours >= 12 ? "PM" : "AM";
		const hour12 = hours % 12 || 12;
		return { hour: hour12, minute: minutes, period };
	}
	const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
	if (!match) {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const period = hours >= 12 ? "PM" : "AM";
		const hour12 = hours % 12 || 12;
		return { hour: hour12, minute: minutes, period };
	}
	let hour = parseInt(match[1]);
	const minute = parseInt(match[2]);
	const period = match[3].toUpperCase();

	if (period === "PM" && hour !== 12) hour = hour + 12;
	if (period === "AM" && hour === 12) hour = 0;

	return {
		hour: hour > 12 ? hour - 12 : hour || 12,
		minute: minute || 0,
		period: period,
	};
};

const convertTo24Hour = (
	hour: number,
	minute: number,
	period: string
): number => {
	let hour24 = hour;
	if (period === "PM" && hour !== 12) hour24 = hour + 12;
	if (period === "AM" && hour === 12) hour24 = 0;
	return hour24 * 60 + minute;
};

export default function CustomTimePicker({
	value,
	onChange,
	label,
	error,
	disabled = false,
	className = "",
	isEndTime = false,
	startTime = null,
}: CustomTimePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);
	const { hour, minute, period } = parseTimeString(value);

	const [selectedHour, setSelectedHour] = useState<number>(hour);
	const [selectedMinute, setSelectedMinute] = useState<number>(minute);
	const [selectedPeriod, setSelectedPeriod] = useState<string>(period);
	const [internalValue, setInternalValue] = useState<string | null>(value);

	useEffect(() => {
		if (value !== internalValue) {
			const { hour, minute, period } = parseTimeString(value);
			setSelectedHour(hour);
			setSelectedMinute(minute);
			setSelectedPeriod(period);
			setInternalValue(value);
		}
	}, [value]);

	const validateTime = (
		hour: number,
		minute: number,
		period: string
	): boolean => {
		if (!isEndTime || !startTime) return true;

		const startTimeParts = parseTimeString(startTime);
		const startMinutes = convertTo24Hour(
			startTimeParts.hour,
			startTimeParts.minute,
			startTimeParts.period
		);
		const endMinutes = convertTo24Hour(hour, minute, period);

		return endMinutes > startMinutes;
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleOk = () => {
		if (!validateTime(selectedHour, selectedMinute, selectedPeriod)) {
			onChange(null); // Clear the invalid time
			setIsOpen(false);
			return;
		}

		let hour = selectedHour;
		if (selectedPeriod === "PM" && hour !== 12) hour = hour + 12;
		if (selectedPeriod === "AM" && hour === 12) hour = 0;
		const timeString = `${selectedHour
			.toString()
			.padStart(2, "0")}:${selectedMinute
			.toString()
			.padStart(2, "0")} ${selectedPeriod}`;
		onChange(timeString);
		setIsOpen(false);
	};

	const handleClear = () => {
		onChange(null);
		setIsOpen(false);
	};

	const handleCancel = () => {
		const { hour, minute, period } = parseTimeString(value);
		setSelectedHour(hour);
		setSelectedMinute(minute);
		setSelectedPeriod(period);
		setIsOpen(false);
	};

	const ScrollableColumn = <T extends string | number>({
		items,
		selectedItem,
		setSelectedItem,
		highlight = false,
		"aria-label": ariaLabel,
	}: ScrollableColumnProps<T>) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [isDragging, setIsDragging] = useState(false);
		const [startY, setStartY] = useState(0);

		useEffect(() => {
			if (containerRef.current) {
				const index = items.indexOf(selectedItem);
				const scrollTop = index * 32; // 32px is the height of each item
				containerRef.current.scrollTop = scrollTop;
			}
		}, [selectedItem, items]);

		const handleWheel = (e: React.WheelEvent) => {
			const direction = e.deltaY > 0 ? 1 : -1;
			const currentIndex = items.indexOf(selectedItem);
			const newIndex = Math.min(
				Math.max(0, currentIndex + direction),
				items.length - 1
			);
			setSelectedItem(items[newIndex]);
		};

		const handleScroll = () => {
			if (containerRef.current) {
				const scrollTop = containerRef.current.scrollTop;
				const index = Math.round(scrollTop / 32); // 32px is the height of each item
				const newItem = items[Math.min(Math.max(0, index), items.length - 1)];
				if (newItem !== selectedItem) {
					setSelectedItem(newItem);
				}
			}
		};

		const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
			setIsDragging(true);
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			setStartY(clientY);
		};

		const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
			if (!isDragging) return;

			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const diff = startY - clientY;

			if (Math.abs(diff) > 20) {
				const direction = diff > 0 ? 1 : -1;
				const currentIndex = items.indexOf(selectedItem);
				const newIndex = Math.min(
					Math.max(0, currentIndex + direction),
					items.length - 1
				);
				setSelectedItem(items[newIndex]);
				setStartY(clientY);
			}
		};

		const handleDragEnd = () => {
			setIsDragging(false);
		};

		return (
			<div
				className='relative  px-auto flex-1 select-none'
				role='listbox'
				aria-label={ariaLabel}
				onWheel={handleWheel}
				style={{
					height: "175px",
				}}
			>
				<div
					ref={containerRef}
					className='h-full overflow-auto scrollbar-hide'
					onScroll={handleScroll}
					style={{
						WebkitOverflowScrolling: "touch",
						scrollbarWidth: "none",
						msOverflowStyle: "none",
						maskImage:
							"linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
						WebkitMaskImage:
							"linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
					}}
				>
					<div className='h-[70px] ' aria-hidden='true' />{" "}
					{/* Padding to center first item */}
					<div className='min-w-[45px]'>
						{items.map((item) => (
							<div
								key={item}
								role='option'
								aria-selected={item === selectedItem}
								onClick={() => setSelectedItem(item)}
								className={`h-8 flex  items-center justify-center cursor-pointer text-base select-none transition-colors duration-150
							${
								item === selectedItem
									? "text-emerald-600 text-lg font-medium"
									: "text-gray-500 hover:text-gray-700"
							}`}
							>
								{typeof item === "number"
									? item.toString().padStart(2, "0")
									: item}
							</div>
						))}
						<div className='h-[88px] ' aria-hidden='true' />{" "}
					</div>
					{/* Padding to center last item */}
				</div>
			</div>
		);
	};

	const hours = Array.from({ length: 12 }, (_, i) => i + 1);
	const minutes = Array.from({ length: 60 }, (_, i) => i);
	const periods = ["AM", "PM"];

	const handleHourChange = (value: number) => setSelectedHour(value);
	const handleMinuteChange = (value: number) => setSelectedMinute(value);
	const handlePeriodChange = (value: string) => setSelectedPeriod(value);

	return (
		<div className={`relative w-full ${className}`} ref={pickerRef}>
			<style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
			<div className='relative'>
				{label && (
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						{label}
					</label>
				)}
				<input
					type='text'
					value={value || ""}
					readOnly
					disabled={disabled}
					className={`w-full px-4 py-2 bg-gray-50 rounded-md cursor-pointer 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${error ? "border-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-2  focus:border-transparent`}
					onClick={() => !disabled && setIsOpen(true)}
					placeholder='Select time'
					aria-label={label}
					aria-invalid={!!error}
					aria-describedby={error ? `${label}-error` : undefined}
				/>
				<button
					onClick={() => !disabled && setIsOpen(true)}
					disabled={disabled}
					className={`absolute right-3 top-1/2 transform -translate-y-1/2 
            ${disabled ? "text-gray-300" : "text-gray-400 hover:text-gray-600"} 
            focus:outline-none`}
					aria-label='Open time picker'
				>
					<IoTimeOutline size={20} />
				</button>
			</div>

			{isOpen && (
				<div className='absolute z-20 mt-1 right-0 w-full '>
					<div
						className='bg-white rounded-xl shadow-lg p-5  flex-col items-center'
						role='dialog'
						aria-label='Time picker'
					>
						{label && (
							<div className='text-sm font-medium text-gray-700 mb-3'>
								{label}
							</div>
						)}
						<div className='flex justify-between space-x-2  max-w-[170px] mx-auto'>
							<ScrollableColumn<number>
								items={hours}
								selectedItem={selectedHour}
								setSelectedItem={handleHourChange}
								aria-label='Hours'
							/>
							<ScrollableColumn<number>
								items={minutes}
								selectedItem={selectedMinute}
								setSelectedItem={handleMinuteChange}
								aria-label='Minutes'
							/>
							<ScrollableColumn<string>
								items={periods}
								selectedItem={selectedPeriod}
								setSelectedItem={handlePeriodChange}
								highlight={true}
								aria-label='AM/PM'
							/>
						</div>
						<div className='flex justify-between mt-4 space-x-2'>
							<button
								onClick={handleClear}
								className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded'
							>
								Clear
							</button>
							<div className='flex space-x-2'>
								<button
									onClick={handleCancel}
									className='px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded'
								>
									Cancel
								</button>
								<button
									onClick={handleOk}
									className='px-3 py-1 text-sm text-emerald-600 font-medium hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded'
								>
									OK
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
