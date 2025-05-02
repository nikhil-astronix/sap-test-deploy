import React, { useState } from 'react';
import Image from 'next/image';

interface Evidence {
  imageUrl?: string;
  pdfUrl?: string;
}

const LiteracyFSComponent = () => {
  const [selectedOption, setSelectedOption] = useState<'Yes' | 'No' | 'Could not Determine'>('Yes');
  const [targetedSkills, setTargetedSkills] = useState('');
  const [evidence, setEvidence] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<Evidence[]>([]);

  const handleOptionSelect = (option: 'Yes' | 'No' | 'Could not Determine') => {
    setSelectedOption(option);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white p-6 rounded-lg">
        <div className="text-center">
          <div className="inline-block bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-3">
            Lorem Ipsum
          </div>
          <h2 className="text-xl">
            Are students experiencing instruction that reflects the demands of the grade level and ensures they are supported to
            develop grade-level knowledge and skills?
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            1 FSI A. The foundational skill(s) reflect grade-level standards.*
          </h3>
          <p className="text-gray-600 mb-4">
            Students practice grade-level foundational skills (print concepts; phonological (and phonemic) awareness; phonics and
            word recognition; fluency).
          </p>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => handleOptionSelect('Yes')}
              className={`px-6 py-2 rounded-md ${
                selectedOption === 'Yes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleOptionSelect('No')}
              className={`px-6 py-2 rounded-md ${
                selectedOption === 'No'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-gray-700 mb-2">Targeted Skills (Optional)</h4>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start writing here..."
                value={targetedSkills}
                onChange={(e) => setTargetedSkills(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <h4 className="text-gray-700 mb-2">Evidence</h4>
              <div className="flex space-x-4 mb-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    multiple
                  />
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf"
                  />
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start writing here..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            1 FSI B. The foundational skill(s) reflect grade-level standards.
          </h3>
          <p className="text-gray-600 mb-4">
            Students practice grade-level foundational skills (print concepts; phonological (and phonemic) awareness; phonics and
            word recognition; fluency).
          </p>

          <div className="flex space-x-2 mb-6">
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white"
            >
              Yes
            </button>
            <button
              className="px-6 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              No
            </button>
            <button
              className="px-6 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Could not Determine
            </button>
          </div>

          <div>
            <h4 className="text-gray-700 mb-2">Evidence</h4>
            <div className="flex space-x-4 mb-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  multiple
                />
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf"
                />
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start writing here..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50">
          Exit
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Finish
        </button>
      </div>
    </div>
  );
};

export default LiteracyFSComponent; 