import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, completedSteps }) => {
  // Get the active step index
  const activeStepIndex = steps.findIndex((step) => step.id === currentStep);
  
  // Calculate progress percentage
  const calculateProgress = () => {
    // Handle edge cases
    if (steps.length <= 1 || activeStepIndex === -1) return 0;
    
    // Find the highest completed step index
    const lastCompletedIndex = completedSteps.length > 0
      ? Math.max(...completedSteps.map(id => {
          const index = steps.findIndex(step => step.id === id);
          return index >= 0 ? index : -1;
        }))
      : -1;

    // If we're on a step beyond the last completed step, include current step in progress
    const effectiveIndex = Math.max(lastCompletedIndex, activeStepIndex);
    
    // Calculate progress as a percentage
    return effectiveIndex / (steps.length - 1);
  };

  return (
    <motion.div 
      className="w-full mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* Progress Bar Container */}
        <div 
          className="absolute"
          style={{
            top: '12px',
            left: '100px',
            width: 'calc(100% - 200px)',
            height: '2px',
            backgroundColor: '#E5E7EB'
          }}
        >
          {/* Animated Progress Bar */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-emerald-600"
            style={{
              transformOrigin: 'left',
              width: '100%'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: calculateProgress() }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps Container */}
        <div className="relative grid w-full" style={{ 
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: '0'
        }}>
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1 // Stagger the animations
                  }}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center 
                      transition-all duration-200 z-10 
                      ${
                        isCompleted
                          ? 'bg-emerald-600 border-2 border-emerald-600'
                          : isCurrent
                          ? 'bg-white border-2 border-emerald-700'
                          : 'bg-gray-200 border-2 border-gray-200'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.svg
                          key="completed"
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      ) : isCurrent ? (
                        <motion.div
                          key="current"
                          className="w-2.5 h-2.5 rounded-full bg-emerald-700"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                        />
                      ) : null}
                    </AnimatePresence>
                  </motion.div>

                  {/* Step Text */}
                  <motion.div
                    className={`
                      mt-3 space-y-1 max-w-[150px] text-center
                      ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <div className="text-xs font-medium uppercase">
                      Step {index + 1}
                    </div>
                    <div className="text-sm font-semibold whitespace-normal">{step.title}</div>
                    {step.subtitle && (
                      <div className="text-xs whitespace-normal">{step.subtitle}</div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StepIndicator;