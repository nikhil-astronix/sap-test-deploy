'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { FaSearch, FaArchive, FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BsBarChart, BsBarChartSteps } from 'react-icons/bs';
import { BsCalendarEvent, BsPeople } from 'react-icons/bs';
import { HiOutlineArrowsUpDown } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

interface ObservationTool {
  id: string;
  name: string;
  createdOn: string;
  createdBy: string[];
}

type SortField = 'name' | 'createdOn' | 'createdBy';
type SortOrder = 'asc' | 'desc' | null;

interface SortConfig {
  field: SortField | null;
  order: SortOrder;
}

export default function ObservationToolsPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    order: null,
  });

  // Mock data - replace with actual API data
  const tools: ObservationTool[] = [
    {
      id: '1',
      name: 'Board e² Math',
      createdOn: 'May 8, 2025',
      createdBy: ['Jane Doe', 'John Doe', '+2 more'],
    },
    {
      id: '2',
      name: 'e² Literacy FS',
      createdOn: 'May 7, 2025',
      createdBy: ['John Doe'],
    },
    {
      id: '3',
      name: 'e² Math',
      createdOn: 'May 6, 2025',
      createdBy: ['Jane Doe'],
    },
    {
      id: '4',
      name: 'IPG Literacy',
      createdOn: 'May 6, 2025',
      createdBy: ['John Doe'],
    },
  ];

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field
          ? prevConfig.order === 'asc'
            ? 'desc'
            : prevConfig.order === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <HiOutlineArrowsUpDown className="ml-auto w-3 h-3 " />;
    }
    if (sortConfig.order === 'asc') {
      return <FaSortUp className="ml-auto w-3 h-3" />;
    }
    if (sortConfig.order === 'desc') {
      return <FaSortDown className="ml-auto w-3 h-3" />;
    }
    return <FaSort className="ml-auto w-3 h-3" />;
  };

  const sortedAndFilteredTools = useMemo(() => {
    let filtered = [...tools];

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerQuery) ||
          tool.createdOn.toLowerCase().includes(lowerQuery) ||
          tool.createdBy.some((creator) => creator.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply sorting
    if (sortConfig.field && sortConfig.order) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.field!];
        let bValue = b[sortConfig.field!];

        // Handle createdBy array comparison
        if (sortConfig.field === 'createdBy') {
          aValue = a.createdBy.join(', ');
          bValue = b.createdBy.join(', ');
        }

        if (sortConfig.order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [tools, searchQuery, sortConfig]);

  const handleAddTool = () => {
    router.push('/observation-tools/new');
  };

  return (
    <AnimatedContainer variant="fade" className="p-8 bg-white rounded-lg shadow-sm h-full">
      <AnimatedContainer variant="slide" className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">Observation Tools</h1>
        <p className="text-gray-600 text-center">
          Browse all observation tools across the platform. Add, update, or archive tools as needed.
        </p>
      </AnimatedContainer>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <FaArchive className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAddTool}
            className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="flex items-center space-x-3">
          <span className={`text-sm ${!isActive ? 'text-gray-900' : 'text-gray-500'}`}>Active</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out"
            style={{ backgroundColor: isActive ? '#047857' : '#D1D5DB' }}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>Archived</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#2563eb] text-white">
              <th className="w-12 px-4 py-3 text-left font-medium text-sm border-r border-blue-400 first:border-l-0">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <BsBarChart className="mr-2 w-4 h-4" />
                  <span>Observation Tool</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort('createdOn')}
              >
                <div className="flex items-center">
                  <BsCalendarEvent className="mr-2 w-4 h-4" />
                  <span>Created On</span>
                  {getSortIcon('createdOn')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort('createdBy')}
              >
                <div className="flex items-center">
                  <BsPeople className="mr-2 w-4 h-4" />
                  <span>Created By</span>
                  {getSortIcon('createdBy')}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm last:border-r-0">
                <div className="flex items-center">
                  <span>Action</span>
                 
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTools.map((tool, index) => (
              <motion.tr
                key={tool.id}
                className={`${index % 2 === 1 ? 'bg-[#EFF6FF]' : 'bg-white'}`}
                whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.9)' }}
              >
                <td className="w-12 px-4 py-3 border-b border-gray-200 border-r first:border-l-0">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-4 py-3 border-b border-gray-200 border-r text-sm">
                  {tool.name}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 border-r text-sm text-gray-600">
                  {tool.createdOn}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 border-r text-sm">
                  {tool.createdBy.map((creator, idx) => (
                    <span key={idx}>
                      {idx > 0 && idx < tool.createdBy.length - 1 && ', '}
                      {creator.includes('+') ? (
                        <span className="text-emerald-600">{creator}</span>
                      ) : (
                        creator
                      )}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 last:border-r-0">
                  <button className="text-emerald-600 hover:text-emerald-800">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedContainer>
  );
} 