'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeSelection = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dropdown
    onChange('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tag */}
      {selectedOption && (
        <div className="flex flex-wrap gap-2 mb-2">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-50 border border-emerald-200 text-emerald-700"
          >
            {selectedOption.label}
            <button
              type="button"
              onClick={removeSelection}
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
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left bg-white rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors`}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{placeholder}</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
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
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                  option.value === value ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="flex-shrink-0 w-4 h-4 border-2 rounded-full flex items-center justify-center">
                  {option.value === value && (
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  )}
                </div>
                <span className={option.value === value ? 'text-emerald-600' : 'text-gray-700'}>
                  {option.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
} 