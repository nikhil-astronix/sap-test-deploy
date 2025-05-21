"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function MultiSelect({
  options,
  values,
  onChange,
  placeholder = "Select options",
  className = "",
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => values.includes(opt.value));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    onChange(newValues);
  };

  const removeOption = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dropdown
    onChange(values.filter((v) => v !== valueToRemove));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tags */}
      {/* <div className="flex flex-wrap gap-2 mb-2">
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-50 border border-emerald-200 text-emerald-700"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => removeOption(option.value, e)}
              className="ml-2 focus:outline-none"
            >
              <svg
                className="w-4 h-4 text-emerald-600 hover:text-emerald-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
      </div> */}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left  rounded-lg border ${className} ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            {selectedOptions?.length
              ? selectedOptions.map((option) => option.label).join(", ")
              : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={values.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="accent-emerald-600 w-4 h-4"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
