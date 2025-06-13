import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Evidence {
  imageUrl?: string;
  pdfUrl?: string;
}

interface Section {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  sub_text?: string;
  is_mandatory: boolean;
  is_conditional: boolean;
  options?: Option[];
  sub_sections?: SubSection[];
  sub_questions?: SubQuestion[];
  observer_response?: string[];
  evidence_text?: string;
  evidence_docs?: EvidenceDoc[];
}

interface Option {
  id: string;
  text: string;
  jump_to?: string;
}

interface SubSection {
    id: string;
    name: string;
    description: string;
    questions: Question[];
}

interface SubQuestion {
    id: string;
    text: string;
    is_mandatory: boolean;
    question_type: string; // e.g., "Multiple Choice", "Free Text"
    options?: Option[];
    observer_response?: string[];
}

interface EvidenceDoc {
    name: string;
    mime_type: string;
    s3_file_key: string;
}


const LiteracyFSComponent = ({ sections }: { sections: Section[] }) => {
    console.log("sections", sections);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [evidenceTextMap, setEvidenceTextMap] = useState<{ [key: string]: string }>({});
    const [evidenceFilesMap, setEvidenceFilesMap] = useState<{ [key: string]: Evidence[] }>({});

    const imagePdfInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const pdfInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


    useEffect(() => {
        const initialSelectedOptions: { [key: string]: string } = {};
        const initialEvidenceText: { [key: string]: string } = {};
        const initialEvidenceFiles: { [key: string]: Evidence[] } = {};

        sections.forEach(section => {
            section.questions.forEach(question => {
                if (question.observer_response && question.observer_response.length > 0) {
                    initialSelectedOptions[question.id] = question.observer_response[0];
                }
                if (question.evidence_text) {
                    initialEvidenceText[question.id] = question.evidence_text;
                }
                if (question.evidence_docs && question.evidence_docs.length > 0) {
                    initialEvidenceFiles[question.id] = question.evidence_docs.map(doc => {
                        if (doc.mime_type.startsWith('image/')) {
                            return { imageUrl: doc.s3_file_key };
                        } else if (doc.mime_type === 'application/pdf') {
                            return { pdfUrl: doc.s3_file_key };
                        }
                        return {};
                    });
                }
            });
        });

        setSelectedOptions(initialSelectedOptions);
        setEvidenceTextMap(initialEvidenceText);
        setEvidenceFilesMap(initialEvidenceFiles);
    }, [sections]);

    const handleOptionSelect = (questionId: string, optionText: string) => {
        setSelectedOptions(prev => ({ ...prev, [questionId]: optionText }));
    };

    const handleEvidenceTextChange = (questionId: string, value: string) => {
        setEvidenceTextMap(prev => ({ ...prev, [questionId]: value }));
    };

    const handleFileUpload = (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileType = file.type;

        const objectUrl = URL.createObjectURL(file);

        const newEvidence: Evidence = fileType.startsWith('image/')
            ? { imageUrl: objectUrl }
            : { pdfUrl: objectUrl };

        setEvidenceFilesMap(prev => {
            const currentFiles = prev[questionId] || [];
            return { ...prev, [questionId]: [...currentFiles, newEvidence] };
        });
    };

    return (
        <div className="space-y-6 overflow-y-auto bg-[#F9F5FF] p-2 rounded-lg">
            <div className="bg-[#6C4996] text-[white] p-6 rounded-lg">
                <div className="text-center">
                    <div className="inline-block bg-[#F9F5FF] text-[#6C4996] px-4 py-1 rounded-full text-sm font-medium mb-3">
                        Lorem Ipsum
                    </div>
                    <h2 className="text-sm">
                        Are students experiencing instruction that reflects the demands of the grade level and ensures they are supported to
                        develop grade-level knowledge and skills?
                    </h2>
                </div>
            </div>

            <div className="space-y-6">
                {sections.map(section => (
                    <div key={section.id} className="space-y-4">
                        {/* You can add a section header here if needed, e.g., <h3 className="text-xl font-bold mt-4">{section.name}</h3> */}
                        {section.questions.map(question => (
                            <div key={question.id} className="border-b border-gray-200 pb-6 mb-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    {question.text} {question.is_mandatory && '*'}
                                </h3>
                                {question.sub_text && (
                                    <p className="text-gray-600 mb-4">
                                        {question.sub_text}
                                    </p>
                                )}

                                {question.options && question.options.length > 0 && (
                                    <div className="flex space-x-2 mb-6">
                                        {question.options.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleOptionSelect(question.id, option.text)}
                                                className={`px-6 py-2 rounded-md ${
                                                    selectedOptions[question.id] === option.text
                                                        ? 'bg-[#6C4996] text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {option.text}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-gray-700 mb-2">Evidence</h4>
                                    <div className="flex space-x-4 mb-4">
                                        <button
                                            type="button"
                                            className="p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
                                            onClick={() => imagePdfInputRefs.current[question.id]?.click()}
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={el => { imagePdfInputRefs.current[question.id] = el; }}
                                                onChange={(e) => handleFileUpload(question.id, e)}
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
                                            onClick={() => pdfInputRefs.current[question.id]?.click()}
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={el => { pdfInputRefs.current[question.id] = el; }}
                                                onChange={(e) => handleFileUpload(question.id, e)}
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
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {/* Display existing evidence documents. Note: For external images from s3_file_key, you might need to configure next.config.js domains. */}
                                        {evidenceFilesMap[question.id]?.map((file, index) => (
                                            <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                                                {file.imageUrl && (
                                                    <Image src={file.imageUrl} alt={`Evidence ${index}`} layout="fill" objectFit="cover" />
                                                )}
                                                {file.pdfUrl && (
                                                    <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full flex items-center justify-center text-blue-500 text-xs p-1 text-center">
                                                        PDF: {file.pdfUrl.split('/').pop()}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full p-3 border border-[#E8E9EB] bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Start writing here..."
                                        value={evidenceTextMap[question.id] || ''}
                                        onChange={(e) => handleEvidenceTextChange(question.id, e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>


        </div>
    );
};

export default LiteracyFSComponent; 