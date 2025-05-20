"use client";
import { useState, useRef, useEffect } from "react";

export default function CustomDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options
  const normalizedOptions = options.map((opt) =>
    opt ? { label: opt.label, value: opt.id } : opt
  );

  // Auto-select first option if no value is provided
  useEffect(() => {
    if (!value && normalizedOptions.length > 0) {
      onChange(normalizedOptions[0].value);
    }
  }, [value, normalizedOptions, onChange]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === value)?.label || "";

  // Limit height if more than 3 options
  const dropdownHeightClass =
    normalizedOptions.length > 3 ? "max-h-40 overflow-y-auto" : "";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border-2 rounded bg-transparent text-left focus:outline-none"
      >
        {selectedLabel}
      </button>

      {open && (
        <div
          className={`absolute z-10 mt-1 w-full rounded border bg-white shadow-lg ${dropdownHeightClass}`}
        >
          {normalizedOptions.map((option, i) => (
            <label
              key={i}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name="custom-dropdown"
                value={option.value}
                checked={value === option.value}
                onChange={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="mr-2 accent-[#2A7251]"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
