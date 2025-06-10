import React, { useEffect, useState } from "react";
import MultiSelect from "@/components/ui/MultiSelect";
import Dropdown from "@/components/ui/Dropdown";

interface Classroom {
	id: string;
	name: string;
}

interface School {
	id: string;
	name: string;
}

interface SchoolClassroomStepProps {
	schools: School[];
	classrooms: Classroom[];
	selectedSchool: string;
	selectedClassrooms: string[];
	observationTools: Array<{ id: string; name: string }>; // Add this
	selectedObservationTool: string; // Add this
	onObservationToolChange: (toolId: string) => void; // Add this
	onSchoolChange: (schoolId: string) => void;
	onClassroomChange: (classroomIds: string[]) => void;
	onNext: () => void;
	onBack: () => void;
	onCancel: () => void;
}

const SchoolClassroomStep = ({
	schools,
	classrooms,
	selectedSchool,
	selectedClassrooms,
	observationTools, // Add this
	selectedObservationTool, // Add this
	onObservationToolChange, // Add this
	onSchoolChange,
	onClassroomChange,
	onNext,
	onBack,
	onCancel,
}: SchoolClassroomStepProps) => {
	// Format schools data for Dropdown component
	const schoolOptions = schools.map((school) => ({
		value: school.id,
		label: school.name,
	}));

	return (
		<div className='max-w-2xl mx-auto'>
			<div className='space-y-6'>
				<div>
					<label className='block text-[16px] text-balck-400 mb-2'>
						School
					</label>
					<Dropdown
						options={schoolOptions}
						value={selectedSchool}
						onChange={(value) => {
							onSchoolChange(value);
						}}
						placeholder='Select a school'
						className='bg-[#F4F6F8]'
					/>
				</div>

				<div>
					<label className='block text-[16px] text-balck-400 mb-2'>
						Classroom(s)
					</label>
					<div className='space-y-2'>
						{selectedClassrooms.map((id) => {
							const classroom = classrooms.find((c) => c.id === id);
							if (!classroom) return null;
							return (
								<div
									key={id}
									className='inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 border border-emerald-700 rounded-full mr-2'
								>
									<span>{classroom.name}</span>
									<button
										onClick={() =>
											onClassroomChange(
												selectedClassrooms.filter((cid) => cid !== id)
											)
										}
										className='ml-2'
									>
										<svg
											className='w-4 h-4'
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
									</button>
								</div>
							);
						})}
					</div>
					<MultiSelect
						options={classrooms.map((classroom) => ({
							label: classroom.name,
							value: classroom.id,
						}))}
						values={selectedClassrooms}
						onChange={onClassroomChange}
						placeholder='Select classrooms'
						className='mt-2 bg-gray-50'
						showSelectedTags={false}
						showSlectedOptions={false}
					/>
				</div>

				<div>
					<label className='block text-[16px] text-balck-400 mb-2'>
						Observation Tool
					</label>
					<Dropdown
						options={observationTools.map((tool) => ({
							value: tool.id,
							label: tool.name,
						}))}
						value={selectedObservationTool}
						onChange={onObservationToolChange}
						placeholder='Select an observation tool'
						className='bg-[#F4F6F8]'
					/>
				</div>

				<div className='flex justify-between space-x-4 pt-6 w-full'>
					<button
						onClick={onBack}
						className='px-4 py-2 text-gray-700 hover:text-gray-900'
					>
						Back
					</button>

					<div className='flex space-x-4 justify-between full'>
						<button
							onClick={onCancel}
							className='px-4 py-2 text-gray-700 hover:text-gray-900 bg-[#F4F6F8] rounded-md '
						>
							Cancel
						</button>
						<button
							onClick={onNext}
							className='px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors'
							// disabled={selectedUsers.length > 0 && !sessionAdmin}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SchoolClassroomStep;
