"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Dropdown from "../ui/Dropdown";
import MultiSelect from "../ui/MultiSelect";
import { Student } from "@phosphor-icons/react";
import Stepper from "./Stepper";
import { useRouter } from "next/navigation";
import { getInterventions } from "@/services/interventionService";
import { fetchAllCurriculums } from "@/services/curriculumsService";
import { fetchCurriculumsRequestPayload } from "@/models/curriculum";

const steps = [
  { label: "Basic School Info", id: "basic-info" },
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

export default function CreateSchoolForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    schoolName: "",
    grades: [] as string[],
    tags: [] as Tag[],
    instructionalMaterials: [] as Material[],
  });

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
              onNext={() => setCurrentStep(1)}
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
}: {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6  h-full px-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Name
        </label>
        <input
          type="text"
          placeholder="Enter School Name"
          value={formData.schoolName}
          onChange={(e) => onChange("schoolName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade(s)
        </label>
        <MultiSelect
          options={gradeOptions}
          values={formData.grades}
          onChange={(values) => onChange("grades", values)}
          placeholder="Select grades"
        />
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
        <h2 className="mb-3 font-medium">Tags & Attributes</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-4">
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
                className="mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="font-medium">{tag.name}</h3>
                <p className="text-sm text-gray-600">{tag.description}</p>
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
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="mb-3 font-medium">Instructional Materials</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
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
                className="mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="font-medium">{material.title}</h3>
                <p className="text-sm text-gray-600">{material.description}</p>
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
}: {
  formData: any;
  onBack: () => void;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6 h-full px-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School Name <span className="text-emerald-700">*</span>
        </label>
        <input
          type="text"
          value={formData.schoolName || ""}
          disabled
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F4F6F8] cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade(s) <span className="text-emerald-700">*</span>
        </label>
        <div className="w-full px-3 py-2 rounded-lg  bg-white min-h-[38px]">
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

      {/* Tags & Attributes Section - Matching SelectInterventions UI */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Tags & Attributes
        </label>
        <div className="space-y-4">
          {formData.tags && formData.tags.length > 0 ? (
            formData.tags.map((tag: any, i: number) => (
              <div
                key={i}
                className="py-4 border border-gray-200 rounded-lg bg-white "
              >
                <div className="flex items-start">
                  <div className="ml-3">
                    <h3 className="font-medium">{tag.name}</h3>
                    <p className="text-sm text-gray-600">
                      {/* Use the description if available or a placeholder */}
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

      {/* Instructional Materials Section - Matching SelectCurriculum UI */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Instructional Materials
        </label>
        <div className="space-y-4">
          {formData.instructionalMaterials &&
          formData.instructionalMaterials.length > 0 ? (
            formData.instructionalMaterials.map((material: any, i: number) => (
              <div
                key={i}
                className="py-4 border border-gray-200 rounded-lg bg-white "
              >
                <div className="flex items-start">
                  <div className="ml-3">
                    <h3 className="font-medium">{material.title}</h3>
                    <p className="text-sm text-gray-600">
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

      {/* Standard button row */}
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
          <button className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]">
            Create
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
