// app/create-user/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/userService";
import { AxiosError } from "axios";
import Stepper from "@/components/classroom/Stepper";
import { motion } from "framer-motion";
import MultiSelect from "@/components/ui/MultiSelect";
import Dropdown from "@/components/ui/Dropdown";
import { number, z } from "zod";
import { getNetwork } from "@/services/networkService";
import { getSchools } from "@/services/schoolService";
import {
  fetchAllDistricts,
  fetchAllDistrictsByNetwork,
} from "@/services/districtService";
import { getDistrictsPayload } from "@/services/districtService";
import Header from "@/components/Header";

interface ErrorResponse {
  message: string;
}

const steps = [
  { label: "Basic User Info", id: "basic-info", number: 1 },
  { label: "District & School Selection", id: "district-selection", number: 2 },
  { label: "Assign Role & User Type", id: "assign-role", number: 3 },
  { label: "Review & Submit", id: "review", number: 4 },
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
  { label: "Network Admin", value: "Network Admin" },
  { label: "Super Admin", value: "Super Admin" },
];
const districts1 = [
  { label: "District A", value: "District A" },
  { label: "District B", value: "District B" },
];

// Validation schemas per step
const StepSchemas = [
  z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
  }),
  z.object({
    district: z.string(),
    school: z.string(),
    network: z.string(),
  }),
  z.object({
    role: z.string().min(1, "Role is required"),
    userType: z.string().min(1, "User type is required"),
  }),
];

// Combine all for final submission
const FinalSchema = StepSchemas.reduce((merged, schema) =>
  merged.merge(schema)
);

type Option = { value: string; label: string };

export default function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    district: "",
    school: "",
    role: "",
    userType: "",
    network: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [networks, setNetworks] = useState<Option[]>([]);
  const [schools, setSchools] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);

  useEffect(() => {
    getNetworks();
  }, []);

  const fetchAllDistrictsInfo = async () => {
    const payload: getDistrictsPayload = {
      is_archived: null,
      network_id: null,
      sort_by: null,
      sort_order: null,
      page: 1,
      limit: 100,
      search: null,
    };
    const response = await fetchAllDistricts(payload);
    if (response.success) {
      const formattedDistricts = response.data.districts.map(
        (district: any) => ({
          value: district._id,
          label: district.name,
        })
      );
      setDistricts(formattedDistricts);
    } else {
      setDistricts([]);
    }
  };

  const getNetworks = async () => {
    const requestPayload = {
      is_archived: false,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null, // Don't send empty strings
    };

    const response = await getNetwork(requestPayload);
    const formattedNetworks = response.data.networks.map((network: any) => ({
      value: network.id,
      label: network.name,
    }));

    setNetworks(formattedNetworks);
    console.log("responseresponseresponse", response);
  };

  const getSchoolData = async () => {
    const requestPayload = {
      is_archived: null,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null,
    };

    const response = await getSchools(requestPayload);
    const formattedSchools = response.data.schools.map((school: any) => ({
      value: school.id,
      label: school.name,
    }));

    setSchools(formattedSchools);
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  const stepperSteps = steps.map((step, index) => ({
    label: step.label,
    number: step.number,
    status: getStepStatus(index) as "completed" | "current" | "upcoming",
  }));

  const getDistrictOptions = async (networkId: string) => {
    try {
      const response = await fetchAllDistrictsByNetwork(networkId);
      if (response.success) {
        console.log("response.data.districts", response);
        const formattedDistricts = response.data.map((district: any) => ({
          value: district.id,
          label: district.name,
        }));
        setDistricts(formattedDistricts);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      setDistricts([]);
      console.error("Error fetching districts:", error);
      return [];
    }
  };

  const getSchoolOptions = async (districtId: string) => {
    try {
      const requestPayload = {
        is_archived: false,
        sort_by: null,
        sort_order: null,
        curr_page: 1,
        per_page: 100,
        search: null,
        district_id: districtId,
      };

      const response = await getSchools(requestPayload);
      const formattedSchools = response.data.schools.map((school: any) => ({
        value: school.id,
        label: school.name,
      }));

      setSchools(formattedSchools);
    } catch (error) {
      setSchools([]);
      console.error("Error fetching schools:", error);
      return [];
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "network") {
      try {
        console.log("jelloo", formData, field, value);
        setFormData({
          ...formData,
          [field]: value,
          district: "",
          school: "",
        });

        getDistrictOptions(value);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }

    if (field === "district") {
      try {
        console.log("jelloo", formData, field, value);
        setFormData({
          ...formData,
          [field]: value,
          school: "",
        });

        getSchoolOptions(value);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateFinal();
    if (!isValid) return;
    setIsLoading(true);
    try {
      let data = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        district: formData.district,
        school: formData.school,
        user_role: formData.role,
        user_type: formData.userType,
        network: formData.network,
      };

      const response = await createUser(data);
      if (response.success) {
        setApiSuccess("User created successfully!");
        setApiError("");
        setTimeout(() => {
          router.push("/users");
        }, 1000);
      } else {
        if (response.error && (response.error as AxiosError).isAxiosError) {
          const axiosError = response.error as AxiosError<{ detail: string }>;
          const errorMessage =
            axiosError.response?.data?.detail || "Unknown error";
          console.log("responseeee", errorMessage);
          setApiError(errorMessage);
          setApiSuccess("");
        } else {
          setApiError("An unknown error occurred.");
        }
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
      setIsLoading(false);
    }
  };

  const validateStep = async (stepIndex: number) => {
    const schema = StepSchemas[stepIndex];
    try {
      await schema.parseAsync(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const stepErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) stepErrors[e.path[0] as string] = e.message;
        });
        setErrors(stepErrors);
      }
      return false;
    }
  };

  const validateFinal = async () => {
    try {
      await FinalSchema.parseAsync(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const finalErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) finalErrors[e.path[0] as string] = e.message;
        });
        setErrors(finalErrors);
      }
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full">
      <div className="max-w-3xl mx-auto h-auto">
        {/* <div>
          <h1 className="text-[24px] text-black font-medium text-center">
            Create User
          </h1>
          <p className="mt-1 text-[16px] text-[#454F5B]-400 text-center">
            Enter the details below to add a new user.
          </p>
        </div> */}
        <Header
          title="Create User"
          description="Enter the details below to add a new user."
        />
        <div className="sticky top-0 z-10 pt-0 pb-2 bg-white">
          <Stepper steps={stepperSteps} />
        </div>
        <div className="max-w-2xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {currentStep === 0 && (
              <BasicInfo
                formData={formData}
                onChange={handleFormChange}
                onNext={async () => {
                  const valid = await validateStep(0);
                  if (valid) setCurrentStep(1);
                }}
                errors={errors}
              />
            )}
            {currentStep === 1 && (
              <SelectDistrict
                formData={formData} // <- this must be a defined object
                onChange={handleFormChange}
                onBack={() => setCurrentStep(0)}
                onNext={async () => {
                  const valid = await validateStep(1);
                  if (valid) setCurrentStep(2);
                }}
                errors={errors}
                schools={schools}
                districts={districts}
                networks={networks}
              />
            )}
            {currentStep === 2 && (
              <SelectRole
                formData={formData}
                onChange={handleFormChange}
                onBack={() => setCurrentStep(1)}
                onNext={async () => {
                  const valid = await validateStep(2);
                  if (valid) setCurrentStep(3);
                }}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <div>
                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    First Name <span className="text-[#2A7251]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFormChange("firstName", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8] border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    Last Name <span className="text-[#2A7251]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8] border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    Email <span className="text-[#2A7251]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8] border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[16px] text-balck-400 mb-2">
                    Network
                  </label>
                  <Dropdown
                    options={networks}
                    value={formData.network}
                    onChange={(values) => handleFormChange("network", values)}
                    placeholder="Select network"
                  />
                  {errors.network && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.network}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    District
                  </label>
                  <Dropdown
                    options={districts}
                    value={formData.district}
                    onChange={(values) => handleFormChange("district", values)}
                    placeholder="Assign district"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    School
                  </label>
                  <Dropdown
                    options={schools}
                    value={formData.school}
                    onChange={(values) => handleFormChange("school", values)}
                    placeholder="Assign school"
                  />
                  {errors.school && (
                    <p className="text-red-500 text-sm mt-1">{errors.school}</p>
                  )}
                </div>

                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    Role <span className="text-[#2A7251]">*</span>
                  </label>
                  <Dropdown
                    options={roles}
                    value={formData.role}
                    onChange={(value) => handleFormChange("role", value)}
                    placeholder="Select role"
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </div>

                <div className="py-2">
                  <label className="block text-[16px] text-balck-400 mb-2">
                    User Type <span className="text-[#2A7251]">*</span>
                  </label>
                  <Dropdown
                    options={userTypes}
                    value={formData.userType}
                    onChange={(value) => handleFormChange("userType", value)}
                    placeholder="Select user type"
                  />
                  {errors.userType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userType}
                    </p>
                  )}
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
                      className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
            {apiError && (
              <div className="bg-red-100 text-red-800 p-3 rounded mb-4 mt-[10px]">
                {apiError}
              </div>
            )}

            {apiSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded mb-4 mt-[10px]">
                {apiSuccess}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BasicInfo({
  formData,
  onChange,
  onNext,
  errors,
}: {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  errors: Record<string, string>;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6  h-full px-4">
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          First Name <span className="text-[#2A7251]">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8]  border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          Last Name <span className="text-[#2A7251]">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8]  border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          Email <span className="text-[#2A7251]">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#F4F6F8]  border-none focus:outline-none focus:ring-0 placeholder:text-[#919EAB]-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
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
          className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]"
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
  errors,
  networks,
  schools,
  districts,
}: {
  onBack: () => void;
  onNext: () => void;
  networks: Option[];
  schools: Option[];
  districts: Option[];
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">Network</label>
        <Dropdown
          options={networks}
          value={formData.network}
          onChange={(values) => onChange("network", values)}
          placeholder="Select network"
        />
        {errors.network && (
          <p className="text-red-500 text-sm mt-1">{errors.network}</p>
        )}
      </div>
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          District
        </label>
        <Dropdown
          options={districts}
          value={formData.district}
          onChange={(values) => onChange("district", values)}
          placeholder="Assign district"
        />
        {errors.district && (
          <p className="text-red-500 text-sm mt-1">{errors.district}</p>
        )}
      </div>

      <div>
        <label className="block text-[16px] text-balck-400 mb-2">School</label>
        <Dropdown
          options={schools}
          value={formData.school}
          onChange={(values) => onChange("school", values)}
          placeholder="Assign school"
        />
        {errors.school && (
          <p className="text-red-500 text-sm mt-1">{errors.school}</p>
        )}
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
            className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]"
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
  errors,
}: {
  onBack: () => void;
  onNext: () => void;
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          Role <span className="text-[#2A7251]">*</span>
        </label>
        <Dropdown
          options={roles}
          value={formData.role}
          onChange={(value) => onChange("role", value)}
          placeholder="Select role"
        />
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      <div>
        <label className="block text-[16px] text-balck-400 mb-2">
          User Type <span className="text-[#2A7251]">*</span>
        </label>
        <Dropdown
          options={userTypes}
          value={formData.userType}
          onChange={(value) => onChange("userType", value)}
          placeholder="Select user type"
        />
        {errors.userType && (
          <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
        )}
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
            className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]"
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
        <button className="px-6 py-2 bg-[#2A7251] text-white rounded-lg hover:bg-[#2A7251]">
          Create
        </button>
      </div>
    </div>
  );
}
