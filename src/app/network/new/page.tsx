"use client";
import React, { useState } from "react";
import { createNetwork } from "@/services/networkService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { z } from "zod";

// Define schema for network validation
const networkSchema = z.object({
  network: z
    .string()
    .min(1, "Network name is required")
    .max(50, "Network name cannot exceed 50 characters")
    .trim(),
});

// Type inference from the schema
type NetworkFormData = z.infer<typeof networkSchema>;

export default function NewNetworkPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NetworkFormData>({
    network: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    network?: string;
  }>({});

  const handleSubmit = async () => {
    // Validate with Zod before submission
    const result = networkSchema.safeParse(formData);

    if (!result.success) {
      // Format and set validation errors
      const formattedErrors = result.error.format();
      setValidationErrors({
        network: formattedErrors.network?._errors[0],
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    setIsLoading(true);

    try {
      let data = {
        name: formData.network,
      };
      const response = await createNetwork(data);
      if (response.success) {
        setApiSuccess("Network created successfully!");
        setApiError("");
        setTimeout(() => {
          router.push("/network");
        }, 1000);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
      setApiError(errorMessage || "Something went wrong");
      setApiSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-lg min-h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto h-auto">
        <h1 className="text-2xl font-medium  my-6 text-center">
          Create Network
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter the details below to add a new network.
        </p>

        <div>
          <label className="block text-[16px] text-black-400 mb-2">
            Network <span className="text-emerald-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter network name"
            value={formData.network}
            onChange={(e) =>
              setFormData({ ...formData, network: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg border text-[12px] bg-[#F4F6F8] ${
              validationErrors.network
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-emerald-500"
            } focus:outline-none focus:ring-1`}
          />
          {validationErrors.network && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.network}
            </p>
          )}
          <div className="flex justify-end mt-6 px-2 ">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add"}
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
