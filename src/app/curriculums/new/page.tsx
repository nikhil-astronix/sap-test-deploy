"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createCurriculum } from "@/services/curriculumsService";
import { createCurriculumPayload } from "@/models/curriculum";
import { z } from "zod";
import Header from "@/components/Header";

// Define schema for curriculum validation
const curriculumSchema = z.object({
  title: z
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
});

// Type inference from the schema
type CurriculumFormData = z.infer<typeof curriculumSchema>;

const NewCurriculumPage = () => {
  const [formData, setFormData] = useState<CurriculumFormData>({
    title: "",
    description: "",
    type: "Default",
  });
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    description?: string;
    type?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod before submission
    const result = curriculumSchema.safeParse(formData);

    if (!result.success) {
      // Format and set validation errors
      const formattedErrors = result.error.format();
      setValidationErrors({
        title: formattedErrors.title?._errors[0],
        description: formattedErrors.description?._errors[0],
        type: formattedErrors.type?._errors[0],
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const curriculumPayload: createCurriculumPayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
      };

      const response = await createCurriculum(curriculumPayload);
      if (response.success) {
        console.log("Curriculum created!", response.data);
        window.history.back();
      } else {
        console.error("Failed to create curriculum:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md min-h-full">
      <div className="max-w-3xl mx-auto h-auto">
        <Header
          title="Instructional Materials"
          description="Create, view and manage instructional materials in one place."
        />
      </div>

      <div className="px-40 py-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label className="block text-[16px] text-black-400 mb-1">
              Title <span className="text-[#2A7251]">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-4 py-2  bg-gray-100 rounded-lg focus:outline-none focus:ring-1 ${
                validationErrors.title
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.title}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label className="block text-[16px] text-black-400 mb-1">
              Description <span className="text-[#2A7251]">*</span>
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              placeholder="Add your description here"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-4 py-2  bg-gray-100 rounded-lg focus:outline-none focus:ring-1 min-h-[90px] ${
                validationErrors.description
                  ? "border border-red-500 focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
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
            <label className="block text-sm font-medium mb-1">
              Type <span className="text-[#2A7251]">*</span>
            </label>
            <div className="flex gap-4 text-sm flex-col">
              {(["Default", "Custom"] as const).map((option, index) => (
                <motion.label
                  key={option}
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
                      value={option}
                      checked={formData.type === option}
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
                        formData.type === option
                          ? "border-emerald-700"
                          : "border-gray-300"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {formData.type === option && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full" />
                      )}
                    </motion.div>
                  </div>
                  <span>{option}</span>
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
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-[6px] transition-colors mr-auto"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="bg-emerald-700 text-white px-8 py-2 rounded-[6px] hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default NewCurriculumPage;
