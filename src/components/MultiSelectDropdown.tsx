import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Option {
  id: string | number;
  label: string;
  value: string;
  email?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  placeholder?: string;
  onChange: (selectedValues: string[]) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  allowClear?: boolean;
  required?: boolean;
  isMulti?: boolean;
  showTags?: boolean;
  showEmail?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  placeholder = "Select options",
  onChange,
  className = "",
  disabled = false,
  error,
  label,
  allowClear = true,
  required = false,
  isMulti = true,
  showTags = false,
  showEmail = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(
    `dropdown-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (value: string) => {
    if (disabled) return;

    if (isMulti) {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onChange(newSelectedValues);
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange([]);
  };

  const handleRemoveTag = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedValues.filter((v) => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return "";

    if (isMulti && !showTags) {
      return `${selectedValues.length} item${
        selectedValues.length !== 1 ? "s" : ""
      } selected`;
    } else if (!isMulti) {
      const selectedOption = options.find(
        (opt) => opt.value === selectedValues[0]
      );
      return selectedOption?.label || "";
    }
    return "";
  };

  const selectedTags =
    showTags && isMulti
      ? selectedValues.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return option ? (
            <div
              key={value}
              className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full mr-2 mb-2"
            >
              <span className="text-sm">{option.label}</span>
              <button
                onClick={(e) => handleRemoveTag(e, value)}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
                disabled={disabled}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : null;
        })
      : null;

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={uniqueId.current}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {showTags && selectedTags && selectedTags.length > 0 && (
        <div className="flex flex-wrap mb-2">{selectedTags}</div>
      )}

      <div
        id={uniqueId.current}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${uniqueId.current}-listbox`}
        aria-label={label || placeholder}
        aria-disabled={disabled}
        aria-invalid={!!error}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 bg-[#E6EBF0] rounded-md 
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "cursor-pointer"
          }
          ${error ? "border-red-500" : "border-gray-300"}
          ${
            !disabled &&
            "hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          }`}
      >
        <div className="flex-grow truncate">
          {selectedValues.length > 0 && !showTags ? (
            <span className="text-gray-700">{getDisplayText()}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {allowClear && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {error && (
        <p
          className="mt-1 text-sm text-red-500"
          id={`${uniqueId.current}-error`}
        >
          {error}
        </p>
      )}

      {isOpen && !disabled && (
        <div
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
          id={`${uniqueId.current}-listbox`}
          aria-multiselectable={isMulti}
        >
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                role="option"
                aria-selected={selectedValues.includes(option.value)}
                className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer
                  ${
                    selectedValues.includes(option.value) ? "bg-emerald-50" : ""
                  }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <div className="mr-3 flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ease-in-out ${
                      selectedValues.includes(option.value)
                        ? "border-emerald-600"
                        : "border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full transform transition-all duration-200 ease-in-out ${
                        selectedValues.includes(option.value)
                          ? "bg-emerald-600 scale-100 opacity-100"
                          : "bg-emerald-600 scale-0 opacity-0"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-gray-900">{option.label}</div>
                  {showEmail && option.email && (
                    <div className="text-sm text-gray-500">{option.email}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
