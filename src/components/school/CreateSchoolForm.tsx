"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod"; // Import zod
import Dropdown from "../ui/Dropdown";
import MultiSelect from "../ui/MultiSelect";
import { Student, MagnifyingGlass } from "@phosphor-icons/react";
import Stepper from "./Stepper";
import { useRouter } from "next/navigation";
import { getInterventions } from "@/services/interventionService";
import { fetchAllCurriculums } from "@/services/curriculumsService";
import { fetchCurriculumsRequestPayload } from "@/models/curriculum";
import { createSchool } from "@/services/schoolService";

// Define Zod schemas
const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
});

const materialSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
});

// Schema for the whole form
const schoolFormSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  grades: z.array(z.string()).min(1, "At least one grade must be selected"),
  tags: z.array(tagSchema), // Tags are optional
  instructionalMaterials: z.array(materialSchema), // Materials are optional
});

// Type for form data derived from schema
type SchoolFormData = z.infer<typeof schoolFormSchema>;

const steps = [
  { label: "Basic School Info", id: "basic-info" },
  { label: "Select Tags & Attributes", id: "interventions" },
  { label: "Select Instructional Materials", id: "curriculum" },
  { label: "Review & Submit", id: "review" },
];

const gradeOptions = [
  { label: "Kindergarten", value: "Kindergarten" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
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

export default function CreateSchoolForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: "",
    grades: [] as string[],
    tags: [] as Tag[],
    instructionalMaterials: [] as Material[],
  });
  const [validationErrors, setValidationErrors] = useState<{
    schoolName?: string;
    grades?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCurriculums();
    fetchInterventions();
  }, []);

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
      const requesPayload = {
        is_archived: false,
        filter: null,
        sort_by: null,
        sort_order: null,
        search: null,
        curr_page: 1,
        per_page: 100,
      };
      const data = await getInterventions(requesPayload);
      if (data.success) {
        const formattedInterventions = data.data.interventions;
        setInterventions(formattedInterventions);
      }
    } catch (error) {
      console.error("Failed to load interventions:", error);
    }
  };

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

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when field is updated
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate step and move to next if valid
  const handleNextStep = (step: number) => {
    if (step === 0) {
      // Validate basic info
      const basicInfoSchema = z.object({
        schoolName: z.string().min(1, "School name is required"),
        grades: z
          .array(z.string())
          .min(1, "At least one grade must be selected"),
      });

      const result = basicInfoSchema.safeParse({
        schoolName: formData.schoolName,
        grades: formData.grades,
      });

      if (!result.success) {
        const formattedErrors = result.error.format();
        setValidationErrors({
          schoolName: formattedErrors.schoolName?._errors[0],
          grades: formattedErrors.grades?._errors[0],
        });
        return;
      }

      // If validation passes, clear errors and proceed
      setValidationErrors({});
    }

    setCurrentStep(step + 1);
  };

  // Final form submission
  const handleSubmit = async () => {
    // Validate entire form
    const result = schoolFormSchema.safeParse(formData);
    const districtValue = localStorage.getItem("districtValue");
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form data to API (placeholder for actual implementation)
      console.log("Submitting school data:", formData);

      const payload = {
        name: formData.schoolName,
        district: districtValue,
        grades: formData.grades || [],
        curriculums:
          formData.instructionalMaterials?.map((item: any) => item.id) || [],
        interventions: formData.tags?.map((item: any) => item.id) || [],
      };
      const response = await createSchool(payload);

      if (response.success) {
        router.push("/schools");
      }
    } catch (error) {
      console.error("Failed to create school:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Stepper steps={stepperSteps} />
      <div className="max-w-2xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12"
        >
          {currentStep === 0 && (
            <BasicInfo
              formData={formData}
              onChange={handleFormChange}
              onNext={() => handleNextStep(0)}
              validationErrors={validationErrors}
            />
          )}
          {currentStep === 1 && (
            <SelectInterventions
              selectedTags={formData.tags}
              options={interventions}
              onTagsChange={(tags) => handleFormChange("tags", tags)}
              onBack={() => setCurrentStep(0)}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <SelectCurriculum
              selectedMaterials={formData.instructionalMaterials}
              options={curriculums}
              onMaterialsChange={(materials) =>
                handleFormChange("instructionalMaterials", materials)
              }
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <ReviewSubmit
              formData={formData}
              onBack={() => setCurrentStep(2)}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
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
  validationErrors,
}: {
  formData: SchoolFormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  validationErrors: { schoolName?: string; grades?: string };
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 h-full px-4">
      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          School Name <span className="text-emerald-700">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter School Name"
          value={formData.schoolName}
          onChange={(e) => onChange("schoolName", e.target.value)}
          className={`w-full px-3 py-2 text-[12px] bg-[#F4F6F8] rounded-lg border ${
            validationErrors.schoolName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-emerald-500"
          } focus:outline-none focus:ring-1`}
        />
        {validationErrors.schoolName && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors.schoolName}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          Grade(s) <span className="text-emerald-700">*</span>
        </label>
        <MultiSelect
          className="bg-[#F4F6F8] text-[12px]"
          options={gradeOptions}
          values={formData.grades}
          onChange={(values) => onChange("grades", values)}
          placeholder="Select grades"
        />
        {validationErrors.grades && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.grades}</p>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => router.push("/schools")}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]"
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="mb-3 text-[16px] text-black-400">Tags & Attributes</h2>
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredTags.map((tag) => (
          <div
            key={tag.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200"
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={selectedTags.some((t) => t.id === tag.id)}
                onChange={() => handleToggleTag(tag.id)}
                className="mt-1 h-4 w-4 accent-[#2A7251] rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="text-[14px] text-black-400">{tag.name}</h3>
                <p className="text-[12px] text-[#637381]">{tag.description}</p>
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-2 ml-auto"
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
          <div className="p-4 border border-gray-200 rounded-lg text-gray-500 text-center">
            No tags found matching your search
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={() => router.push("/schools")}
            className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onNext}
            className="px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-[#2A7251]"
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
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <div className="mb-6">
        <h2 className="mb-3 text-[16px] text-black-400">
          Instructional Materials
        </h2>
        <div className="relative">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200"
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={selectedMaterials.some((m) => m.id === material.id)}
                onChange={() => handleToggleMaterial(material.id)}
                className="mt-1 h-4 w-4 accent-[#2A7251] rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="text-[14px] text-black-400">{material.title}</h3>
                <p className="text-[12px] text-[#637381]">
                  {material.description}
                </p>
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mb-2 ml-auto"
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

        {filteredMaterials.length === 0 && (
          <div className="p-4 border border-gray-200 rounded-lg text-gray-500 text-center">
            No materials found matching your search
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={() => router.push("/schools")}
            className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onNext}
            className="px-8 py-2 bg-[#2A7251] text-white rounded-xl hover:bg-[#2A7251]"
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
  isSubmitting,
  onSubmit,
}: {
  formData: SchoolFormData;
  onBack: () => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 h-full px-4">
      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          School Name <span className="text-emerald-700">*</span>
        </label>
        <input
          type="text"
          value={formData.schoolName || ""}
          disabled
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed text-[12px]"
        />
      </div>

      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          Grade(s) <span className="text-emerald-700">*</span>
        </label>
        <div className="w-full px-3 py-2 rounded-lg bg-white min-h-[38px]">
          {formData.grades && formData.grades.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {formData.grades.map((grade: string) => (
                <span
                  key={grade}
                  className="bg-[#F2FAF6] text-emerald-700 text-xs px-3 py-2 border border-emerald-700 rounded-full flex gap-1"
                >
                  <Student size={16} />
                  {grade === "K"
                    ? "Kindergarten"
                    : `${grade}${getNumberSuffix(grade)} Grade`}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">No grades selected</span>
          )}
        </div>
      </div>

      {/* Tags & Attributes Section */}
      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          Selected Tags & Attributes
        </label>
        <div className="space-y-4">
          {formData.tags && formData.tags.length > 0 ? (
            formData.tags.map((tag: any, i: number) => (
              <div
                key={i}
                className="py-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-start">
                  <div className="ml-3">
                    <h3 className="text-[14px] text-black-400">{tag.name}</h3>
                    <p className="text-[12px] text-[#637381]">
                      {tag.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="mb-2 ml-auto px-2"
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
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
              No tags or attributes selected
            </div>
          )}
        </div>
      </div>

      {/* Instructional Materials Section */}
      <div>
        <label className="block text-[16px] text-black-400 mb-2">
          Selected Instructional Materials
        </label>
        <div className="space-y-4">
          {formData.instructionalMaterials &&
          formData.instructionalMaterials.length > 0 ? (
            formData.instructionalMaterials.map((material: any, i: number) => (
              <div
                key={i}
                className="py-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-start">
                  <div className="ml-3">
                    <h3 className="text-[14px] text-black-400">
                      {material.title}
                    </h3>
                    <p className="text-[12px] text-[#637381]">
                      {material.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="mb-2 ml-auto px-2"
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
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
              No instructional materials selected
            </div>
          )}
        </div>
      </div>

      {/* Button row */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={() => router.push("/schools")}
            className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            {/* {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Creating...
              </>
            ) : ( */}
            {/* <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"> */}
            Create
            {/* </div> */}
            {/* )} */}
          </button>
        </div>
      </div>
    </div>
  );
}

function getNumberSuffix(grade: string): string {
  const num = parseInt(grade, 10);
  if (isNaN(num)) return "";
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "th";
}
