import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import QuickNotes from '@/components/QuickNotes';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function ObservationFormIntro({ onGetStarted, date, school, observation_tool , observation_classrooms, observation_classroom_teacher_name, total_observers}: { onGetStarted: () => void, date: string, school: string, observation_tool: string, observation_classrooms: any[], observation_classroom_teacher_name: string, total_observers: any }) {
  const [editorValue, setEditorValue] = useState('');
  const [activeTab, setActiveTab] = useState('Lorem');
  // Parse date for month and day
  let month = '';
  let day = '';
  if (date) {
    const d = new Date(date);
    month = d.toLocaleString('default', { month: 'short' });
    day = d.getDate().toString();
  }
  return (
    <div className="h-full bg-white flex flex-col px-4   py-4 w-full rounded-xl shadow-lg">
      <div className="flex items-center gap-4 mb-2 p-2  w-full bg-[#F4F6F8] rounded-xl shadow-lg">
        <div className="bg-white text-white  rounded flex flex-col items-center justify-center">
          <span className="bg-[#2A7251] px-2 rounded-t text-xs">{month}</span>
          <span className="text-xl py-1 text-[#2A7251] leading-none">{day}</span>
        </div>
        <div>
          <div className="font-semibold text-lg">{school}</div>
          <div className="text-gray-600 text-sm">School: {observation_classrooms.join(' ') } ({observation_classroom_teacher_name})</div>
        </div>
        <div className="ml-auto text-[#2A7251] font-bold text-sm">{observation_tool}</div>
      </div>
      <div className="w-full py-2 px-1   rounded-xl h-full flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Left: Quick Notes */}
        <div className='flex-1'>

          <QuickNotes initialNotes="" initialEvidenceDocs={[]} />
        </div>
        {/* Right: Core Question and Standards */}
        <div className="bg-white  flex flex-1 flex-col rounded-xl ">
           {/* Top Navigation */}
           <div className="flex p-1 mb-6 bg-[#F4F6F8] rounded-lg justify-between">
            {['Lorem', 'Ipsum', 'Lorem Ipsum', 'CQ1', 'CQ2'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-1 ${tab === activeTab
                    ? 'bg-[#6C4996] text-white rounded'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="h-full flex flex-col p-1 pb-2  gap-4  bg-white overflow-y-scroll">
            <div className="flex flex-col gap-2 p-4 bg-[#EFF7FF] rounded-xl shadow-md">
              <div className="bg-[#2264AC] rounded-xl p-6 mb-4 flex flex-col items-center justify-between">
                <div className="inline-block bg-[#EFF7FF] text-[#2264AC]  px-4 py-1 rounded-full text-xs font-medium mb-3 ">Core Question 1</div>
                <div className="text-white text-center text-sm  mb-2">
                  Are students experiencing instruction that reflects the demands of the grade level and ensures they are supported to develop grade-level knowledge and skills?
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI A. The foundational skill(s) reflect grade-level standards.*</div>
                  <ul className="list-disc ml-5 text-gray-700 text-sm">
                    <li>Students practice grade-level foundational skills</li>
                    <li>print concepts; phonological (and phonemic) awareness</li>
                    <li>phonics and word recognition; fluency.</li>
                  </ul>
                </div>
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI B. The foundational skill(s) reflect grade-level standards.</div>
                  <ol className="list-decimal ml-5 text-gray-700 text-sm">
                    <li>Students practice grade-level foundational skills</li>
                    <li>print concepts; phonological (and phonemic) awareness</li>
                    <li>phonics and word recognition; fluency.</li>
                  </ol>
                </div>
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI B. The foundational skill(s) reflect grade-level standards.*</div>
                  <div className="text-gray-700 text-sm">
                    Students practice grade-level foundational skills (print concepts; phonological (and phonemic) awareness; phonics and word recognition; fluency).
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-[#EFF7FF] rounded-xl shadow-md">
              <div className="bg-[#2264AC] rounded-xl p-6 mb-4 flex flex-col items-center justify-between">
                <div className="inline-block bg-[#EFF7FF] text-[#2264AC]  px-4 py-1 rounded-full text-xs font-medium mb-3 ">Core Question 1</div>
                <div className="text-white text-center text-sm  mb-2">
                  Are students experiencing instruction that reflects the demands of the grade level and ensures they are supported to develop grade-level knowledge and skills?
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI A. The foundational skill(s) reflect grade-level standards.*</div>
                  <ul className="list-disc ml-5 text-gray-700 text-sm">
                    <li>Students practice grade-level foundational skills</li>
                    <li>print concepts; phonological (and phonemic) awareness</li>
                    <li>phonics and word recognition; fluency.</li>
                  </ul>
                </div>
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI B. The foundational skill(s) reflect grade-level standards.</div>
                  <ol className="list-decimal ml-5 text-gray-700 text-sm">
                    <li>Students practice grade-level foundational skills</li>
                    <li>print concepts; phonological (and phonemic) awareness</li>
                    <li>phonics and word recognition; fluency.</li>
                  </ol>
                </div>
                <div className="">
                  <div className="font-semibold mb-1 text-sm">1 FSI B. The foundational skill(s) reflect grade-level standards.*</div>
                  <div className="text-gray-700 text-sm">
                    Students practice grade-level foundational skills (print concepts; phonological (and phonemic) awareness; phonics and word recognition; fluency).
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <button className="text-red-600 border border-red-600 px-6 py-1 rounded-md hover:bg-red-50">Exit</button>
            <button className="bg-[#2A7251] border border-[#2A7251] text-white px-4 py-1 rounded-md hover:bg-emerald-700" onClick={onGetStarted}>Get Started</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ObservationFormIntro; 