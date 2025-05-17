"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Stepper from "./Stepper";
import Dropdown from "../ui/Dropdown";
import MultiSelect from "../ui/MultiSelect";
import { Student } from "@phosphor-icons/react";

const steps = [
	{ label: "Basic Classroom Info", id: "basic-info" },
	{ label: "Select Tags & Attributes", id: "interventions" },
	{ label: "Select Instructional Materials", id: "curriculum" },
	{ label: "Review & Submit", id: "review" },
];

const sampleSchools = [
	{ label: "Sample School A", value: "school-a" },
	{ label: "Sample School B", value: "school-b" },
	{ label: "Sample School C", value: "school-c" },
	{ label: "Sample School D", value: "school-d" },
];

const gradeOptions = [
	{ label: "Kindergarten", value: "K" },
	{ label: "1st Grade", value: "1" },
	{ label: "2nd Grade", value: "2" },
	{ label: "3rd Grade", value: "3" },
	{ label: "4th Grade", value: "4" },
	{ label: "5th Grade", value: "5" },
];

export default function CreateClassroomForm() {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		school: "",
		course: "",
		teacher: "",
		grades: [] as string[],
		classPeriod: "",
		tags: [] as string[], // Add tags array to track selected interventions
		instructionalMaterials: [] as string[], // Add instructionalMaterials array
	});

	const getStepStatus = (index: number) => {
		if (index < currentStep) return "completed";
		if (index === currentStep) return "current";
		return "upcoming";
	};

	const stepperSteps = steps.map((step, index) => ({
		label: step.label,
		number: index + 1, // Add the step number (starting from 1)
		status: getStepStatus(index) as "completed" | "current" | "upcoming",
	}));

	const handleFormChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div>
			<Stepper steps={stepperSteps} />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className='mt-12'
			>
				{currentStep === 0 && (
					<BasicInfo
						formData={formData}
						onChange={handleFormChange}
						onNext={() => setCurrentStep(1)}
					/>
				)}
				{currentStep === 1 && (
					<SelectInterventions
						selectedTags={formData.tags}
						onTagsChange={(tags) => handleFormChange("tags", tags)}
						onBack={() => setCurrentStep(0)}
						onNext={() => setCurrentStep(2)}
					/>
				)}
				{currentStep === 2 && (
					<SelectCurriculum
						selectedMaterials={formData.instructionalMaterials}
						onMaterialsChange={(materials) =>
							handleFormChange("instructionalMaterials", materials)
						}
						onBack={() => setCurrentStep(1)}
						onNext={() => setCurrentStep(3)}
					/>
				)}
				{currentStep === 3 && (
					<ReviewSubmit formData={formData} onBack={() => setCurrentStep(2)} />
				)}
			</motion.div>
		</div>
	);
}

function BasicInfo({
	formData,
	onChange,
	onNext,
}: {
	formData: any;
	onChange: (field: string, value: any) => void;
	onNext: () => void;
}) {
	return (
		<div className='space-y-6  h-full px-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					School <span className='text-emerald-700'>*</span>
				</label>
				<Dropdown
					options={sampleSchools}
					value={formData.school}
					onChange={(value) => onChange("school", value)}
					placeholder='Select a school'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Course <span className='text-emerald-700'>*</span>
				</label>
				<input
					type='text'
					placeholder='Enter Course Name'
					value={formData.course}
					onChange={(e) => onChange("course", e.target.value)}
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Teacher <span className='text-emerald-700'>*</span>
				</label>
				<input
					type='text'
					placeholder='Enter Teacher Name'
					value={formData.teacher}
					onChange={(e) => onChange("teacher", e.target.value)}
					className='w-full px-3 py-2 rounded-lg  border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Grade(s) <span className='text-emerald-700'>*</span>
				</label>
				<MultiSelect
					options={gradeOptions}
					values={formData.grades}
					onChange={(values) => onChange("grades", values)}
					placeholder='Select grades'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Class Period / Section
				</label>
				<input
					type='text'
					placeholder='Enter class period / section'
					value={formData.classPeriod}
					onChange={(e) => onChange("classPeriod", e.target.value)}
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
				/>
			</div>

			<div className='flex justify-between pt-6'>
				<button className='px-6 py-2 text-gray-600 hover:text-gray-800'>
					Cancel
				</button>
				<button
					onClick={onNext}
					className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700'
				>
					Next
				</button>
			</div>
		</div>
	);
}

function SelectInterventions({
	selectedTags,
	onTagsChange,
	onBack,
	onNext,
}: {
	selectedTags: string[];
	onTagsChange: (tags: string[]) => void;
	onBack: () => void;
	onNext: () => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");

	// Define sample tag options with proper names and descriptions
	const tagOptions = [
		{
			id: "1",
			name: "Coaching",
			description:
				"Amplify Desmos Math promotes a collaborative classroom & guides teachers as facilitator.",
		},
		{
			id: "2",
			name: "Progress Monitoring",
			description:
				"Regular assessment to track student learning and adjust teaching strategies.",
		},
		{
			id: "3",
			name: "Intervention",
			description:
				"Targeted support for students who need additional assistance with specific skills.",
		},
	];

	// Filter tags based on search term
	const filteredTags = searchTerm
		? tagOptions.filter(
				(tag) =>
					tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					tag.description.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: tagOptions;

	const handleToggleTag = (tagId: string) => {
		const tagToToggle = tagOptions.find((tag) => tag.id === tagId);
		if (!tagToToggle) return;

		if (selectedTags.includes(tagToToggle.name)) {
			// Remove tag if already selected
			onTagsChange(selectedTags.filter((tag) => tag !== tagToToggle.name));
		} else {
			// Add tag if not selected
			onTagsChange([...selectedTags, tagToToggle.name]);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='mb-6'>
				<h2 className='mb-3 font-medium'>Instructional Materials</h2>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
				/>
			</div>

			<div className='space-y-4'>
				{filteredTags.map((tag) => (
					<div
						key={tag.id}
						className='p-4 border border-gray-200 rounded-lg hover:border-emerald-200'
					>
						<div className='flex items-start'>
							<input
								type='checkbox'
								checked={selectedTags.includes(tag.name)}
								onChange={() => handleToggleTag(tag.id)}
								className='mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300'
							/>
							<div className='ml-3'>
								<h3 className='font-medium'>{tag.name}</h3>
								<p className='text-sm text-gray-600'>{tag.description}</p>
							</div>
							<span className='ml-auto text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full'>
								Custom
							</span>
						</div>
					</div>
				))}

				{filteredTags.length === 0 && (
					<div className='p-4 border border-gray-200 rounded-lg text-gray-500 text-center'>
						No tags found matching your search
					</div>
				)}
			</div>

			<div className='flex justify-between pt-6'>
				<button
					onClick={onBack}
					className='px-6 py-2 text-gray-600 hover:text-gray-800'
				>
					Back
				</button>
				<button
					onClick={onNext}
					className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700'
				>
					Next
				</button>
			</div>
		</div>
	);
}

function SelectCurriculum({
	selectedMaterials,
	onMaterialsChange,
	onBack,
	onNext,
}: {
	selectedMaterials: string[];
	onMaterialsChange: (materials: string[]) => void;
	onBack: () => void;
	onNext: () => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");

	// Define sample curriculum options
	const materialOptions = [
		{
			id: "1",
			name: "Amplify",
			description:
				"McGraw-Hill Education Wonders is a K-6 literacy curriculum designed with a wealth of research-based print and digital resources for building a strong literacy foundation.",
		},
		{
			id: "2",
			name: "Eureka Math",
			description:
				"A comprehensive curriculum focused on mathematical understanding and reasoning with coherent connections between topics.",
		},
		{
			id: "3",
			name: "Illustrative Mathematics",
			description:
				"Problem-based curriculum designed to address content and practice standards to foster growth mindset in students.",
		},
	];

	// Filter materials based on search
	const filteredMaterials = searchTerm
		? materialOptions.filter(
				(material) =>
					material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					material.description.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: materialOptions;

	const handleToggleMaterial = (materialId: string) => {
		const materialToToggle = materialOptions.find(
			(material) => material.id === materialId
		);
		if (!materialToToggle) return;

		if (selectedMaterials.includes(materialToToggle.name)) {
			// Remove material if already selected
			onMaterialsChange(
				selectedMaterials.filter(
					(material) => material !== materialToToggle.name
				)
			);
		} else {
			// Add material if not selected
			onMaterialsChange([...selectedMaterials, materialToToggle.name]);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='mb-6'>
				<h2 className='mb-3 font-medium'>Instructional Materials</h2>
				<input
					type='text'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
				/>
			</div>

			<div className='space-y-4'>
				{filteredMaterials.map((material) => (
					<div
						key={material.id}
						className='p-4 border border-gray-200 rounded-lg hover:border-emerald-200'
					>
						<div className='flex items-start'>
							<input
								type='checkbox'
								checked={selectedMaterials.includes(material.name)}
								onChange={() => handleToggleMaterial(material.id)}
								className='mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300'
							/>
							<div className='ml-3'>
								<h3 className='font-medium'>{material.name}</h3>
								<p className='text-sm text-gray-600'>{material.description}</p>
							</div>
							<span className='ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
								Default
							</span>
						</div>
					</div>
				))}

				{filteredMaterials.length === 0 && (
					<div className='p-4 border border-gray-200 rounded-lg text-gray-500 text-center'>
						No materials found matching your search
					</div>
				)}
			</div>

			<div className='flex justify-between pt-6'>
				<button
					onClick={onBack}
					className='px-6 py-2 text-gray-600 hover:text-gray-800'
				>
					Back
				</button>
				<button
					onClick={onNext}
					className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700'
				>
					Next
				</button>
			</div>
		</div>
	);
}
function ReviewSubmit({
	formData,
	onBack,
}: {
	formData: any;
	onBack: () => void;
}) {
	return (
		<div className='space-y-6 h-full px-4'>
			{/* Basic Info Section - Matching the exact UI pattern of BasicInfo */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					School <span className='text-emerald-700'>*</span>
				</label>
				<input
					type='text'
					value={formData.school || ""}
					disabled
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Course <span className='text-emerald-700'>*</span>
				</label>
				<input
					type='text'
					value={formData.course || ""}
					disabled
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Teacher <span className='text-emerald-700'>*</span>
				</label>
				<input
					type='text'
					value={formData.teacher || ""}
					disabled
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed'
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Grade(s) <span className='text-emerald-700'>*</span>
				</label>
				<div className='w-full px-3 py-2 rounded-lg  bg-white min-h-[38px]'>
					{formData.grades && formData.grades.length > 0 ? (
						<div className='flex flex-wrap gap-1'>
							{formData.grades.map((grade: string) => (
								<span
									key={grade}
									className='bg-[#F2FAF6] text-emerald-700 text-xs px-3 py-2 border border-emerald-700 rounded-full flex gap-1'
								>
									<Student size={16} />

									{grade === "K"
										? "Kindergarten"
										: `${grade}${getNumberSuffix(grade)} Grade`}
								</span>
							))}
						</div>
					) : (
						<span className='text-gray-500'>No grades selected</span>
					)}
				</div>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Class Period / Section
				</label>
				<input
					type='text'
					value={formData.classPeriod || ""}
					disabled
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed'
				/>
			</div>

			{/* Tags & Attributes Section - Matching SelectInterventions UI */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Selected Tags & Attributes
				</label>
				<div className='space-y-4'>
					{formData.tags && formData.tags.length > 0 ? (
						formData.tags.map((tag: string, i: number) => (
							<div
								key={i}
								className='p-4 border border-gray-200 rounded-lg bg-white '
							>
								<div className='flex items-start'>
									<div className='ml-3'>
										<h3 className='font-medium'>{tag}</h3>
										<p className='text-sm text-gray-600'>
											{/* Use the description if available or a placeholder */}
											{tag === "Coaching"
												? "Amplify Desmos Math promotes a collaborative classroom & guides teachers as facilitator."
												: "Selected tag attribute"}
										</p>
									</div>
									<span className='ml-auto text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full'>
										Custom
									</span>
								</div>
							</div>
						))
					) : (
						<div className='p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500'>
							No tags or attributes selected
						</div>
					)}
				</div>
			</div>

			{/* Instructional Materials Section - Matching SelectCurriculum UI */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Selected Instructional Materials
				</label>
				<div className='space-y-4'>
					{formData.instructionalMaterials &&
					formData.instructionalMaterials.length > 0 ? (
						formData.instructionalMaterials.map(
							(material: string, i: number) => (
								<div
									key={i}
									className='p-4 border border-gray-200 rounded-lg bg-white '
								>
									<div className='flex items-start'>
										<div className='ml-3'>
											<h3 className='font-medium'>{material}</h3>
											<p className='text-sm text-gray-600'>
												{material === "Amplify"
													? "McGraw-Hill Education Wonders is a K-6 literacy curriculum designed with a wealth of research-based print and digital resources for building a strong literacy foundation."
													: "Selected instructional material"}
											</p>
										</div>
										<span className='ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
											Default
										</span>
									</div>
								</div>
							)
						)
					) : (
						<div className='p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500'>
							No instructional materials selected
						</div>
					)}
				</div>
			</div>

			{/* Standard button row */}
			<div className='flex justify-between pt-6'>
				<button
					onClick={onBack}
					className='px-6 py-2 text-gray-600 hover:text-gray-800'
				>
					Back
				</button>
				<button className='px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700'>
					Create
				</button>
			</div>
		</div>
	);
}

// Helper function for grade number suffixes
function getNumberSuffix(grade: string): string {
	const num = parseInt(grade, 10);
	if (isNaN(num)) return "";
	if (num === 1) return "st";
	if (num === 2) return "nd";
	if (num === 3) return "rd";
	return "th";
}
