'use client';

import React, { useState } from 'react';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface ExistingTool {
  id: string;
  name: string;
}

export default function NewObservationToolPage() {
  const [toolName, setToolName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Mock data for existing tools
  const existingTools: ExistingTool[] = [
    { id: '1', name: 'e² Literacy Tool' },
    { id: '2', name: 'e² Math Tool' },
    { id: '3', name: 'Sample Observation Tool1' },
  ];

  const handleSaveTool = () => {
    // Implement save functionality
    console.log('Saving tool:', { toolName, selectedTool });
  };

  const handleSaveSection = () => {
    // Implement section save functionality
    console.log('Saving section');
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Deleting');
  };

  return (
    <AnimatedContainer variant="fade" className="p-8 bg-white rounded-lg shadow-sm min-h-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-medium mb-2">Observation Tool Setup</h1>
            <p className="text-gray-600 text-md">
              Configure your indicators and categories to tailor your classroom observations.
            </p>
          </div>
          <button
            onClick={handleSaveTool}
            className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Save Tool
          </button>
        </div>

        <div className="flex justify-between items-start gap-8 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-32">
                <label className="block text-gray-700 font-medium">Tool Name:</label>
              </div>
              <input
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="Enter Observation Tool Name"
                className="text-sm flex-1 p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="block text-gray-700 font-medium">Import:</label>
              </div>
              <div className="flex-1 relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-2 bg-gray-50 border rounded-lg flex items-center justify-between text-gray-500"
                >
                  <span>{selectedTool || 'Existing Observation Tool'}</span>
                  <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10"
                  >
                    {existingTools.map((tool) => (
                      <label
                        key={tool.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="tool"
                          className="mr-3 text-sm"
                          checked={selectedTool === tool.name}
                          onChange={() => {
                            setSelectedTool(tool.name);
                            setIsDropdownOpen(false);
                          }}
                        />
                        <span>{tool.name}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center  gap-4">
            <button
              onClick={handleSaveSection}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Save Section
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-4">
            <span className="text-blue-600 pb-2 border-b-2 border-blue-600">Untitled Section</span>
            <button className="text-gray-600 pb-2 border-b-2 border-transparent hover:text-blue-700">+ Add Section</button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-4 border-gray-200 shadow-md">
          <input
            type="text"
            placeholder="Untitled Section"
            className="w-full text-xl font-medium mb-4 p-2 border-b focus:outline-none focus:border-blue-700"
          />
          <textarea
            placeholder="Add Description"
            className="w-full h-24 p-2 border-b focus:outline-none focus:border-blue-700 resize-none"
          />
        </div>

        <button
          className="w-full py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
        >
          +Add Question
        </button>
      </div>
    </AnimatedContainer>
  );
} 