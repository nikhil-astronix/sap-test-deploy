"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step {
  label: string;
  number: number;
  status: "completed" | "current" | "upcoming";
}

interface StepperProps {
  steps: Step[];
}

export default function Stepper({ steps }: StepperProps) {
  return (
    <div className="mb-20">
      <div className="flex items-center justify-between relative ">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center relative ${
                  step.status === "completed"
                    ? index === steps.length - 1
                      ? "bg-[#6C4996]" // Last step when completed
                      : index === steps.length - 2
                      ? "bg-[#2264AC]" // Second-to-last step when completed
                      : index === steps.length - 3
                      ? "bg-[#007778]"
                      : "bg-emerald-700" // Other completed steps
                    : step.status === "current"
                    ? index === steps.length - 1
                      ? "ring-[#6C4996] bg-white ring-2" // Last step when completed
                      : index === steps.length - 2
                      ? "ring-[#2264AC] bg-white ring-2 " // Second-to-last step when completed
                      : "bg-white ring-2 ring-emerald-700"
                    : "bg-gray-200"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckIcon
                    className={`w-4 h-4 flex items-center justify-center ${
                      index === steps.length - 1
                        ? "text-white" // Last step
                        : index === steps.length - 3
                        ? "bg-[#007778] text-white" // Second-to-last step
                        : "text-white"
                    }`}
                  />
                ) : step.status === "current" ? (
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${
                      index === steps.length - 1
                        ? "bg-[#6C4996]" // Last step when current
                        : index === steps.length - 2
                        ? "bg-[#2264AC]" // Second-to-last step when current
                        : "bg-[#2A7251]" // Default color for current
                    }`}
                  />
                ) : null}
              </div>
              <div className="absolute -bottom-12  w-max text-left">
                <p className="text-[10px] text-ellipsis">STEP {step.number}</p>
                <p className="text-[12px] text-black-400">{step.label}</p>
              </div>
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`h-[4px] flex-1 mx-2 rounded-xl ${
                  steps[index].status === "completed" &&
                  steps[index + 1].status === "completed"
                    ? "bg-gradient-to-r from-[#2A7251] via-[#007778] to-[#2264AC]"
                    : steps[index].status === "completed"
                    ? "bg-gradient-to-r from-[#2A7251] via-[#007778] to-[#2264AC]"
                    : "bg-gray-200"
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
