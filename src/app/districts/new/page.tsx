"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { createDistrict, districtPayload } from "@/services/districtService";
import { getNetwork } from "@/services/networkService";
import { fetchNetworkRequestPayload } from "@/types/userData";
import { z } from "zod";

// Define schema for district validation
const districtSchema = z.object({
  district: z
    .string()
    .min(1, "District name is required")
    .max(100, "District name cannot exceed 100 characters")
    .trim(),
  state: z.string().min(1, "State is required"),
  city: z
    .string()
    .min(1, "City/Town is required")
    .max(100, "City name cannot exceed 100 characters")
    .trim(),
  network: z.string(), // Network is optional
  enrollmentRange: z.string().min(1, "Enrollment range is required"),
});

// Type inference from the schema
type DistrictFormData = z.infer<typeof districtSchema>;

export default function NewDistrictPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DistrictFormData>({
    district: "",
    state: "",
    city: "",
    network: "",
    enrollmentRange: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    district?: string;
    state?: string;
    city?: string;
    network?: string;
    enrollmentRange?: string;
  }>({});

  // Dummy data for dropdowns
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const enrollmentRanges = [
    "Less than 100,000",
    "100,000 - 200,000",
    "200,000 - 400,000",
    "Greater than 400,000",
  ];

  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    const payload: fetchNetworkRequestPayload = {
      is_archived: false,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null,
    };
    const response = await getNetwork(payload);
    if (response.success) {
      let result: any[] = [];
      response.data.networks.forEach((network: any) => {
        result.push({
          id: network.id,
          name: network.name,
        });
      });

      setNetworks(result);
    }
  };

  const handleSubmit = async () => {
    // Validate with Zod before submission
    const result = districtSchema.safeParse(formData);

    if (!result.success) {
      // Format and set validation errors
      const formattedErrors = result.error.format();
      setValidationErrors({
        district: formattedErrors.district?._errors[0],
        state: formattedErrors.state?._errors[0],
        city: formattedErrors.city?._errors[0],
        network: formattedErrors.network?._errors[0],
        enrollmentRange: formattedErrors.enrollmentRange?._errors[0],
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    setIsLoading(true);

    try {
      const payload: districtPayload = {
        name: formData.district,
        network_id: formData.network,
        state: formData.state,
        city: formData.city,
        enrollment_range: formData.enrollmentRange,
      };
      const response = await createDistrict(payload);
      if (response.success) {
        setApiSuccess("District created successfully!");
        setApiError("");
        setTimeout(() => {
          router.push("/districts");
        }, 1000);
      } else {
        setApiError("Something went wrong");
        setApiSuccess("");
      }
    } catch (error: unknown) {
      const errorMessage =
        ((error as AxiosError)?.response?.data as { message?: string })
          ?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create district. Please try again.");
      setApiError(errorMessage || "Something went wrong");
      setApiSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-lg min-h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto h-auto">
        <h1 className="text-2xl mb-6 text-center">Create District</h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter the details below to add a new district.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-[16px] text-black-400 mb-2">
              District Name <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter district name"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#F4F6F8] text-[12px] rounded-lg border ${
                validationErrors.district
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-emerald-500"
              } focus:outline-none focus:ring-1`}
            />
            {validationErrors.district && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.district}
              </p>
            )}
          </div>
          <div>
            <label className="block text-[16px] text-black-400 mb-2">
              State <span className="text-emerald-700">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#F4F6F8] text-[12px] rounded-lg border ${
                validationErrors.state
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-emerald-500"
              } focus:outline-none focus:ring-1 text-[12px] text-[#919EAB]`}
            >
              <option className="text-[12px] text-[#919EAB]" value="">
                Select state
              </option>
              {states.map((state) => (
                <option className="text-[12px]" key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {validationErrors.state && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.state}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[16px] text-black-400 mb-2">
              City / Town <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter city name"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#F4F6F8] text-[12px] rounded-lg border ${
                validationErrors.city
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-emerald-500"
              } focus:outline-none focus:ring-1`}
            />
            {validationErrors.city && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[16px] text-black-400 mb-2">
              Network
            </label>
            <select
              value={formData.network}
              onChange={(e) =>
                setFormData({ ...formData, network: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#F4F6F8] text-[12px] rounded-lg border ${
                validationErrors.network
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-emerald-500"
              } focus:outline-none focus:ring-1 text-[12px] text-[#919EAB]`}
            >
              <option className="text-[12px] text-[#919EAB]" value="">
                Select network
              </option>
              {networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
            {validationErrors.network && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.network}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[16px] text-black-400 mb-2">
              Enrollment Range <span className="text-emerald-700">*</span>
            </label>
            <select
              value={formData.enrollmentRange}
              onChange={(e) =>
                setFormData({ ...formData, enrollmentRange: e.target.value })
              }
              className={`w-full px-3 py-2 bg-[#F4F6F8] rounded-lg border ${
                validationErrors.enrollmentRange
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-emerald-500"
              } focus:outline-none focus:ring-1 text-[12px] text-[#919EAB]`}
            >
              <option className="text-[12px] " value="">
                Select enrollment range
              </option>
              {enrollmentRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            {validationErrors.enrollmentRange && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.enrollmentRange}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-6 px-2">
            <button
              onClick={() => router.push("/districts")}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
}
