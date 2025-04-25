'use client';

import { useState, useRef } from 'react';
import { Menu } from '@headlessui/react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import CurriculumCard from './CurriculumCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Curriculum {
  id: string;
  title: string;
  description: string;
  type: 'Default' | 'Custom';
  isArchived: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SAMPLE_CURRICULUMS: Curriculum[] = [
  {
    id: '1',
    title: 'Amplify',
    description: 'Amplify Desmos Math promotes a collaborative classroom & guides teachers as facilitator.',
    type: 'Custom',
    isArchived: true,
  },
  {
    id: '2',
    title: 'Wonders',
    description: 'McGraw-Hill Education Wonders is a K-6 literacy curriculum designed with a wealth of research-based print and digital resources.',
    type: 'Default',
    isArchived: false,
  },
  {
    id: '3',
    title: 'Illustrative Math',
    description: 'Comprehensive math curriculum, tasks & lesson plans for engaging mathematical discussion',
    type: 'Custom',
    isArchived: true,
  },
  {
    id: '4',
    title: 'Wit & Wisdom',
    description: 'At Wit & Wisdom\'s core is a framework of strategic questions designed to guide teachers and students through reading, writing, speaking, listening, and language development.',
    type: 'Default',
    isArchived: false,
  },
  {
    id: '5',
    title: 'Wonders',
    description: 'McGraw-Hill Education Wonders is a K-6 literacy curriculum designed with a wealth of research-based print and digital resources.',
    type: 'Default',
    isArchived: true,
  },
  {
    id: '6',
    title: 'Wonders',
    description: 'McGraw-Hill Education Wonders is a K-6 literacy curriculum designed with a wealth of research-based print and digital resources.',
    type: 'Default',
    isArchived: false,
  }
];

export default function CurriculumList() {
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<'Default' | 'Custom' | 'Both'>('Both');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [curriculums, setCurriculums] = useState(SAMPLE_CURRICULUMS);

  const handleArchive = (curriculumId: string) => {
    setCurriculums(curriculums.map(curriculum => {
      if (curriculum.id === curriculumId) {
        return {
          ...curriculum,
          isArchived: !curriculum.isArchived
        };
      }
      return curriculum;
    }));
  };

  const filteredCurriculums = curriculums
    .filter((curriculum) => {
      const matchesSearch = curriculum.title.toLowerCase().includes(search.toLowerCase()) ||
        curriculum.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'Both' ? true : curriculum.type === filterType;
      const matchesArchived = curriculum.isArchived === showArchived;
      return matchesSearch && matchesType && matchesArchived;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        case 'newest':
          return -1; // Assuming newest first for now
        case 'oldest':
          return 1; // Assuming oldest last for now
        default:
          return 0;
      }
    });

  const handleFilterReset = () => {
    setSearch('');
    setShowArchived(false);
    setFilterType('Both');
    setSortBy('newest');
  };

  return (
    <div className="px-6 py-2 w-full flex flex-col h-full">
     
        <div className="flex-none space-y-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 text-center">Curriculums</h1>
            <p className="mt-1 text-sm text-gray-600 text-center">
              View, edit, and organize all available curriculums in one place.
            </p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex justify-between items-center"
          >
            <div className="relative w-96" ref={filterRef}>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center pr-3">
                <div className="h-5 w-px bg-gray-300 mr-3"></div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1 rounded-lg ${showFilters ? 'bg-emerald-700 text-white' : ''}`}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold">Filter By</h3>
                    <button
                      onClick={handleFilterReset}
                      className="text-emerald-700 hover:text-emerald-800 text-sm"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Filter Type Buttons */}
                  <div className="flex gap-2 mb-6 text-sm">
                    {(['Default', 'Custom', 'Both'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type as 'Default' | 'Custom' | 'Both')}
                        className={`px-4 py-2 rounded-lg ${
                          type === filterType
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type}({
                          SAMPLE_CURRICULUMS.filter(c => 
                            type === 'Both' ? true : c.type === type
                          ).length
                        })
                      </button>
                    ))}
                  </div>

                  {/* Sort Options */}
                  <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2">Sort By</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { value: 'newest', label: 'Newest first' },
                        { value: 'oldest', label: 'Oldest first' },
                        { value: 'az', label: 'Alphabetical (A-Z)' },
                        { value: 'za', label: 'Alphabetical (Z-A)' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              type="radio"
                              name="sortBy"
                              value={option.value}
                              className="sr-only"
                              checked={sortBy === option.value}
                              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'az' | 'za')}
                            />
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              sortBy === option.value ? 'border-emerald-700' : 'border-gray-300'
                            }`}>
                              {sortBy === option.value && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full" />
                              )}
                            </div>
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800 transition-colors mt-4"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/curriculums/new')}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              + New Curriculum
            </motion.button>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Active</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowArchived(!showArchived)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showArchived ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              >
                <motion.span
                  layout
                  initial={false}
                  animate={{
                    x: showArchived ? 24 : 4
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                  className="inline-block h-4 w-4 rounded-full bg-white"
                />
              </motion.button>
              <span>Archived</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2"
            >
              {filteredCurriculums.map((curriculum) => (
                <motion.div
                  key={curriculum.id}
                  variants={item}
                >
                  <CurriculumCard
                    title={curriculum.title}
                    description={curriculum.description}
                    type={curriculum.type}
                    isArchived={curriculum.isArchived}
                    onEdit={() => {/* Handle edit */}}
                    onArchive={() => handleArchive(curriculum.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    
  );
} 