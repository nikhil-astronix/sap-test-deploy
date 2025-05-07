// app/create-user/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

import { Check } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/userService";
import { AxiosError } from "axios";

const steps = [
  { label: "Basic User Info" },
  { label: "District & School Selection" },
  { label: "Assign Role & User Type" },
  { label: "Review & Submit" },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  district: string;
  school: string;
  role: string;
  userType: string;
};

const fields: { key: keyof FormData; label: string; required?: boolean }[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "district", label: "District" },
  { key: "school", label: "School" },
  { key: "role", label: "Role", required: true },
  { key: "userType", label: "User Type", required: true },
];

const roles = [
  "Central Office / District",
  "Instructional Coach",
  "Professional Learning Partner",
  "School Leader",
  "State",
  "Teacher",
  "Other",
];
const userTypes = [
  "Admin",
  "District Viewer",
  "Observer",
  "State Admin",
  "Super Admin",
];
const districts = ["District A", "District B"];
const schools = ["School A", "School B"];

export default function CreateUserForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    district: "",
    school: "",
    role: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

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
      };

      console.log("datadatadata", data);
      const response = await createUser(data);

      console.log("responseresponseresponse", response);
      // Store tokens and user data
      // localStorage.setItem("userEmail", formData.email);
      // localStorage.setItem("userName", formData.email.split("@")[0]);

      // localStorage.setItem("role", formData.role);
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
          <StepIndicator step={step} />
        </div>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[600px]">
            {step === 1 && (
              <div className="space-y-4">
                <FormField label="First Name*" htmlFor="firstName">
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </FormField>

                <FormField label="Last Name*" htmlFor="lastName">
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </FormField>
                <FormField label="Email*" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleChange("district", value)}
                >
                  <SelectTrigger label="District" />
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.school}
                  onValueChange={(value) => handleChange("school", value)}
                >
                  <SelectTrigger label="School" />
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger label="Role" />
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleChange("userType", value)}
                >
                  <SelectTrigger label="User Type" />
                  <SelectContent>
                    {userTypes.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <FormField label="First Name*" htmlFor="firstName">
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </FormField>

                <FormField label="Last Name*" htmlFor="lastName">
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </FormField>
                <FormField label="Email*" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </FormField>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleChange("district", value)}
                >
                  <SelectTrigger label="District" />
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.school}
                  onValueChange={(value) => handleChange("school", value)}
                >
                  <SelectTrigger label="School" />
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger label="Role" />
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleChange("userType", value)}
                >
                  <SelectTrigger label="User Type" />
                  <SelectContent>
                    {userTypes.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <div>
                {step > 1 ? (
                  <Button variant="ghost" onClick={back}>
                    Back
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => router.push("/users")}>
                    Cancel
                  </Button>
                )}
              </div>

              <div className="space-x-2">
                {step < 4 ? (
                  <>
                    {step > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => router.push("/users")}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button onClick={next}>Next</Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/users")}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => handleSubmit()}>Create</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex justify-between items-center w-full px-6 max-w-6xl mx-auto">
      {steps.map((s, index) => {
        const isCompleted = index + 1 < step;
        const isActive = index + 1 === step;
        const isUpcoming = index + 1 > step;

        return (
          <div
            key={index}
            className="relative flex flex-1 flex-col items-center"
          >
            {/* Step circle */}
            <div
              className={clsx(
                "z-10 w-7 h-7 rounded-full flex items-center justify-center border-2",
                isCompleted && "bg-emerald-600 border-emerald-600 text-white",
                isActive && "border-emerald-600 bg-white text-emerald-600",
                isUpcoming && "bg-[#E2E6EA] border-[#E2E6EA] text-gray-500"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
              )}
            </div>

            {/* Step label */}
            <div className="mt-2 text-center">
              <div className="text-[10px] text-gray-500 font-medium">
                STEP {index + 1}
              </div>
              <div className="text-sm font-medium text-black">{s.label}</div>
            </div>

            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className="absolute top-[13px] left-full w-full h-0.5 ml-[-1px]">
                <div
                  className={clsx(
                    "w-full h-full",
                    index + 1 < step
                      ? "bg-gradient-to-r from-emerald-600 to-indigo-500"
                      : "bg-[#E2E6EA]"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
