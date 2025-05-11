// app/create-user/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/userService";
import { AxiosError } from "axios";
import Stepper from "@/components/classroom/Stepper";
import { motion } from "framer-motion";
import MultiSelect from "@/components/ui/MultiSelect";
import Dropdown from "@/components/ui/Dropdown";

const steps = [
  { label: "Basic User Info", id: "basic-info" },
  { label: "District & School Selection", id: "district-selection" },
  { label: "Assign Role & User Type", id: "assign-role" },
  { label: "Review & Submit", id: "review" },
];

const roles = [
  { label: "Central Office / District", value: "Central Office / District" },
  { label: "Instructional Coach", value: "Instructional Coach" },
  {
    label: "Professional Learning Partner",
    value: "Professional Learning Partner",
  },
  { label: "School Leader", value: "School Leader" },
  { label: "State", value: "State" },
  { label: "Teacher", value: "Teacher" },
  { label: "Other", value: "Other" },
];
const userTypes = [
  { label: "Admin", value: "Admin" },
  { label: "District Viewer", value: "District Viewer" },
  { label: "Observer", value: "Observer" },
  { label: "State Admin", value: "State Admin" },
  { label: "Super Admin", value: "Super Admin" },
];
const districts = [
  { label: "District A", value: "District A" },
  { label: "District B", value: "District B" },
];
const schools = [
  { label: "School A", value: "School A" },
  { label: "School B", value: "School B" },
];

export default function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    district: [] as string[],
    school: [] as string[],
    role: "",
    userType: "",
    network: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let data = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        // state: "",
        // district: formData.district,
        // school: formData.school,
        state: "661943fd4ccf5f44a9a1a001",
        district: "661943fd4ccf5f44a9a1a002",
        school: "661943fd4ccf5f44a9a1a003",
        user_role: formData.role,
        user_type: formData.userType,
        network: "",
      };

      const response = await createUser(data);
      if (response.success) {
        router.push("/users");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-600 text-center">
            Create User
          </h1>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Enter the details below to add a new user.
          </p>
        </div>
        <div className="sticky top-0 z-10 py-4 shadow-sm">
          <Stepper steps={stepperSteps} />
        </div>
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
            <SelectDistrict
              formData={formData} // <- this must be a defined object
              onChange={handleFormChange}
              onBack={() => setCurrentStep(0)}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <SelectRole
              formData={formData}
              onChange={handleFormChange}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <div>
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name*
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFormChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name*
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleFormChange("lastName", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <MultiSelect
                  options={districts}
                  values={formData.district}
                  onChange={(values) => handleFormChange("district", values)}
                  placeholder="Assign district"
                />
              </div>

              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <MultiSelect
                  options={schools}
                  values={formData.school}
                  onChange={(values) => handleFormChange("school", values)}
                  placeholder="Assign school"
                />
              </div>

              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role*
                </label>
                <Dropdown
                  options={roles}
                  value={formData.role}
                  onChange={(value) => handleFormChange("role", value)}
                  placeholder="Select role"
                />
              </div>

              <div className="py-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type*
                </label>
                <Dropdown
                  options={userTypes}
                  value={formData.userType}
                  onChange={(value) => handleFormChange("userType", value)}
                  placeholder="Select user type"
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <div className="flex justify-between items-center space-x-4">
                  <button
                    onClick={() => router.push("/users")}
                    className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit()}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
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
          First Name*
        </label>
        <input
          type="text"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name*
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email*
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => router.push("/users")}
          className="py-2 text-gray-600 hover:text-gray-800"
        >
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

function SelectDistrict({
  formData,
  onChange,
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
  formData: any;
  onChange: (field: string, value: any) => void;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          District
        </label>
        <MultiSelect
          options={districts}
          values={formData.district}
          onChange={(values) => onChange("district", values)}
          placeholder="Assign district"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School
        </label>
        <MultiSelect
          options={schools}
          values={formData.school}
          onChange={(values) => onChange("school", values)}
          placeholder="Assign school"
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={() => router.push("/users")}
            className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:text-gray-800"
          >
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
    </div>
  );
}

function SelectRole({
  formData,
  onChange,
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
  formData: any;
  onChange: (field: string, value: any) => void;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role*
        </label>
        <Dropdown
          options={roles}
          value={formData.role}
          onChange={(value) => onChange("role", value)}
          placeholder="Select role"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User Type*
        </label>
        <Dropdown
          options={userTypes}
          value={formData.userType}
          onChange={(value) => onChange("userType", value)}
          placeholder="Select user type"
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={() => router.push("/users")}
            className="px-6 py-2 bg-[#F4F6F8] text-gray-600 rounded-lg hover:text-gray-800"
          >
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
