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
  showSelectedTags?: boolean;
  showSlectedOptions?: boolean; // Preserved prop name in case used elsewhere
  isGrade?: boolean; // 👈 Only show "Select All" if true
}

export default function MultiSelect({
  options,
  values = [],
  onChange,
  placeholder = "Select options",
  className = "",
  error,
  showSelectedTags = false,
  showSlectedOptions = true,
  isGrade = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalValues, setInternalValues] = useState<string[]>(values || []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValues(values || []);
  }, [values]);

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
    const newValues = internalValues.includes(value)
      ? internalValues.filter((v) => v !== value)
      : [...internalValues, value];
    setInternalValues(newValues);
    onChange(newValues);
  };

  const removeOption = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = internalValues.filter((v) => v !== valueToRemove);
    setInternalValues(newValues);
    onChange(newValues);
  };

  const clearAllOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValues([]);
    onChange([]);
  };

  const selectedOptions =
    options?.filter((opt) => internalValues.includes(opt.value)) || [];

  const hasOptions = Array.isArray(options) && options.length > 0;
  const hasSelectedOptions = selectedOptions.length > 0;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected =
    isGrade && options.length > 0 && internalValues.length === options.length;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showSelectedTags && hasSelectedOptions && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-emerald-50 border border-emerald-200 text-emerald-700"
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
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left rounded-lg border ${
          error ? "border-red-500" : "border-gray-200"
        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <span
            className={`${
              hasSelectedOptions ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {showSlectedOptions && hasSelectedOptions
              ? selectedOptions.map((option) => option.label).join(", ")
              : placeholder}
          </span>
          <div className="flex items-center">
            {hasSelectedOptions && showSlectedOptions && (
              <button
                type="button"
                onClick={clearAllOptions}
                className="mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear all selections"
              >
                <svg
                  className="w-4 h-4"
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
            )}
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
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto"
            role="listbox"
            aria-multiselectable="true"
          >
            {/* Search Input */}
            <div className="px-3 py-2">
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* "Select All" only if isGrade === true */}
            {isGrade && filteredOptions.length > 0 && (
              <label className="flex items-center px-4 py-2 hover:bg-emerald-50 space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-emerald-600 w-4 h-4"
                  checked={allSelected}
                  onChange={() => {
                    const newValues = allSelected
                      ? []
                      : options.map((opt) => opt.value);
                    setInternalValues(newValues);
                    onChange(newValues);
                  }}
                />
                <span
                  className={`${
                    allSelected
                      ? "font-medium text-emerald-700"
                      : "text-gray-700"
                  }`}
                >
                  Select All
                </span>
              </label>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = internalValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={`flex items-center px-4 py-2 hover:bg-emerald-50 space-x-2 cursor-pointer ${
                      isSelected ? "bg-emerald-50" : ""
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.value)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <span
                      className={`${
                        isSelected
                          ? "font-medium text-emerald-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No options found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
