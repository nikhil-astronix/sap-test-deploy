"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Stepper from "./Stepper";
import Dropdown from "../ui/Dropdown";
import MultiSelect from "../ui/MultiSelect";

const steps = [
  { label: "Basic Classroom Info", id: "basic-info" },
  { label: "Select Intervention(s)", id: "interventions" },
  { label: "Select Curriculum(s)", id: "curriculum" },
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
  });

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  const stepperSteps = steps.map((step, index) => ({
    label: step.label,
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
            onBack={() => setCurrentStep(0)}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <SelectCurriculum
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && <ReviewSubmit onBack={() => setCurrentStep(2)} />}
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
    <div className="space-y-6  h-full px-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School
        </label>
        <Dropdown
          options={sampleSchools}
          value={formData.school}
          onChange={(value) => onChange("school", value)}
          placeholder="Select a school"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course
        </label>
        <input
          type="text"
          placeholder="Enter Course Name"
          value={formData.course}
          onChange={(e) => onChange("course", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teacher
        </label>
        <input
          type="text"
          placeholder="Enter Teacher Name"
          value={formData.teacher}
          onChange={(e) => onChange("teacher", e.target.value)}
          className="w-full px-3 py-2 rounded-lg  border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class Period / Section
        </label>
        <input
          type="text"
          placeholder="Enter class period / section"
          value={formData.classPeriod}
          onChange={(e) => onChange("classPeriod", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex justify-between pt-6">
        <button className="px-6 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SelectInterventions({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200"
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="font-medium">Coaching</h3>
                <p className="text-sm text-gray-600">
                  Amplify Desmos Math promotes a collaborative classroom &
                  guides teachers as facilitator.
                </p>
              </div>
              <span className="ml-auto text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Custom
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SelectCurriculum({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200"
          >
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-emerald-600 rounded border-gray-300"
              />
              <div className="ml-3">
                <h3 className="font-medium">Amplify</h3>
                <p className="text-sm text-gray-600">
                  McGraw-Hill Education Wonders is a K-6 literacy curriculum
                  designed with a wealth of research-based print and digital
                  resources for building a strong literacy foundation.
                </p>
              </div>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Default
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ReviewSubmit({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      {/* Review content will go here */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Create
        </button>
      </div>
    </div>
  );
}
