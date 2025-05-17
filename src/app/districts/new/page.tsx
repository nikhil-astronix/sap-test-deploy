"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function NewDistrictPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    district: "",
    state: "",
    city: "",
    network: "",
    enrollmentRange: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

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

  const networks = [
    "Blue Ridge Charter Collaborative",
    "Cedar Grove Charter Network",
    "Charter Network",
    "Equity First School Network",
    "Foundations Education Collaborative",
    "Horizon Scholars Network",
    "Pinnacle Charter Network",
    "Sagewood School Network",
  ];

  const enrollmentRanges = [
    "Less than 100,000",
    "100,000 - 200,000",
    "200,000 - 400,000",
    "Greater than 400,000",
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      // const response = await createDistrict(formData);
      setApiSuccess("District created successfully!");
      setApiError("");
      setTimeout(() => {
        router.push("/districts");
      }, 1000);
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
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create District
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter the details below to add a new district.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District Name <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter district name"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-emerald-700">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City / Town <span className="text-emerald-700">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter city name"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
            </label>
            <select
              value={formData.network}
              onChange={(e) =>
                setFormData({ ...formData, network: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select network</option>
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment Range <span className="text-emerald-700">*</span>
            </label>
            <select
              value={formData.enrollmentRange}
              onChange={(e) =>
                setFormData({ ...formData, enrollmentRange: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-200 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select enrollment range</option>
              {enrollmentRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
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
