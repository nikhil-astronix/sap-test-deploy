"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createInterventions } from "@/services/interventionService";
import {
  CreateIntervention,
  Intervention,
  InterventionType,
} from "@/types/interventionData";
import { z } from "zod";

// Define schema for intervention validation
const interventionSchema = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim(),
  type: z.enum(["Default", "Custom"], {
    errorMap: () => ({ message: "Please select a valid type" }),
  }),
  district_id: z.string().min(1, "District ID is required"),
});

// Type inference from the schema
type InterventionFormData = z.infer<typeof interventionSchema>;

export default function NewInterventionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<InterventionFormData>({
    name: "",
    description: "",
    type: InterventionType.Default,
    district_id: "661943fd4ccf5f44a9a1a002",
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
    type?: string;
    district_id?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod before submission
    const result = interventionSchema.safeParse(formData);

    if (!result.success) {
      // Format and set validation errors
      const formattedErrors = result.error.format();
      setValidationErrors({
        name: formattedErrors.name?._errors[0],
        description: formattedErrors.description?._errors[0],
        type: formattedErrors.type?._errors[0],
        district_id: formattedErrors.district_id?._errors[0],
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const response = await createInterventions({
        ...formData,
        type: formData.type as InterventionType,
      });
      router.push("/interventions");
    } catch (error) {
      console.error("Failed to create intervention:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="new-intervention-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="p-8 w-full max-w-full min-h-full bg-white rounded-lg shadow-md"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <div className="text-[24px] mb-2 text-center text-black font-medium">
            Tags & Attributes
          </div>
          <p className="text-black-400 text-center text-[16px]">
            Add unique attributes to collect data across your system.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 px-48 ">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label
              htmlFor="title"
              className="block text-[16px] text-black-400 mb-1"
            >
              Title <span className="text-emerald-700">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              id="title"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full text-sm px-4 py-2 bg-gray-100 text-[12px] rounded-lg focus:outline-none focus:ring-1 ${
                validationErrors.name
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500 focus:border-transparent"
              }`}
              placeholder="Title"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label
              htmlFor="description"
              className="block text-[16px] text-black-400 mb-1"
            >
              Description <span className="text-emerald-700">*</span>
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full text-sm px-4 py-2 bg-gray-100 text-[12px] rounded-lg focus:outline-none focus:ring-1 min-h-[90px] ${
                validationErrors.description
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500 focus:border-transparent"
              }`}
              placeholder="Add your description here"
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.description}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <label className="block text-[16px] text-black-400 mb-1">
              Type <span className="text-emerald-700">*</span>
            </label>
            <div className="flex gap-4 text-sm flex-col">
              {(["Default", "Custom"] as const).map((type, index) => (
                <motion.label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "Default" | "Custom",
                        })
                      }
                      className="sr-only"
                    />
                    <motion.div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.type === type
                          ? "border-emerald-700"
                          : "border-gray-300"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {formData.type === type && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full" />
                      )}
                    </motion.div>
                  </div>
                  <span className="text-[#111111]-400 text-[14px]">{type}</span>
                </motion.label>
              ))}
            </div>
            {validationErrors.type && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.type}
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex gap-4 justify-end pt-4 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/interventions")}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-50 transition-colors mr-auto"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
