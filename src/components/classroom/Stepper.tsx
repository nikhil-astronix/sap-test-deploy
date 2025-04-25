'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
}

export default function Stepper({ steps }: StepperProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10"
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center relative ${
                  step.status === 'completed'
                    ? 'bg-emerald-700'
                    : step.status === 'current'
                    ? 'bg-white ring-2 ring-emerald-700'
                    : 'bg-gray-200'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckIcon className="w-4 h-4 text-white" />
                ) : step.status === 'current' ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-700" />
                ) : null}
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max">
                <p className="text-sm font-medium text-gray-600">{step.label}</p>
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`h-[2px] flex-1 mx-2 ${
                  steps[index].status === 'completed' && steps[index + 1].status === 'completed'
                    ? 'bg-emerald-700'
                    : steps[index].status === 'completed'
                    ? 'bg-emerald-700'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
} 