import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface Evidence {
  imageUrl?: string;
  pdfUrl?: string;
}

interface Option {
  id: string;
  text: string;
  jump_to?: string;
}

interface SubQuestion {
  id: string;
  text: string;
  is_mandatory: boolean;
  question_type: string;
  options: Option[];
  observer_response: any;
}

interface Question {
  id: string;
  text: string;
  sub_text?: string;
  is_mandatory: boolean;
  is_conditional?: boolean;
  options: Option[];
  sub_sections?: any[]; // This will need a more specific type later
  sub_questions?: SubQuestion[];
  observer_response: any;
  evidence_text?: string;
  evidence_docs?: any[];
}

const QuestionCard = ({ question }: { question: Question }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(question.observer_response && question.observer_response.length > 0 ? question.observer_response[0] : null);
  const [targetedSkills, setTargetedSkills] = useState(question.evidence_text || '');
  const [evidence, setEvidence] = useState(question.evidence_text || '');
  const [evidenceFiles, setEvidenceFiles] = useState<Evidence[]>(question.evidence_docs || []);
  const [selectedSubSection, setSelectedSubSection] = useState<string | null>(null);


  const imagePdfInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleOptionSelect = (optionText: string) => {
    setSelectedOption(optionText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileType = file.type;
    
    const objectUrl = URL.createObjectURL(file);
    
    const newEvidence: Evidence = fileType.startsWith('image/') 
      ? { imageUrl: objectUrl }
      : { pdfUrl: objectUrl };
      
    setEvidenceFiles(prev => [...prev, newEvidence]);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#EFF7FF] rounded-xl shadow-md">
      <div className="bg-[#2264AC] rounded-xl p-6 mb-4 flex flex-col items-center justify-between">
        <div className="inline-block bg-[#EFF7FF] text-[#2264AC]  px-4 py-1 rounded-full text-xs font-medium mb-3 ">Core Question 1</div>
        <div className="text-white text-center text-sm  mb-2">
          {question.text}
          {question.sub_text && <span className="block text-xs text-gray-300">{question.sub_text}</span>}
        </div>
      </div>

      {question.sub_sections && question.sub_sections.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSectionSelect" className="block text-sm font-medium text-gray-700">Select Sub-Section:</label>
          <select
            id="subSectionSelect"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedSubSection || ''}
            onChange={(e) => setSelectedSubSection(e.target.value)}
          >
            <option value="">Select a sub-section</option>
            {question.sub_sections.map((subSection: any) => (
              <option key={subSection.id} value={subSection.id}>
                {subSection.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubSection && question.sub_sections && question.sub_sections.find(ss => ss.id === selectedSubSection)?.questions.map((subSectionQuestion: any) => (
        <div key={subSectionQuestion.id} className="space-y-3 flex-1">
          <div className="">
            <div className="font-semibold mb-1 text-sm">{subSectionQuestion.text}</div>
            {subSectionQuestion.sub_text && <p className="text-gray-600 mb-4">{subSectionQuestion.sub_text}</p>}

            <div className="flex space-x-2 mb-6">
              {subSectionQuestion.options.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.text)}
                  className={`px-6 py-2 rounded-md ${option.text === selectedOption
                      ? 'bg-[#6C4996] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {subSectionQuestion.sub_questions && subSectionQuestion.sub_questions.map((sq: any) => (
              <div key={sq.id} className="mt-4">
                <h4 className="text-gray-700 mb-2">{sq.text} {sq.is_mandatory && '*'}</h4>
                {sq.question_type === 'Multiple Choice' ? (
                  <div className="flex space-x-2">
                    {sq.options.map((option: any) => (
                      <button
                        key={option.id}
                        className={`px-4 py-2 rounded-md ${sq.observer_response && sq.observer_response.includes(option.text) ? 'bg-[#6C4996] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="w-full p-3 border border-[#E8E9EB] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start writing here..."
                    rows={3}
                    defaultValue={sq.observer_response || ''}
                  />
                )}
              </div>
            ))}

            {(subSectionQuestion.evidence_text !== null || subSectionQuestion.evidence_docs !== null) && (
              <div>
                <h4 className="text-gray-700 mb-2">Evidence</h4>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
                    onClick={() => imagePdfInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={imagePdfInputRef}
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
                  <button
                    type="button"
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={pdfInputRef}
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
                  className="w-full p-3 border border-[#E8E9EB] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start writing here..."
                  rows={3}
                  defaultValue={subSectionQuestion.evidence_text || ''}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {subSectionQuestion.evidence_docs && subSectionQuestion.evidence_docs.map((file: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      {file.imageUrl && <Image src={file.imageUrl} alt="preview" width={20} height={20} className="rounded" />}
                      {file.pdfUrl && <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">PDF</a>}
                      <span>{file.name || `File ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {!selectedSubSection && (
        <div className="space-y-3 flex-1">
          <div className="">
            {question.options && question.options.length > 0 && (
              <div className="flex space-x-2 mb-6">
                {question.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.text)}
                    className={`px-6 py-2 rounded-md ${option.text === selectedOption
                        ? 'bg-[#6C4996] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {question.sub_questions && question.sub_questions.map((sq: any) => (
              <div key={sq.id} className="mt-4">
                <h4 className="text-gray-700 mb-2">{sq.text} {sq.is_mandatory && '*'}</h4>
                {sq.question_type === 'Multiple Choice' ? (
                  <div className="flex space-x-2">
                    {sq.options.map((option: any) => (
                      <button
                        key={option.id}
                        className={`px-4 py-2 rounded-md ${sq.observer_response && sq.observer_response.includes(option.text) ? 'bg-[#6C4996] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="w-full p-3 border border-[#E8E9EB] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start writing here..."
                    rows={3}
                    defaultValue={sq.observer_response || ''}
                  />
                )}
              </div>
            ))}

            {(question.evidence_text !== null || question.evidence_docs !== null) && (
              <div>
                <h4 className="text-gray-700 mb-2">Evidence</h4>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
                    onClick={() => imagePdfInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={imagePdfInputRef}
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
                  <button
                    type="button"
                    className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={pdfInputRef}
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
                  className="w-full p-3 border border-[#E8E9EB] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start writing here..."
                  rows={3}
                  defaultValue={question.evidence_text || ''}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.evidence_docs && question.evidence_docs.map((file: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      {file.imageUrl && <Image src={file.imageUrl} alt="preview" width={20} height={20} className="rounded" />}
                      {file.pdfUrl && <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">PDF</a>}
                      <span>{file.name || `File ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default QuestionCard; 