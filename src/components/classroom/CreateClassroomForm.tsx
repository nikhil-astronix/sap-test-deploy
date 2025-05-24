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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schemas for form validation
const basicInfoSchema = z.object({
	school_id: z.string().min(1, "Please select a school"),
	school: z.string().min(1, "School name is required"),
	course: z.string().min(1, "Course name is required"),
	teacher: z.string().min(1, "Teacher name is required"),
	grades: z.array(z.string()).min(1, "Please select at least one grade"),
	classPeriod: z.string().optional(),
});

const TagSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
});

const MaterialSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	type: z.string(),
});

// Combined schema for the entire form
const classroomFormSchema = z.object({
	school_id: z.string().min(1, "Please select a school"),
	school: z.string().min(1, "School name is required"),
	course: z.string().min(1, "Course name is required"),
	teacher: z.string().min(1, "Teacher name is required"),
	grades: z.array(z.string()).min(1, "Please select at least one grade"),
	classPeriod: z.string().optional(),
	tags: z.array(TagSchema).default([]),
	instructionalMaterials: z.array(MaterialSchema).default([]),
});

// Infer TypeScript type from the schema
type ClassroomFormData = z.infer<typeof classroomFormSchema>;

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

export default function CreateClassroomForm() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [schoolsData, setSchoolsData] = useState<any[]>([]);
	const [curriculums, setCurriculums] = useState<any[]>([]);
	const [interventions, setInterventions] = useState<any[]>([]);
	const [apiError, setApiError] = useState("");
	const [apiSuccess, setApiSuccess] = useState("");

	// Initialize React Hook Form with Zod validation
	const defaultValues: ClassroomFormData = {
		school: "",
		school_id: "",
		course: "",
		teacher: "",
		grades: [],
		classPeriod: "",
		tags: [],
		instructionalMaterials: [],
	};

	const {
		register,
		handleSubmit: validateSubmit,
		setValue,
		watch,
		formState: { errors, isValid, isDirty },
		trigger,
	} = useForm<ClassroomFormData>({
		resolver: zodResolver(classroomFormSchema) as import("react-hook-form").Resolver<ClassroomFormData, any>,
		mode: "onChange",
		defaultValues,
	});

	// Watch form values for current display
	const formData = watch();

	const getStepStatus = (index: number) => {
		if (index < currentStep) return "completed";
		if (index === currentStep) return "current";
		return "upcoming";
	};

	const stepperSteps = steps.map((step, index) => ({
		label: step.label,
		number: index + 1,
		status: getStepStatus(index) as "completed" | "current" | "upcoming",
	}));

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
			const formattedschools = response.data.schools.map((school: any) => ({
				value: school.id,
				label: school.name,
			}));
			setSchoolsData(formattedschools);
		} catch (error) {
			console.error("Error fetching schools:", error);
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
				setCurriculums(data.data.curriculums);
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
				setInterventions(data.data.interventions);
			}
		} catch (error) {
			console.error("Failed to load interventions:", error);
		}
	};

	// Handle form field changes
	const handleFormChange = (field: keyof ClassroomFormData, value: any) => {
		setValue(field, value, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	// Validate current step before proceeding to next step
	const validateStep = async (nextStep: number) => {
		let fieldsToValidate: Array<keyof ClassroomFormData> = [];

		// Determine which fields to validate based on current step
		if (currentStep === 0) {
			fieldsToValidate = ["school_id", "school", "course", "teacher", "grades"];
		}

		if (fieldsToValidate.length > 0) {
			const isStepValid = await trigger(fieldsToValidate);
			if (!isStepValid) return false;
		}

		setCurrentStep(nextStep);
		return true;
	};

	// Handle final form submission
	const onSubmit = async (data: ClassroomFormData) => {
		try {
			setApiError("");
			const submitData = {
				school_id: data.school_id,
				school_name: data.school,
				course: data.course,
				teacher_name: data.teacher,
				grades: data.grades,
				class_section: data.classPeriod || "",
				interventions: data.tags?.map((tag) => tag.id) || [],
				curriculums:
					data.instructionalMaterials?.map((material) => material.id) || [],
			};

			const response = await createClassroom(submitData);

			if (response.success) {
				setApiSuccess("Classroom created successfully!");
				setTimeout(() => {
					router.push("/classrooms");
				}, 1000);
			}
		} catch (error: unknown) {
			const errorMessage =
				(error as AxiosError<{ message: string }>)?.response?.data?.message ||
				(error instanceof Error ? error.message : "Failed to create classroom");

			setApiError(errorMessage);
		}
	};

	return (
		<div>
			<Stepper steps={stepperSteps} />

			{apiError && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4'>
					<p>{apiError}</p>
				</div>
			)}

			{apiSuccess && (
				<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4 mb-4'>
					<p>{apiSuccess}</p>
				</div>
			)}

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
							onNext={() => validateStep(1)}
							schoolsData={schoolsData}
							errors={errors}
						/>
					)}

					{currentStep === 1 && (
						<SelectInterventions
							selectedTags={formData.tags || []}
							onTagsChange={(tags) => handleFormChange("tags", tags)}
							onBack={() => setCurrentStep(0)}
							onNext={() => validateStep(2)}
							options={interventions}
						/>
					)}

					{currentStep === 2 && (
						<SelectCurriculum
							selectedMaterials={formData.instructionalMaterials || []}
							onMaterialsChange={(materials) =>
								handleFormChange("instructionalMaterials", materials)
							}
							onBack={() => setCurrentStep(1)}
							onNext={() => validateStep(3)}
							options={curriculums}
						/>
					)}

					{currentStep === 3 && (
						<ReviewSubmit
							formData={formData}
							onBack={() => setCurrentStep(2)}
							handleSubmit={validateSubmit(onSubmit)}
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
	errors,
}: {
	formData: ClassroomFormData;
	onChange: (field: keyof ClassroomFormData, value: any) => void;
	onNext: () => void;
	schoolsData: any[];
	errors: any;
}) {
	const router = useRouter();

	return (
		<div className='space-y-6 h-full px-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					School <span className='text-emerald-700'>*</span>
				</label>
				<Dropdown
					options={schoolsData}
					value={formData.school_id}
					onChange={(value) => {
						const selectedSchool = schoolsData.find(
							(school) => school.value === value
						);

						onChange("school_id", value);
						onChange("school", selectedSchool?.label || value);
					}}
					placeholder='Select a school'
				/>
				{errors.school_id && (
					<p className='text-red-500 text-xs mt-1'>
						{errors.school_id.message as string}
					</p>
				)}
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
				{errors.course && (
					<p className='text-red-500 text-xs mt-1'>
						{errors.course.message as string}
					</p>
				)}
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
				{errors.teacher && (
					<p className='text-red-500 text-xs mt-1'>
						{errors.teacher.message as string}
					</p>
				)}
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
				{errors.grades && (
					<p className='text-red-500 text-xs mt-1'>
						{errors.grades.message as string}
					</p>
				)}
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
					className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-emerald-800 transition-colors'
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
	selectedTags: typeof TagSchema._type[];
	options: typeof TagSchema._type[];
	onTagsChange: (tags: typeof TagSchema._type[]) => void;
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

			<div className='space-y-4 max-h-96 overflow-y-auto'>
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
								className='mt-1 h-4 w-4 accent-[#2A7251] rounded border-gray-300 focus:ring-[#2A7251]'
								id={`tag-${tag.id}`}
							/>
							<label
								htmlFor={`tag-${tag.id}`}
								className='ml-3 flex-grow cursor-pointer'
							>
								<h3 className='font-medium'>{tag.name}</h3>
								<p className='text-sm text-gray-600'>{tag.description}</p>
							</label>

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
				<div className='flex justify-between gap-4'>
					<button
						onClick={() => router.push("/classrooms")}
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={onNext}
						className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-emerald-800 transition-colors'
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
	selectedMaterials: typeof MaterialSchema._type[];
	options: typeof MaterialSchema._type[];
	onMaterialsChange: (materials: typeof MaterialSchema._type[]) => void;
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

			<div className='space-y-4 max-h-96 overflow-y-auto'>
				{filteredMaterials?.map((material) => (
					<div
						key={material.id}
						className='p-4 border border-gray-200 rounded-lg hover:border-emerald-200'
					>
						<div className='flex items-start'>
							<input
								type='checkbox'
								id={`material-${material.id}`}
								checked={selectedMaterials.some((m) => m.id === material.id)}
								onChange={() => handleToggleMaterial(material.id)}
								className='mt-1 h-4 w-4 accent-[#2A7251] rounded border-gray-300 focus:ring-[#2A7251]'
							/>
							<label
								htmlFor={`material-${material.id}`}
								className='ml-3 flex-grow cursor-pointer'
							>
								<h3 className='font-medium'>{material.title}</h3>
								<p className='text-sm text-gray-600'>{material.description}</p>
							</label>

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
				<div className='flex justify-between gap-4'>
					<button
						onClick={() => router.push("/classrooms")}
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={onNext}
						className='px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-emerald-800 transition-colors'
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
	formData: ClassroomFormData;
	onBack: () => void;
	handleSubmit: () => void;
}) {
	const router = useRouter();

	return (
		<div className='space-y-6 h-full px-4'>
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
				<div className='w-full px-3 py-2 rounded-lg bg-white min-h-[38px]'>
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

			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					Selected Tags & Attributes
				</label>
				<div className='space-y-4'>
					{formData.tags && formData.tags.length > 0 ? (
						formData.tags.map((tag: any, i: number) => (
							<div
								key={i}
								className='py-4 border border-gray-200 rounded-lg bg-white'
							>
								<div className='flex items-start'>
									<div className='ml-3'>
										<h3 className='font-medium'>{tag.name}</h3>
										<p className='text-sm text-gray-600'>{tag.description}</p>
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
								className='py-4 border border-gray-200 rounded-lg bg-white'
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
						className='px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className='px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-emerald-800 transition-colors'
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
