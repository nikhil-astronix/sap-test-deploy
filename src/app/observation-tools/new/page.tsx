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
import { MdRadioButtonUnchecked, MdRadioButtonChecked, MdCheckBoxOutlineBlank, MdCheckBox, MdSubject } from 'react-icons/md';

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

// Add type for Subsection above Question type
interface Subsection {
  name: string;
  description: string;
  questions: Question[];
}

// Update Question type to include subsections for conditional logic
type Question = {
  id: string;
  title: string;
  subText: string;
  options: string[];
  isMandatory: boolean;
  conditionalLogic: boolean;
  // For future extensibility, not used in this UI yet
  conditionalLogicOptions?: ConditionalLogicOption[];
  subsections?: Subsection[]; // <-- add this
};

// Helper to generate unique question IDs (move outside for use in SortableQuestion)
const generateQuestionId = () => `q${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// Sortable Question Card (move outside main component)
function SortableQuestion({ question, index, questions, setQuestions, onAddSubQuestion, showMCSubQs, mcSubQData, setMcSubQData, setShowMCQ, showOpenEndedSubQs, openEndedSubQData, setOpenEndedSubQData, setShowOpenEndedSubQs, showCheckboxSubQs, checkboxSubQData, setCheckboxSubQData, setShowCheckboxSubQs }: { question: Question; index: number; questions: Question[]; setQuestions: (questions: Question[]) => void; onAddSubQuestion: () => void; showMCSubQs: any; mcSubQData: any; setMcSubQData: any; setShowMCQ: any; showOpenEndedSubQs: any; openEndedSubQData: any; setOpenEndedSubQData: any; setShowOpenEndedSubQs: any; showCheckboxSubQs: any; checkboxSubQData: any; setCheckboxSubQData: any; setShowCheckboxSubQs: any; }) {
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

  // Subsection state for this question (if conditionalLogic is enabled)
  const [activeSubsection, setActiveSubsection] = useState(0);

  const handleAddSubsection = () => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const newSubsections = q.subsections ? [...q.subsections] : [];
      newSubsections.push({
        name: '',
        description: '',
        questions: [
          {
            id: 'q1',
            title: '',
            subText: '',
            options: ['', ''],
            isMandatory: true,
            conditionalLogic: false,
          },
        ],
      });
      return { ...q, subsections: newSubsections };
    });
    setQuestions(updatedQuestions);
  };
  const handleSubsectionNameChange = (subIdx: number, val: string) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const updatedSubsections = q.subsections?.map((s, j) => j === subIdx ? { ...s, name: val } : s) || [];
      return { ...q, subsections: updatedSubsections };
    });
    setQuestions(updatedQuestions);
  };
  const handleSubsectionDescriptionChange = (subIdx: number, val: string) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const updatedSubsections = q.subsections?.map((s, j) => j === subIdx ? { ...s, description: val } : s) || [];
      return { ...q, subsections: updatedSubsections };
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveSubsection = (subIdx: number) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const updatedSubsections = (q.subsections || []).filter((_, j) => j !== subIdx);
      return { ...q, subsections: updatedSubsections };
    });
    setQuestions(updatedQuestions);
    setActiveSubsection(0);
  };

  // Sub-question handlers for the active subsection
  const handleAddSubQuestion = () => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const updatedSubsections = (q.subsections || []).map((s, j) => {
        if (j !== activeSubsection) return s;
        return {
          ...s,
          questions: [
            ...s.questions,
            {
              id: `q${s.questions.length + 1}`,
              title: '',
              subText: '',
              options: [''],
              isMandatory: false,
              conditionalLogic: false,
            },
          ],
        };
      });
      return { ...q, subsections: updatedSubsections };
    });
    setQuestions(updatedQuestions);
  };

  const handleSetSubQuestions = (subQuestions: Question[]) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i !== index) return q;
      const updatedSubsections = (q.subsections || []).map((s, j) =>
        j === activeSubsection ? { ...s, questions: subQuestions } : s
      );
      return { ...q, subsections: updatedSubsections };
    });
    setQuestions(updatedQuestions);
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
          const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, title: e.target.value } : q
          );
          setQuestions(updatedQuestions);
        }}
        className="w-full text-xl font-medium mb-4 p-2 border-b focus:outline-none"
      />
      <div className="w-full mt-2 relative ">
        <ReactQuill
          value={question.subText}
          onChange={val => {
            const updatedQuestions = questions.map((q, i) =>
              i === index ? { ...q, subText: val } : q
            );
            setQuestions(updatedQuestions);
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
                  const updatedQuestions = questions.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? e.target.value : o) }
                      : q
                  );
                  setQuestions(updatedQuestions);
                }}
              />
              <button
                className="ml-2 text-gray-400"
                onClick={() => {
                  const updatedQuestions = questions.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
                      : q
                  );
                  setQuestions(updatedQuestions);
                }}
              >×</button>
              <select className="ml-8 border rounded p-1">
                <option>Choose</option>
                {question.subsections && question.subsections.length > 0 &&
                  question.subsections.map((sub, subIdx) => (
                    <option key={subIdx} value={subIdx}>
                      {sub.name || `Subsection ${subIdx + 1}`}
                    </option>
                  ))}
              </select>
              <span className="flex-1"></span>
            </div>
          ))}
          <div className="flex items-center">
            <button
              className="text-sm mt-2 text-left"
              style={{ color: '#2264AC' }}
              onClick={() => {
                const updatedQuestions = questions.map((q, i) =>
                  i === index
                    ? { ...q, options: [...q.options, ''] }
                    : q
                );
                setQuestions(updatedQuestions);
              }}
            >+ Add more options</button>
            <span className="flex-1"></span>
            {(!question.subsections || question.subsections.length === 0) && (
              <div className="relative group mt-2 flex justify-end">
                <button
                  className="px-4 py-2 rounded bg-[#2264AC] text-white"
                  onClick={handleAddSubsection}
                  type="button"
                >+ Add Subsection</button>
                <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-64 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <strong>Subsection</strong>
                  <br />
                  This label helps you organize groups of questions and set up skip logic (e.g., "If answer is A, go to Subsection 1").
                </div>
              </div>
            )}
          </div>
          {/* Subsection Tabs and UI */}
          {question.subsections && question.subsections.length > 0 && (
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <div className="flex gap-2 ml-auto flex-row justify-end">
                <button
                  className="px-4 py-2 rounded bg-green-700 text-white"
                  style={{ background: '#2E7D32' }}
                >
                  Save Subsection
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
                  onClick={() => handleRemoveSubsection(activeSubsection)}
                >
                  Delete
                </button>
              </div>
              {/* Always render the tab bar if there is at least one subsection */}
              <div className="flex items-center mb-4 border-b border-gray-200">
                {question.subsections.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSubsection(idx)}
                    className={`text-[inherit] pb-2 border-b-2 transition-colors mr-4 ${activeSubsection === idx ? 'font-semibold' : ''}`}
                    style={{ color: '#2264AC', borderBottomColor: activeSubsection === idx ? '#2264AC' : 'transparent' }}
                  >
                    {sub.name || `Subsection ${idx + 1}`}
                  </button>
                ))}
                <button
                  className="text-gray-600 pb-2 border-b-2 border-transparent hover:text-[inherit]"
                  style={{ color: '#2264AC' }}
                  onClick={handleAddSubsection}
                  type="button"
                >
                  + Add Subsection
                </button>
              </div>
              {/* Subsection Content */}
              {question.subsections[activeSubsection] && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="flex flex-col justify-between mb-4 border border-gray-200 rounded-lg p-4 shadow-md">
                    <input
                      type="text"
                      placeholder="Untitled Subsection"
                      value={question.subsections[activeSubsection].name}
                      onChange={e => handleSubsectionNameChange(activeSubsection, e.target.value)}
                      className="w-full text-xl font-medium mb-4 p-2 border-b focus:outline-none"
                      style={{ borderBottomColor: '#2264AC', background: 'transparent' }}
                    />
                     <textarea
                      placeholder="Add Description"
                      value={question.subsections[activeSubsection].description}
                      onChange={e => handleSubsectionDescriptionChange(activeSubsection, e.target.value)}
                      className="w-full h-24 p-2 border-b focus:outline-none resize-none"
                      style={{ borderBottomColor: '#2264AC', background: 'white' }}
                    />
                  </div>
                  {/* Sub-Questions List */}
                  <DndContext collisionDetection={closestCenter} onDragEnd={event => {
                    const { active, over } = event;
                    if (!over || active.id !== over.id) return;
                    const subQuestions = (question.subsections?.[activeSubsection]?.questions) || [];
                    const oldIndex = subQuestions.findIndex(q => q.id === active.id);
                    const newIndex = subQuestions.findIndex(q => q.id === over.id);
                    if (oldIndex !== -1 && newIndex !== -1) {
                      const moved = arrayMove(subQuestions, oldIndex, newIndex);
                      handleSetSubQuestions(moved);
                    }
                  }}>
                    <SortableContext items={(question.subsections?.[activeSubsection]?.questions || []).map(q => q.id)} strategy={verticalListSortingStrategy}>
                      {(question.subsections?.[activeSubsection]?.questions || []).map((subQ, subIdx) => (
                        <div key={subQ.id} style={{ background: '#E3ECF6', borderRadius: '16px', padding: '0', marginBottom: '1.5rem', border: 'none', boxShadow: 'none' }} className="mb-6">
                          {/* Sub-question title row (optional, or just use subQ.title) */}
                          <div className="flex justify-between items-center px-6 pt-6 pb-2">
                            <input
                              type="text"
                              value={subQ.title}
                              placeholder={`Untitled Sub Question ${subIdx + 1}`}
                              onChange={e => {
                                const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                  i === subIdx ? { ...q, title: e.target.value } : q
                                );
                                handleSetSubQuestions(updatedQuestions);
                              }}
                              className="font-semibold text-lg text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none flex-1"
                            />
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600">Mandatory</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                    i === subIdx ? { ...q, isMandatory: !q.isMandatory } : q
                                  );
                                  handleSetSubQuestions(updatedQuestions);
                                }}
                                className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${subQ.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
                                style={{ minWidth: 40 }}
                              >
                                <span
                                  className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${subQ.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
                                />
                              </button>
                              <button className="text-red-500 bg-red-50 hover:text-red-600 rounded-lg p-2 ml-2" title="Delete" onClick={() => {
                                const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).filter((_, i) => i !== subIdx);
                                handleSetSubQuestions(updatedQuestions);
                              }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          {/* Sub-question subtext/description */}
                          <div className="px-6 pb-4">
                            <div className="bg-white rounded-xl p-4 mb-4">
                              <ReactQuill
                                value={subQ.subText}
                                onChange={val => {
                                  const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                    i === subIdx ? { ...q, subText: val } : q
                                  );
                                  handleSetSubQuestions(updatedQuestions);
                                }}
                                placeholder="Add your sub text here"
                                className="bg-white rounded-xl no-quill-border"
                                style={{ background: 'white', borderRadius: '12px' }}
                                modules={{
                                  toolbar: {
                                    container: `#custom-quill-toolbar-${subQ.id}`,
                                  },
                                }}
                                formats={['bold', 'italic', 'underline', 'strike', 'link', 'list', 'bullet', 'align']}
                              />
                              <div
                                id={`custom-quill-toolbar-${subQ.id}`}
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
                            {/* Options List */}
                            <div className="bg-[#E3ECF6] rounded-xl p-4">
                              {subQ.options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="flex items-center gap-2 mb-2">
                                  <input type="radio" disabled className="accent-[#2264AC]" />
                                  <input
                                    type="text"
                                    placeholder="Enter Option"
                                    value={opt}
                                    onChange={e => {
                                      const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                        i === subIdx
                                          ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? e.target.value : o) }
                                          : q
                                      );
                                      handleSetSubQuestions(updatedQuestions);
                                    }}
                                    className="p-2 border rounded text-base bg-white"
                                    style={{ borderColor: '#2264AC', width: '180px', minWidth: '120px', maxWidth: '220px' }}
                                  />
                                  <button className="text-gray-400" onClick={() => {
                                    const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                      i === subIdx
                                        ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
                                        : q
                                    );
                                    handleSetSubQuestions(updatedQuestions);
                                  }}><span className="text-2xl">×</span></button>
                                </div>
                              ))}
                              <button className="text-sm mt-2 text-left" style={{ color: '#2264AC' }} onClick={() => {
                                const updatedQuestions = (question.subsections?.[activeSubsection]?.questions || []).map((q, i) =>
                                  i === subIdx
                                    ? { ...q, options: [...q.options, ''] }
                                    : q
                                );
                                handleSetSubQuestions(updatedQuestions);
                              }}>+ Add more options</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                  <button
                    className="w-full py-3 rounded-lg transition-colors flex items-center justify-center mt-2"
                    style={{ background: '#E3ECF6', color: '#2264AC' }}
                    onClick={handleAddSubQuestion}
                    type="button"
                  >
                    + Add Sub Question
                  </button>
                </div>
              )}
            </div>
          )}
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
                  const updatedQuestions = questions.map((q, i) =>
                    i === index
                      ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? e.target.value : o) }
                      : q
                  );
                  setQuestions(updatedQuestions);
                }}
                className="p-2 border rounded text-base"
                style={{ borderColor: '#2264AC', width: '180px', minWidth: '120px', maxWidth: '220px' }}
              />
              <button className="text-gray-400" onClick={() => {
                const updatedQuestions = questions.map((q, i) =>
                  i === index
                    ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
                    : q
                );
                setQuestions(updatedQuestions);
              }}>×</button>
            </div>
          ))}
          <button className="text-sm mt-2 text-left" style={{ color: '#2264AC' }} onClick={() => {
            const updatedQuestions = questions.map((q, i) =>
              i === index
                ? { ...q, options: [...q.options, ''] }
                : q
            );
            setQuestions(updatedQuestions);
          }}>+ Add more options</button>
          {showMCSubQs && showMCSubQs[index] && mcSubQData && mcSubQData[index] && (
            <MultipleChoiceSubQuestionCard
              subQuestion={mcSubQData[index]}
              onChange={q => setMcSubQData((prev: any) => ({ ...prev, [index]: q }))}
              onDelete={() => setShowMCQ((prev: any) => ({ ...prev, [index]: false }))}
            />
          )}
          {showCheckboxSubQs && showCheckboxSubQs[index] && checkboxSubQData && checkboxSubQData[index] && (
            <CheckboxSubQuestionCard
              subQuestion={checkboxSubQData[index]}
              onChange={q => setCheckboxSubQData((prev: any) => ({ ...prev, [index]: q }))}
              onDelete={() => setShowCheckboxSubQs((prev: any) => ({ ...prev, [index]: false }))}
            />
          )}
          {showOpenEndedSubQs && showOpenEndedSubQs[index] && openEndedSubQData && openEndedSubQData[index] && (
            <OpenEndedSubQuestionCard
              subQuestion={openEndedSubQData[index]}
              onChange={q => setOpenEndedSubQData((prev: any) => ({ ...prev, [index]: q }))}
              onDelete={() => setShowOpenEndedSubQs((prev: any) => ({ ...prev, [index]: false }))}
            />
          )}
        </div>
      )}
      <div className="flex flex-row gap-6 mt-6">
        
        <div className="flex items-center gap-2">
          <span className="text-xs">Mandatory</span>
          <button
            type="button"
            onClick={() => {
              const updatedQuestions = questions.map((q, i) =>
                i === index ? { ...q, isMandatory: !q.isMandatory } : q
              );
              setQuestions(updatedQuestions);
            }}
            className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${question.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
            style={{ minWidth: 40 }}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${question.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
        </div>
        <label className="flex items-center gap-2 px-2 py-2 rounded text-xs ml-auto" style={{ background: '#2264AC', color: 'white', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={question.conditionalLogic}
            onChange={() => {
              const updatedQuestions = questions.map((q, i) =>
                i === index ? { ...q, conditionalLogic: !q.conditionalLogic } : q
              );
              setQuestions(updatedQuestions);
            }}
            style={{ accentColor: '#2264AC' }}
          />
          Add Conditional Logic
        </label>
        <button className="px-2 py-2 rounded text-xs" style={{ background: '#2264AC', color: 'white' }} onClick={onAddSubQuestion}>+ Add Sub Question</button>
       
        <button className="text-red-500 bg-red-50 hover:text-red-600 rounded-lg p-2" title="Delete" onClick={() => {
          const updatedQuestions = questions.filter((_, i) => i !== index);
          setQuestions(updatedQuestions);
        }}><Trash2 size={16} /></button>
      </div>
      <style jsx global>{`
        .no-quill-border .ql-editor {
          border: none !important;
          min-height: 100px !important;
          max-height: 100px !important;
          height: 100px !important;
   
          box-shadow: none !important;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          font-size: 16px;
          border-radius: 0.75rem;
         
        }
        .no-quill-border .ql-container {
          border: none !important;
    
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}

function QuestionTypeModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (type: string) => void }) {
  const [selected, setSelected] = React.useState<string>('');
  React.useEffect(() => { if (!open) setSelected(''); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[340px] relative">
        <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
        <h2 className="text-lg font-semibold mb-4">Question Types</h2>
        <div className="flex flex-col gap-4">
          <button
            className={`flex items-center gap-2 p-3 rounded text-left transition-colors ${selected === 'multiple_choice' ? 'bg-[#f5f7fa]' : 'hover:bg-gray-100'}`}
            onClick={() => { setSelected('multiple_choice'); onSelect('multiple_choice'); }}
            style={{ fontWeight: selected === 'multiple_choice' ? 500 : 400 }}
          >
            {selected === 'multiple_choice' ? <MdRadioButtonChecked className="text-[#2264AC] text-xl" /> : <MdRadioButtonUnchecked className="text-[#2264AC] text-xl" />}
            Multiple Choice
          </button>
          <button
            className={`flex items-center gap-2 p-3 rounded text-left transition-colors ${selected === 'checkbox' ? 'bg-[#f5f7fa]' : 'hover:bg-gray-100'}`}
            onClick={() => { setSelected('checkbox'); onSelect('checkbox'); }}
            style={{ fontWeight: selected === 'checkbox' ? 500 : 400 }}
          >
            {selected === 'checkbox' ? <MdCheckBox className="text-[#2264AC] text-xl" /> : <MdCheckBoxOutlineBlank className="text-[#2264AC] text-xl" />}
            Checkbox
          </button>
          <button
            className={`flex items-center gap-2 p-3 rounded text-left transition-colors ${selected === 'open_ended' ? 'bg-[#f5f7fa]' : 'hover:bg-gray-100'}`}
            onClick={() => { setSelected('open_ended'); onSelect('open_ended'); }}
            style={{ fontWeight: selected === 'open_ended' ? 500 : 400 }}
          >
            <MdSubject className="text-[#2264AC] text-xl" />
            Open Ended
          </button>
        </div>
      </div>
    </div>
  );
}

function MultipleChoiceSubQuestionCard({ subQuestion, onChange, onDelete }: {
  subQuestion: { title: string; options: string[]; isMandatory: boolean };
  onChange: (q: any) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#eaf2fd] rounded-xl p-4 mt-4 flex flex-col gap-2 border border-[#b6d4fa]">
      <div className="flex items-center gap-2 mb-2">
        <input type="radio" checked readOnly className="accent-[#2264AC]" />
        <input
          type="text"
          value={subQuestion.title}
          placeholder="Untitled Sub Question 1"
          onChange={e => onChange({ ...subQuestion, title: e.target.value })}
          className="font-semibold text-base bg-transparent border-none flex-1 outline-none"
        />
        <span className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Mandatory</span>
          <button
            type="button"
            onClick={() => onChange({ ...subQuestion, isMandatory: !subQuestion.isMandatory })}
            className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${subQuestion.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
            style={{ minWidth: 40 }}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${subQuestion.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
          <button className="text-red-500 bg-white hover:text-red-600 rounded-lg p-2 border border-red-200" title="Delete" onClick={onDelete}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </span>
      </div>
      {subQuestion.options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input type="radio" disabled className="accent-[#2264AC]" />
          <input
            type="text"
            placeholder="Enter Option"
            value={opt}
            onChange={e => {
              const newOptions = subQuestion.options.map((o, i) => i === idx ? e.target.value : o);
              onChange({ ...subQuestion, options: newOptions });
            }}
            className="p-2 border rounded text-base bg-white"
            style={{ borderColor: '#2264AC', width: '180px', minWidth: '120px', maxWidth: '220px' }}
          />
          <button className="text-gray-400" onClick={() => {
            const newOptions = subQuestion.options.filter((_, i) => i !== idx);
            onChange({ ...subQuestion, options: newOptions });
          }}><span className="text-2xl">×</span></button>
        </div>
      ))}
      <button className="text-sm mt-2 text-left" style={{ color: '#2264AC' }} onClick={() => {
        onChange({ ...subQuestion, options: [...subQuestion.options, ''] });
      }}>+ Add more options</button>
    </div>
  );
}

function OpenEndedSubQuestionCard({ subQuestion, onChange, onDelete }: {
  subQuestion: { title: string; subText: string; isMandatory: boolean; id?: string };
  onChange: (q: any) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#eaf2fd] rounded-xl p-4 mt-4 flex flex-col gap-2 border border-[#b6d4fa]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl text-[#2264AC]">≡</span>
        <input
          type="text"
          value={subQuestion.title}
          placeholder="Untitled Sub Question 1"
          onChange={e => onChange({ ...subQuestion, title: e.target.value })}
          className="font-semibold text-base bg-transparent border-none flex-1 outline-none"
        />
        <span className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Mandatory</span>
          <button
            type="button"
            onClick={() => onChange({ ...subQuestion, isMandatory: !subQuestion.isMandatory })}
            className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${subQuestion.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
            style={{ minWidth: 40 }}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${subQuestion.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
          <button className="text-red-500 bg-white hover:text-red-600 rounded-lg p-2 border border-red-200" title="Delete" onClick={onDelete}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </span>
      </div>
      <div className="bg-white rounded-xl p-2 mb-4 relative">
        <ReactQuill
          value={subQuestion.subText}
          onChange={val => onChange({ ...subQuestion, subText: val })}
          placeholder="Add your sub text here"
          className="bg-white  rounded-xl no-quill-border"
          style={{ background: 'white !important', borderRadius: '12px' }}
          modules={{
            toolbar: {
              container: `#custom-quill-toolbar-${subQuestion.id}`,
            },
          }}
          formats={['bold', 'italic', 'underline', 'strike', 'link', 'list', 'bullet', 'align']}
        />
        <div
          id={`custom-quill-toolbar-${subQuestion.id}`}
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
    </div>
  );
}

function CheckboxSubQuestionCard({ subQuestion, onChange, onDelete }: {
  subQuestion: { title: string; options: string[]; isMandatory: boolean };
  onChange: (q: any) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#eaf2fd] rounded-xl p-4 mt-4 flex flex-col gap-2 border border-[#b6d4fa]">
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" checked readOnly className="accent-[#2264AC]" />
        <input
          type="text"
          value={subQuestion.title}
          placeholder="Untitled Sub Question 1"
          onChange={e => onChange({ ...subQuestion, title: e.target.value })}
          className="font-semibold text-base bg-transparent border-none flex-1 outline-none"
        />
        <span className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Mandatory</span>
          <button
            type="button"
            onClick={() => onChange({ ...subQuestion, isMandatory: !subQuestion.isMandatory })}
            className={`relative w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${subQuestion.isMandatory ? 'bg-[#2264AC]' : 'bg-gray-300'}`}
            style={{ minWidth: 40 }}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform duration-200 ${subQuestion.isMandatory ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
          <button className="text-red-500 bg-white hover:text-red-600 rounded-lg p-2 border border-red-200" title="Delete" onClick={onDelete}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </span>
      </div>
      {subQuestion.options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input type="checkbox" disabled className="accent-[#2264AC]" />
          <input
            type="text"
            placeholder="Enter Option"
            value={opt}
            onChange={e => {
              const newOptions = subQuestion.options.map((o, i) => i === idx ? e.target.value : o);
              onChange({ ...subQuestion, options: newOptions });
            }}
            className="p-2 border rounded text-base bg-white"
            style={{ borderColor: '#2264AC', width: '180px', minWidth: '120px', maxWidth: '220px' }}
          />
          <button className="text-gray-400" onClick={() => {
            const newOptions = subQuestion.options.filter((_, i) => i !== idx);
            onChange({ ...subQuestion, options: newOptions });
          }}><span className="text-2xl">×</span></button>
        </div>
      ))}
      <button className="text-sm mt-2 text-left" style={{ color: '#2264AC' }} onClick={() => {
        onChange({ ...subQuestion, options: [...subQuestion.options, ''] });
      }}>+ Add more options</button>
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
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [modalParentIdx, setModalParentIdx] = useState<number | null>(null);
  const [modalSubsectionIdx, setModalSubsectionIdx] = useState<number | null>(null);
  const [showMCSubQs, setShowMCSubQs] = useState<{ [qIdx: number]: boolean }>({});
  const [mcSubQData, setMcSubQData] = useState<{ [qIdx: number]: { title: string; options: string[]; isMandatory: boolean } }>({});
  const [showOpenEndedSubQs, setShowOpenEndedSubQs] = useState<{ [qIdx: number]: boolean }>({});
  const [openEndedSubQData, setOpenEndedSubQData] = useState<{ [qIdx: number]: { title: string; subText: string; isMandatory: boolean } }>({});
  const [showCheckboxSubQs, setShowCheckboxSubQs] = useState<{ [qIdx: number]: boolean }>({});
  const [checkboxSubQData, setCheckboxSubQData] = useState<{ [qIdx: number]: { title: string; options: string[]; isMandatory: boolean } }>({});

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
    const updatedQuestions = [
      ...questions,
      {
        id: newId,
        title: '',
        subText: '',
        options: ['', ''],
        isMandatory: true,
        conditionalLogic: false,
      },
    ];
    setQuestions(updatedQuestions);
  };

  // Drag and Drop Handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      const updatedQuestions = arrayMove(questions, oldIndex, newIndex);
      setQuestions(updatedQuestions);
    }
  };

  // Handler to open modal for parent question
  const handleOpenQuestionTypeModal = (parentIdx: number, subsectionIdx: number | null = null) => {
    setModalParentIdx(parentIdx);
    setModalSubsectionIdx(subsectionIdx);
    setShowQuestionTypeModal(true);
  };

  // Handler to add sub-question of selected type
  const handleSelectQuestionType = (type: string) => {
    if (modalParentIdx === null) return;
    if (type === 'multiple_choice') {
      setShowMCSubQs(prev => ({ ...prev, [modalParentIdx]: true }));
      setMcSubQData(prev => ({
        ...prev,
        [modalParentIdx]: {
          title: '',
          options: [''],
          isMandatory: false,
        },
      }));
      setShowQuestionTypeModal(false);
      return;
    }
    if (type === 'checkbox') {
      setShowCheckboxSubQs(prev => ({ ...prev, [modalParentIdx]: true }));
      setCheckboxSubQData(prev => ({
        ...prev,
        [modalParentIdx]: {
          title: '',
          options: [''],
          isMandatory: false,
        },
      }));
      setShowQuestionTypeModal(false);
      return;
    }
    if (type === 'open_ended') {
      setShowOpenEndedSubQs(prev => ({ ...prev, [modalParentIdx]: true }));
      setOpenEndedSubQData(prev => ({
        ...prev,
        [modalParentIdx]: {
          title: '',
          subText: '',
          isMandatory: false,
        },
      }));
      setShowQuestionTypeModal(false);
      return;
    }
    setQuestions(prevQs => {
      return prevQs.map((q, idx) => {
        if (idx !== modalParentIdx) return q;
        // If subsectionIdx is null, add to main question's subsections
        if (modalSubsectionIdx === null) {
          // If no subsections, create one
          let subsections = q.subsections ? [...q.subsections] : [];
          if (subsections.length === 0) {
            subsections.push({
              name: '',
              description: '',
              questions: [],
            });
          }
          // Add sub-question to first subsection
          const subQType = type === 'open_ended' ? { options: [''], } : { options: ['', ''] };
          subsections[0].questions.push({
            id: `q${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            title: '',
            subText: '',
            ...subQType,
            isMandatory: false,
            conditionalLogic: false,
          });
          return { ...q, subsections };
        } else {
          // Add to specific subsection
          const subsections = q.subsections ? [...q.subsections] : [];
          if (!subsections[modalSubsectionIdx]) return q;
          const subQType = type === 'open_ended' ? { options: [''], } : { options: ['', ''] };
          subsections[modalSubsectionIdx].questions.push({
            id: `q${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            title: '',
            subText: '',
            ...subQType,
            isMandatory: false,
            conditionalLogic: false,
          });
          return { ...q, subsections };
        }
      });
    });
    setShowQuestionTypeModal(false);
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
              className="px-6 py-2 bg-[#2264AC] text-white rounded-lg hover:bg-[#2264AC] transition-colors"
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
              <SortableQuestion 
                key={question.id} 
                question={question} 
                index={idx} 
                questions={questions} 
                setQuestions={setQuestions}
                onAddSubQuestion={() => handleOpenQuestionTypeModal(idx)}
                showMCSubQs={showMCSubQs}
                mcSubQData={mcSubQData}
                setMcSubQData={setMcSubQData}
                setShowMCQ={setShowMCSubQs}
                showCheckboxSubQs={showCheckboxSubQs}
                checkboxSubQData={checkboxSubQData}
                setCheckboxSubQData={setCheckboxSubQData}
                setShowCheckboxSubQs={setShowCheckboxSubQs}
                showOpenEndedSubQs={showOpenEndedSubQs}
                openEndedSubQData={openEndedSubQData}
                setOpenEndedSubQData={setOpenEndedSubQData}
                setShowOpenEndedSubQs={setShowOpenEndedSubQs}
              />
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
        <QuestionTypeModal open={showQuestionTypeModal} onClose={() => setShowQuestionTypeModal(false)} onSelect={handleSelectQuestionType} />
      </div>
    </AnimatedContainer>
  );
} 