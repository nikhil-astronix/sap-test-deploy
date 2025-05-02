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

const ObservationSession = () => {
  const [activeTab, setActiveTab] = useState('CQ1');

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
    <div className="bg-white rounded-lg shadow-lg h-full overflow-y-auto w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 mr-4">
            ← Back
          </Link>
          <div>
            <div className="flex items-center">
              <div className="bg-green-800 text-white px-2 py-1 rounded">
                <span className="font-medium">March</span>
                <span className="text-3xl font-bold ml-2">20</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold mt-2">Sample SchoolB Observation Session</h1>
            <p className="text-gray-600">Classroom: 1st grade ELA (ELA Teacher A)</p>
          </div>
        </div>
        <div>
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            e² Literacy FS
          </span>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="flex border-b mb-6">
        {['Lorem', 'Ipsum', 'Lorem Ipsum', 'CQ1', 'CQ2'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 ${
              tab === activeTab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'Lorem' ? (
        // Side by Side Layout for Lorem tab
        <div className="flex gap-6">
          <div className="w-1/3">
            <QuickNotes />
          </div>
          <div className="w-2/3">
            <LiteracyFSComponent />
          </div>
        </div>
      ) : activeTab === 'CQ1' ? (
        // Full Width Layout for CQ1
        <>
          {/* Core Question */}
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <div className="text-center">
              <div className="inline-block bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-3">
                Core Question 1
              </div>
              <h2 className="text-xl">
                Are students experiencing instruction that reflects the demands of the grade level and ensures they are supported to
                develop grade-level knowledge and skills?
              </h2>
            </div>
          </div>

          {/* Total Observers */}
          <div className="mt-6">
            <h3 className="text-lg font-medium">Total Observers (22)</h3>
          </div>

          {/* FSI Section A */}
          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">
                  1 FSI A. The foundational skill(s) reflect grade-level standards.*
                </h3>
                <ul className="list-disc ml-6 text-gray-600 space-y-1">
                  <li>Students practice grade-level foundational skills</li>
                  <li>(print concepts; phonological (and phonemic) awareness</li>
                  <li>phonics and word recognition; fluency)</li>
                </ul>
                <div className="mt-4 space-y-1 text-gray-600">
                  <p>• Targeted Skills (Optional)</p>
                  <p>• Text(s)/Resources used (Optional)</p>
                  <p>• Instructional materials source used: (Optional)</p>
                </div>
              </div>
              <div className="w-32 h-32 relative">
                <Pie data={pieChartData} options={{ plugins: { legend: { display: false } } }} />
                <div className="absolute  bottom-[-50px] right-[10px] text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                    <span>Yes 7 (33.3%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                    <span>No 15 (66.6%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Observer Responses Table */}
            <div className="bg-white rounded-lg p-4 overflow-x-auto">
              <div className="text-sm text-gray-600 mb-4">
                Compare individual feedback and review supporting evidence for this indicator.
              </div>
              <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-x-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Targeted Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text(s)/Resources used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${response.response === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {response.response}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{response.targetedSkills || 'No Response'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{response.textilsResources || 'No Response'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">No Response</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{response.respondent.name}</div>
                          <div className="text-gray-500">{response.respondent.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 mb-2">{response.evidence}</p>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded">
                            fileUploaded.pdf ×
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded">
                            imgUploaded.jpg ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FSI Section B */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">
                  1 FSI B. The foundational skill(s) in the lesson are part of a systematic scope and sequence.*
                </h3>
                <p className="text-gray-600 mb-2">• Students utilize previously taught skills and connect with targeted skills.</p>
                <p className="text-gray-600">• Instructional materials source used: (Optional)</p>
              </div>
              <div className="w-32 h-32 relative">
                <Pie data={pieChartDataWithThree} options={{ plugins: { legend: { display: false } } }} />
                <div className="absolute bottom-[-50px] right-[10px] text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                    <span>Yes 7 (33.3%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
                    <span>No 15 (66.6%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    <span>Could Not Determine 15 (66.6%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Observer Responses Table */}
            <div className="bg-white rounded-lg p-4 overflow-x-auto">
              <div className="text-sm text-gray-600 mb-4">
                Compare individual feedback and review supporting evidence for this indicator.
              </div>
              <table className="min-w-full overflow-x-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructional materials source used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respondent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Yes
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Collaboration checklist from group project rubric</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">John doe (You)</div>
                        <div className="text-gray-500">johndoe@gmail.com</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                      </p>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded">
                          fileUploaded.pdf ×
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded">
                          imgUploaded.jpg ×
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ObservationSession; 