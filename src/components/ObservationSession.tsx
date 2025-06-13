'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pie } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import LiteracyFSComponent from './LiteracyFSComponent';
import QuickNotes from './QuickNotes';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ObserverResponse {
  id: number;
  response: 'Yes' | 'No' | 'Could Not Determine';
  targetedSkills?: string;
  textilsResources?: string;
  instructionalMaterials?: string;
  respondent: {
    name: string;
    email: string;
  };
  evidence: string;
}

interface ObservationSessionProps {
  date: string;
  school: string;
  observation_tool: string;
  total_observation_classrooms: number;
  observation_classrooms: any[];
  observation_classroom_teacher_name: string;
  total_observers: any;
  observation_tool_sections_with_responses: any[];
  notes: string;
  note_evidence_docs: any[];
}

const ObservationSession = ({ date, school, observation_tool, observation_classrooms, observation_classroom_teacher_name, total_observers, observation_tool_sections_with_responses, notes, note_evidence_docs }: ObservationSessionProps) => {
  const [activeTab, setActiveTab] = useState('CQ1');

  // Parse date for month and day
  let month = '';
  let day = '';
  if (date) {
    const d = new Date(date);
    month = d.toLocaleString('default', { month: 'short' });
    day = d.getDate().toString();
  }

  const pieChartData = {
    datasets: [{
      data: [33.3, 66.6],
      backgroundColor: ['#2563eb', '#7c3aed'],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  const pieChartDataWithThree = {
    datasets: [{
      data: [33.3, 33.3, 33.3],
      backgroundColor: ['#2563eb', '#7c3aed', '#059669'],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  const [responses] = useState<ObserverResponse[]>([
    {
      id: 1,
      response: 'Yes',
      textilsResources: 'Collaboration checklist from group project rubric',
      respondent: {
        name: 'John doe (You)',
        email: 'johndoe@gmail.com'
      },
      evidence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut'
    },
    {
      id: 2,
      response: 'No',
      targetedSkills: 'Team Tower Challenge',
      textilsResources: 'Collaboration checklist from group project rubric',
      respondent: {
        name: 'Priya Mehta',
        email: 'priya@gmail.com'
      },
      evidence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut'
    },
    {
      id: 3,
      response: 'No',
      targetedSkills: 'Empathy',
      textilsResources: '"Empathy Roleplay Cards"',
      respondent: {
        name: 'Aanya Kapoor',
        email: 'aanya@gmail.com'
      },
      evidence: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut'
    }
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between  bg-[#F4F6F8] p-2  mt-3 mx-3  rounded-lg">
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
          <div className="bg-white text-white  rounded flex flex-col items-center justify-center">
          <span className="bg-[#2A7251] px-2 rounded-t text-xs">{month}</span>
          <span className="text-xl py-1 text-[#2A7251] leading-none">{day}</span>
        </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl mt-2">{school}</h1>
            <p className="text-gray-600 text-sm">School: {observation_classrooms.join(' ') } {observation_classroom_teacher_name}</p>
          </div>
        </div>
        <div>
          <span className="bg-[#F2FAF6] text-[#2A7251] px-3 py-1 rounded-full text-sm">
            {observation_tool}
          </span>
        </div>
      </div>
     
      <div className="flex flex-row h-full w-full">
        {/* Left Sidebar: Quick Notes */}
        <div className="flex-1  bg-white p-4 flex flex-col">
          <QuickNotes initialNotes={notes} initialEvidenceDocs={note_evidence_docs} />
        </div>
        {/* Right Main Content */}
        <div className=" p-4  flex flex-col h-full">


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

          {/* Content Area: All tabs and questions always on right */}
          <div className="flex flex-col h-full overflow-hidden">
            <LiteracyFSComponent  sections={observation_tool_sections_with_responses}/>
            <div className="flex justify-between mt-8">
              <button className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50">
                Exit
              </button>
              <button className="px-6 py-1 bg-[#2A7251] text-white rounded-md hover:bg-green-700">
                Finish
              </button>
            </div>
          </div>
          {/* Add other tab content here as needed */}
        </div>
      </div>
    </div>
  );
};

export default ObservationSession; 