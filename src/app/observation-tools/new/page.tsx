'use client';

import React, { useState, useRef } from 'react';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { Trash2, Copy, GripVertical } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ExistingTool {
  id: string;
  name: string;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Add types for question and option
// Add a type for conditional logic options (future extensibility)
type ConditionalLogicOption = {
  option: string;
  action: string;
};

type Question = {
  id: string;
  title: string;
  subText: string;
  options: string[];
  isMandatory: boolean;
  conditionalLogic: boolean;
  // For future extensibility, not used in this UI yet
  conditionalLogicOptions?: ConditionalLogicOption[];
};

// Helper to generate unique question IDs (move outside for use in SortableQuestion)
const generateQuestionId = () => `q${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// Sortable Question Card (move outside main component)
function SortableQuestion({ question, index, setQuestions }: { question: Question; index: number; setQuestions: React.Dispatch<React.SetStateAction<Question[]>> }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    marginBottom: '1.5rem',
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: '#2264AC' }}
      className="bg-white rounded-lg border p-6 mb-4 shadow-md border-l-4"
    >
      {/* Drag handle at top center */}
      <div className="flex justify-center mb-2">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-[#2264AC] focus:outline-none" style={{ transform: 'rotate(90deg)' }}><GripVertical size={22} /></button>
      </div>
      {/* Editable question title */}
      <input
        type="text"
        value={question.title}
        placeholder="Untitled Question"
        onChange={e => {
          const value = e.target.value;
          setQuestions(prev => prev.map((q, i) =>
            i === index ? { ...q, title: value } : q
          ));
        }}
        className="w-full text-xl font-medium mb-4 p-2 border-b focus:outline-none"
      />
      <div className="w-full mt-2 relative ">
        <ReactQuill
          value={question.subText}
          onChange={val => {
            setQuestions(prev => prev.map((q, i) =>
              i === index ? { ...q, subText: val } : q
            ));
          }}
          placeholder="Add your sub text here"
          className="bg-[#f5f7fa] rounded-xl no-quill-border"
          style={{ background: '#f5f7fa', borderRadius: '12px' }}
          modules={{
            toolbar: {
              container: `#custom-quill-toolbar-${question.id}`,
            },
          }}
          formats={['bold', 'italic', 'underline', 'strike', 'link', 'list', 'bullet', 'align']}
        />
        <div
          id={`custom-quill-toolbar-${question.id}`}
          className="absolute bottom-3 right-3 bg-white rounded-lg shadow flex items-center px-2 py-1 z-10"
          style={{ minWidth: 220 }}
        >
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
          <button className="ql-link" />
          <button className="ql-align" value="" />
          <button className="ql-align" value="center" />
          <button className="ql-align" value="right" />
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </div>
      </div>
      {/* Conditional Logic UI */}
      {question.conditionalLogic ? (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <span className="font-medium w-1/3">If answer is...</span>
            <span className="font-medium w-1/3">Then...</span>
            <span className="w-1/3 flex justify-end"></span>
          </div>
          {question.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-4 mb-2">
              <input type="checkbox" />
              <input
                type="text"
                className="w-56 p-2 border rounded text-base"
                style={{ borderColor: '#2264AC', minWidth: '120px', maxWidth: '220px' }}
                placeholder="Option"
                value={opt}
                onChange={e => {
                  setQuestions(prev => prev.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? e.target.value : o) }
                      : q
                  ));
                }}
              />
              <button
                className="ml-2 text-gray-400"
                onClick={() => {
                  setQuestions(prev => prev.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
                      : q
                  ));
                }}
              >×</button>
              <select className="ml-8 border rounded p-1">
                <option>Choose</option>
                {/* Add your actions here */}
              </select>
              <span className="flex-1"></span>
            </div>
          ))}
          <div className="flex items-center">
            <button
              className="text-sm mt-2 text-left"
              style={{ color: '#2264AC' }}
              onClick={() => {
                setQuestions(prev => prev.map((q, i) =>
                  i === index
                    ? { ...q, options: [...q.options, ''] }
                    : q
                ));
              }}
            >+ Add more options</button>
            <span className="flex-1"></span>
            <div className="relative group mt-2 flex justify-end">
              <button
                className="px-4 py-2 rounded bg-[#2264AC] text-white"
              >+ Add Subsection</button>
              <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-64 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <strong>Subsection</strong>
                <br />
                This label helps you organize groups of questions and set up skip logic (e.g., "If answer is A, go to Subsection 1").
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {question.options.map((opt: string, optIdx: number) => (
            <div key={optIdx} className="flex items-center gap-2">
              <input type="radio" disabled />
              <input
                type="text"
                placeholder="Enter Option"
                value={opt}
                onChange={e => {
                  setQuestions(prev => prev.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? e.target.value : o) }
                      : q
                  ));
                }}
                className="p-2 border rounded text-base"
                style={{ borderColor: '#2264AC', width: '180px', minWidth: '120px', maxWidth: '220px' }}
              />
              <button className="text-gray-400" onClick={() => {
                setQuestions(prev => prev.map((q, i) =>
                  i === index
                    ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
                    : q
                ));
              }}>×</button>
            </div>
          ))}
          <button className="text-sm mt-2 text-left" style={{ color: '#2264AC' }} onClick={() => {
            setQuestions(prev => prev.map((q, i) =>
              i === index
                ? { ...q, options: [...q.options, ''] }
                : q
            ));
          }}>+ Add more options</button>
        </div>
      )}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-xs">Question Type</span>
          <button className="px-2 py-2 rounded text-xs" style={{ background: '#2264AC', color: 'white' }}>Multiple Choice</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Mandatory</span>
          <button
            type="button"
            onClick={() => {
              setQuestions(prev => prev.map((q, i) =>
                i === index ? { ...q, isMandatory: !q.isMandatory } : q
              ));
            }}
            className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${question.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
            style={{ minWidth: 40 }}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${question.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
        </div>
        <label className="flex items-center gap-2 px-2 py-2 rounded text-xs" style={{ background: '#2264AC', color: 'white', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={question.conditionalLogic}
            onChange={() => {
              setQuestions(prev => prev.map((q, i) =>
                i === index ? { ...q, conditionalLogic: !q.conditionalLogic } : q
              ));
            }}
            style={{ accentColor: '#2264AC' }}
          />
          Add Conditional Logic
        </label>
        <button className="px-2 py-2 rounded text-xs" style={{ background: '#E3ECF6', color: '#2264AC' }}>+ Add Sub Question</button>
        <button className="text-blue-500 hover:text-[#2264AC] ml-auto rounded-lg p-2" style={{ background: '#E3ECF6'  }} title="Copy" onClick={() => {
          const copy = { ...question, id: generateQuestionId() };
          copy.title = '';
          setQuestions(prev => [...prev, copy]);
        }}><Copy size={16} /></button>
        <button className="text-red-500 bg-red-50 hover:text-red-600 rounded-lg p-2" title="Delete" onClick={() => {
          setQuestions(prev => prev.filter((_, i) => i !== index));
        }}><Trash2 size={16} /></button>
      </div>
      <style jsx global>{`
        .no-quill-border .ql-editor {
          border: none !important;
          min-height: 100px !important;
          max-height: 100px !important;
          height: 100px !important;
          background: #f5f7fa !important;
          box-shadow: none !important;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          font-size: 16px;
          border-radius: 0.75rem;
        }
        .no-quill-border .ql-container {
          border: none !important;
          background: #f5f7fa !important;
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}

export default function NewObservationToolPage() {
  const [toolName, setToolName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      title: '',
      subText: '',
      options: ['', ''],
      isMandatory: true,
      conditionalLogic: false,
    },
  ]);
  const [showQuestionUI, setShowQuestionUI] = useState(true);

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

  // Add Question Handler
  const handleAddQuestion = () => {
    const newId = `q${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        title: '',
        subText: '',
        options: ['', ''],
        isMandatory: true,
        conditionalLogic: false,
      },
    ]);
  };

  // Drag and Drop Handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      setQuestions(arrayMove(questions, oldIndex, newIndex));
    }
  };

  return (
    <AnimatedContainer variant="fade" className="p-8 bg-white rounded-lg shadow-sm h-full overflow-y-auto">
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
            <span className="text-[inherit] pb-2 border-b-2" style={{ color: '#2264AC', borderBottomColor: '#2264AC' }}>{sectionName || 'Untitled Section'}</span>
            <button className="text-gray-600 pb-2 border-b-2 border-transparent hover:text-[inherit]" style={{ color: '#2264AC' }}>+ Add Section</button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-4 border-gray-200 shadow-md">
          <input
            type="text"
            placeholder="Untitled Section"
            value={sectionName}
            onChange={e => setSectionName(e.target.value)}
            className="w-full text-xl font-medium mb-4 p-2 border-b focus:outline-none"
            style={{ borderBottomColor: '#2264AC' }}
          />
          <textarea
            placeholder="Add Description"
            value={sectionDescription}
            onChange={e => setSectionDescription(e.target.value)}
            className="w-full h-24 p-2 border-b focus:outline-none resize-none"
            style={{ borderBottomColor: '#2264AC' }}
          />
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((question, idx) => (
              <SortableQuestion key={question.id} question={question} index={idx} setQuestions={setQuestions} />
            ))}
          </SortableContext>
        </DndContext>
        <button
          className="w-full py-3 rounded-lg transition-colors flex items-center justify-center mt-2"
          style={{ background: '#E3ECF6', color: '#2264AC' }}
          onClick={handleAddQuestion}
        >
          +Add Question
        </button>
      </div>
    </AnimatedContainer>
  );
} 