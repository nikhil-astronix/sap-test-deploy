"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Stepper from "./Stepper";
import Dropdown from "../ui/Dropdown";
import MultiSelect from "../ui/MultiSelect";
import { Student } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { getSchools } from "@/services/schoolService";
import { getInterventions } from "@/services/interventionService";
import { fetchAllCurriculums } from "@/services/curriculumsService";
import { fetchCurriculumsRequestPayload } from "@/models/curriculum";
import { createClassroom } from "@/services/classroomService";
import { AxiosError } from "axios";

const steps = [
	{ label: "Basic Classroom Info", id: "basic-info" },
	{ label: "Select Tags & Attributes", id: "interventions" },
	{ label: "Select Instructional Materials", id: "curriculum" },
	{ label: "Review & Submit", id: "review" },
];

const gradeOptions = [
	{ label: "Kindergarten", value: "K" },
	{ label: "1st Grade", value: "1" },
	{ label: "2nd Grade", value: "2" },
	{ label: "3rd Grade", value: "3" },
	{ label: "4th Grade", value: "4" },
	{ label: "5th Grade", value: "5" },
];

type Tag = {
	id: string;
	name: string;
	description: string;
	type: string;
};

type Material = {
	id: string;
	title: string;
	description: string;
	type: string;
};

export default function CreateClassroomForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		school: "",
		school_id: "",
		course: "",
		teacher: "",
		grades: [] as string[],
		classPeriod: "",
		tags: [] as Tag[], // Add tags array to track selected interventions
		instructionalMaterials: [] as Material[], // Add instructionalMaterials array
	});
	const [schoolsData, setSchoolsData] = useState<any[]>([]);
	const [curriculums, setCurriculums] = useState<any[]>([]);
	const [interventions, setInterventions] = useState<any[]>([]);
	const [apiError, setApiError] = useState("");
	const [apiSuccess, setApiSuccess] = useState("");

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

	useEffect(() => {
		fetchSchools();
		fetchCurriculums();
		fetchInterventions();
	}, []);

	const fetchSchools = async () => {
		try {
			const requesPayload = {
				is_archived: null,
				sort_by: null,
				sort_order: null,
				curr_page: 1,
				per_page: 100,
				search: null,
			};
			const response = await getSchools(requesPayload);
			console.log("response", response);
			const formattedschools = response.data.schools.map((school) => ({
				value: school.id,
				label: school.name,
			}));
			setSchoolsData(formattedschools);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const fetchCurriculums = async () => {
		try {
			const requesPayload: fetchCurriculumsRequestPayload = {
				is_archived: false,
				type: ["Default", "Custom"].join(","),
				sort_by: null,
				sort_order: null,
				search: null,
				page: 1,
				limit: 100,
			};
			const data = await fetchAllCurriculums(requesPayload);

			if (data.success) {
				const formattedCurriculums = data.data.curriculums;
				setCurriculums(formattedCurriculums);
			}
		} catch (error) {
			console.error("Failed to load curriculums:", error);
		}
	};

	const fetchInterventions = async () => {
		try {
			const requesPayload: fetchCurriculumsRequestPayload = {
				is_archived: null,
				type: null,
				sort_by: null,
				sort_order: null,
				search: null,
				page: 1,
				limit: 100,
			};
			const data = await getInterventions(requesPayload);
			if (data.success) {
				const formattedInterventions = data.data.interventions;
				setInterventions(formattedInterventions);
			}
		} catch (error) {
			console.error("Failed to load curriculums:", error);
		}
	};

	const handleSubmit = async () => {
		try {
			let data = {
				school_id: formData.school_id,
				course: formData.course,
				teacher_name: formData.teacher,
				grades: formData.grades,
				class_section: formData.classPeriod,
				interventions: formData.tags.map((tag: { id: string }) => tag.id),
				curriculums: formData.instructionalMaterials.map(
					(material: { id: string }) => material.id
				),
			};
			console.log("datadatadata", data);
			const response = await createClassroom(data);
			if (response.success) {
				setApiSuccess("Classroom created successfully!");
				setApiError("");
				setTimeout(() => {
					router.push("/classrooms");
				}, 1000);
			}
		} catch (error: unknown) {
			const errorMessage =
				(error as AxiosError<ErrorResponse>)?.response?.data?.message ||
				(error instanceof Error
					? error.message
					: "Failed to create user. Please try again.");
			setApiError(errorMessage || "Something went wrong");
			setApiSuccess("");
		} finally {
			console.log("failed to create classroom");
		}
	};

	return (
		<div>
			<Stepper steps={stepperSteps} />
			<div className='max-w-2xl w-full mx-auto'>
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
							schoolsData={schoolsData}
						/>
					)}
					{currentStep === 1 && (
						<SelectInterventions
							selectedTags={formData.tags}
							onTagsChange={(tags) => handleFormChange("tags", tags)}
							onBack={() => setCurrentStep(0)}
							onNext={() => setCurrentStep(2)}
							options={interventions}
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
							options={curriculums}
						/>
					)}
					{currentStep === 3 && (
						<ReviewSubmit
							formData={formData}
							onBack={() => setCurrentStep(2)}
							handleSubmit={handleSubmit}
						/>
					)}
				</motion.div>
			</div>
		</div>
	);
}

function BasicInfo({
	formData,
	onChange,
	onNext,
	schoolsData,
}: {
	formData: any;
	onChange: (field: string, value: any) => void;
	onNext: () => void;
	schoolsData: string[];
}) {
	const router = useRouter();
	return (
		<div className='space-y-6  h-full px-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					School <span className='text-emerald-700'>*</span>
				</label>
				<Dropdown
					options={schoolsData}
					value={formData.school_id} // Changed from formData.school to formData.school_id
					onChange={(value) => {
						console.log("schoolsData:", schoolsData);
						console.log("Selected value:", value);

						// Find the selected school object
						const selectedSchool = schoolsData.find(
							(school) => school.value === value
						);

						// Store both the ID (for API) and label (for display)
						onChange("school_id", value); // Save ID separately for API
						onChange("school", selectedSchool?.label || value); // Save label for display
					}}
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-[#F4F6F8]'
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-[#F4F6F8]'
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
					className='bg-[#F4F6F8]'
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-[#F4F6F8]'
				/>
			</div>

			<div className='flex justify-between pt-6'>
				<button
					onClick={() => router.push("/classrooms")}
					className='px-6 py-2 text-gray-600 hover:text-gray-800'
				>
					Cancel
				</button>
				<button
					onClick={onNext}
					className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-[#2A7251]'
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
	options,
}: {
	selectedTags: Tag[];
	options: Tag[];
	onTagsChange: (tags: Tag[]) => void;
	onBack: () => void;
	onNext: () => void;
}) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	// Filter tags based on search term
	const filteredTags = searchTerm
		? options.filter(
				(tag) =>
					tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					tag.description.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: options;

	const handleToggleTag = (tagId: string) => {
		const tagToToggle = options.find((tag) => tag.id === tagId);
		if (!tagToToggle) return;

		const isAlreadySelected = selectedTags.some(
			(tag) => tag.id === tagToToggle.id
		);

		if (isAlreadySelected) {
			onTagsChange(selectedTags.filter((tag) => tag.id !== tagToToggle.id));
		} else {
			onTagsChange([...selectedTags, tagToToggle]);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='mb-6'>
				<h2 className='mb-3 font-medium'>Tags & Attributes</h2>
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
								checked={selectedTags.some((t) => t.id === tag.id)}
								onChange={() => handleToggleTag(tag.id)}
								className='mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300'
							/>
							<div className='ml-3'>
								<h3 className='font-medium'>{tag.name}</h3>
								<p className='text-sm text-gray-600'>{tag.description}</p>
							</div>

							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
								className='mb-2 ml-auto'
							>
								<motion.span
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.3 }}
									className={`inline-block flex flex-row items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${
										tag.type === "Custom"
											? "bg-purple-100 text-purple-800"
											: "bg-emerald-100 text-emerald-700"
									}`}
								>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.3, duration: 0.2 }}
										className={`w-2 h-2 rounded-full mr-1 ${
											tag.type === "Custom" ? "bg-purple-800" : "bg-emerald-800"
										}`}
									/>
									{tag.type}
								</motion.span>
							</motion.div>
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
				<div className='flex justify-between gap-4 pt-6'>
					<button
						onClick={() => router.push("/classrooms")}
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg'
					>
						Cancel
					</button>
					<button
						onClick={onNext}
						className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-[#2A7251]'
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}

function SelectCurriculum({
	selectedMaterials,
	onMaterialsChange,
	onBack,
	onNext,
	options,
}: {
	selectedMaterials: Material[];
	options: Material[];
	onMaterialsChange: (materials: Material[]) => void;
	onBack: () => void;
	onNext: () => void;
}) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	// Filter materials based on search
	const filteredMaterials = searchTerm
		? options.filter(
				(material) =>
					material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					material.description.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: options;

	const handleToggleMaterial = (materialId: string) => {
		const materialToToggle = options.find(
			(material) => material.id === materialId
		);
		if (!materialToToggle) return;

		const isAlreadySelected = selectedMaterials.some(
			(material) => material.id === materialToToggle.id
		);

		if (isAlreadySelected) {
			onMaterialsChange(
				selectedMaterials.filter(
					(material) => material.id !== materialToToggle.id
				)
			);
		} else {
			onMaterialsChange([...selectedMaterials, materialToToggle]);
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
				{filteredMaterials?.map((material) => (
					<div
						key={material.id}
						className='p-4 border border-gray-200 rounded-lg hover:border-emerald-200'
					>
						<div className='flex items-start'>
							<input
								type='checkbox'
								checked={selectedMaterials.some((m) => m.id === material.id)}
								onChange={() => handleToggleMaterial(material.id)}
								className='mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300'
							/>
							<div className='ml-3'>
								<h3 className='font-medium'>{material.title}</h3>
								<p className='text-sm text-gray-600'>{material.description}</p>
							</div>

							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.1, duration: 0.3 }}
								className='mb-2 ml-auto'
							>
								<motion.span
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.3 }}
									className={`inline-block flex flex-row items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${
										material.type === "Custom"
											? "bg-purple-100 text-purple-800"
											: "bg-emerald-100 text-emerald-700"
									}`}
								>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.3, duration: 0.2 }}
										className={`w-2 h-2 rounded-full mr-1 ${
											material.type === "Custom"
												? "bg-purple-800"
												: "bg-emerald-800"
										}`}
									/>
									{material.type}
								</motion.span>
							</motion.div>
						</div>
					</div>
				))}

				{filteredMaterials?.length === 0 && (
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
				<div className='flex justify-between gap-4 pt-6'>
					<button
						onClick={() => router.push("/classrooms")}
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg'
					>
						Cancel
					</button>
					<button
						onClick={onNext}
						className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-[#2A7251]'
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
function ReviewSubmit({
	formData,
	onBack,
	handleSubmit,
}: {
	formData: any;
	onBack: () => void;
	handleSubmit: () => void;
}) {
	const router = useRouter();
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed'
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed'
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed'
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
					className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed'
				/>
			</div>

			{/* Tags & Attributes Section - Matching SelectInterventions UI */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Selected Tags & Attributes
				</label>
				<div className='space-y-4'>
					{formData.tags && formData.tags.length > 0 ? (
						formData.tags.map((tag: any, i: number) => (
							<div
								key={i}
								className='py-4 border border-gray-200 rounded-lg bg-white '
							>
								<div className='flex items-start'>
									<div className='ml-3'>
										<h3 className='font-medium'>{tag.name}</h3>
										<p className='text-sm text-gray-600'>
											{/* Use the description if available or a placeholder */}
											{/* {tag === "Coaching"
                        ? "Amplify Desmos Math promotes a collaborative classroom & guides teachers as facilitator."
                        : "Selected tag attribute"} */}
											{tag.description}
										</p>
									</div>
									{/* <span className="ml-auto text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Custom
                  </span> */}
									<motion.div
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.1, duration: 0.3 }}
										className='mb-2 ml-auto px-2'
									>
										<motion.span
											initial={{ scale: 0.9, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: 0.2, duration: 0.3 }}
											className={`inline-block flex flex-row items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${
												tag.type === "Custom"
													? "bg-purple-100 text-purple-800"
													: "bg-emerald-100 text-emerald-700"
											}`}
										>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.3, duration: 0.2 }}
												className={`w-2 h-2 rounded-full mr-1 ${
													tag.type === "Custom"
														? "bg-purple-800"
														: "bg-emerald-800"
												}`}
											/>
											{tag.type}
										</motion.span>
									</motion.div>
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
						formData.instructionalMaterials.map((material: any, i: number) => (
							<div
								key={i}
								className=' py-4 border border-gray-200 rounded-lg bg-white'
							>
								<div className='flex items-start'>
									<div className='ml-3'>
										<h3 className='font-medium'>{material.title}</h3>
										<p className='text-sm text-gray-600'>
											{material.description}
										</p>
									</div>
									<motion.div
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.1, duration: 0.3 }}
										className='mb-2 ml-auto px-2'
									>
										<motion.span
											initial={{ scale: 0.9, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: 0.2, duration: 0.3 }}
											className={`inline-block flex flex-row items-center w-fit px-3 py-1 rounded-full text-xs font-medium ${
												material.type === "Custom"
													? "bg-purple-100 text-purple-800"
													: "bg-emerald-100 text-emerald-700"
											}`}
										>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.3, duration: 0.2 }}
												className={`w-2 h-2 rounded-full mr-1 ${
													material.type === "Custom"
														? "bg-purple-800"
														: "bg-emerald-800"
												}`}
											/>
											{material.type}
										</motion.span>
									</motion.div>
								</div>
							</div>
						))
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
				<div className='flex justify-between items-center space-x-4'>
					<button
						onClick={() => router.push("/classrooms")}
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg'
					>
						Cancel
					</button>
					<button
						onClick={() => handleSubmit()}
						className='px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]'
					>
						Create
					</button>
				</div>
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
