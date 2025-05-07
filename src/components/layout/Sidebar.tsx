'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaBuilding, 
  FaSchool, 
  FaCog, 
  FaBook, 
  FaGraduationCap, 
  FaUsers, 
  FaChartBar, 
  FaClipboardList,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';
import MultiSelectDropdown from '../MultiSelectDropdown';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <FaBuilding className="w-5 h-5" />, label: 'Districts', path: '/districts' },
  { icon: <FaSchool className="w-5 h-5" />, label: 'Schools', path: '/schools' },
  { icon: <FaCog className="w-5 h-5" />, label: 'Interventions/PD', path: '/interventions' },
  { icon: <FaBook className="w-5 h-5" />, label: 'Curricula', path: '/curriculums' },
  { icon: <FaGraduationCap className="w-5 h-5" />, label: 'Classrooms', path: '/classrooms' },
  { icon: <FaUsers className="w-5 h-5" />, label: 'Users', path: '/users' },
  { icon: <FaChartBar className="w-5 h-5" />, label: 'Observation Tools', path: '/observation-tools' },
  { icon: <FaClipboardList className="w-5 h-5" />, label: 'Observation Sessions', path: '/observation-sessions' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Placeholder district options
  const districtOptions = [
    { id: '1', label: 'District 1', value: '1' },
    { id: '2', label: 'District 2', value: '2' },
    { id: '3', label: 'District 3', value: '3' },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // Mobile menu button that's always visible
  const MobileMenuButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 rounded-md bg-emerald-600 text-white md:hidden"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
    </button>
  );

  const sidebarContent = (
    <AnimatedContainer 
      variant="slide" 
      className={`bg-gray-50 min-h-screen transition-all duration-300 ease-in-out flex-shrink-0
        ${isExpanded 
          ? 'w-[280px] 2xl:w-96 xl:w-80 lg:w-72 md:w-64' 
          : 'w-16 md:w-20'
        } 
        ${isMobile 
          ? 'fixed left-0 top-0 bottom-0 z-40' 
          : 'relative'}`}
    >
       {isMobile && (
        <div className="relative">
          <button
            onClick={toggleSidebar}
            className="absolute right-7 top-9  bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-full shadow-lg transition-colors duration-200 z-10"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <FaChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <FaChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )} 

      <div className={`p-6 ${!isExpanded && !isMobile ? 'px-6' : ''}`}>
        <AnimatedContainer variant="fade">
          <h2 className={`text-lg font-semibold mb-5 text-center transition-opacity duration-200 ${
            !isExpanded && !isMobile ? 'opacity-0' : 'opacity-100'
          }`}>
            Setup
          </h2>
        </AnimatedContainer>

        <div className="space-y-1.5 ">
          {isExpanded && (
            <AnimatedContainer variant="fade" className="mb-3">
              <MultiSelectDropdown
                label="District"
                options={districtOptions}
                selectedValues={[]}
                onChange={() => {}}
                placeholder="Select district"
                className="text-xs"
                required
                allowClear={false}
                isMulti={false}
              />
            </AnimatedContainer>
          )}

          <AnimatedContainer variant="stagger" staggerItems={true}>
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02, x: isExpanded ? 4 : 0 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href={item.path}
                  className={`flex items-center p-1.5 mt-2 rounded-md transition-colors text-gray-600 ${
                    (pathname || '').startsWith(item.path)
                      ? 'bg-white text-gray-900 shadow-md rounded-lg border'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`${
                    (pathname || '').startsWith(item.path)
                      ? 'text-emerald-800'
                      : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </span>
                  {(isExpanded || isMobile) && (
                    <span className="ml-2.5 text-sm">{item.label}</span>
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedContainer>
  );

  // Backdrop for mobile menu
  const Backdrop = () => (
    isMobile && isMobileOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setIsMobileOpen(false)}
      />
    )
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <MobileMenuButton />
      <Backdrop />
      {(isMobile && isMobileOpen) || !isMobile ? sidebarContent : null}
      <div className="flex-1 overflow-x-hidden">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar; 