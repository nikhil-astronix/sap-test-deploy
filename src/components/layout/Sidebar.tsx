'use client';

import React from 'react';
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
  FaClipboardList 
} from 'react-icons/fa';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <FaBuilding className="w-5 h-5" />, label: 'Districts', path: '/districts' },
  { icon: <FaSchool className="w-5 h-5" />, label: 'Schools', path: '/schools' },
  { icon: <FaCog className="w-5 h-5" />, label: 'Interventions/PD', path: '/interventions' },
  { icon: <FaBook className="w-5 h-5" />, label: 'Curriculums', path: '/curriculums' },
  { icon: <FaGraduationCap className="w-5 h-5" />, label: 'Classrooms', path: '/classrooms' },
  { icon: <FaUsers className="w-5 h-5" />, label: 'Users', path: '/users' },
  { icon: <FaChartBar className="w-5 h-5" />, label: 'Observation Tools', path: '/observation-tools' },
  { icon: <FaClipboardList className="w-5 h-5" />, label: 'Observation Sessions', path: '/observation-sessions' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <AnimatedContainer 
      variant="slide" 
      className="w-96 bg-gray-50 p-6 min-h-screen"
    >
      <AnimatedContainer variant="fade">
        <h2 className="text-2xl font-semibold mb-8 text-center">Setup</h2>
      </AnimatedContainer>

      <div className="space-y-2">
        <AnimatedContainer variant="fade" className="mb-4">
          <label className="block text-sm text-gray-700 font-medium mb-2">District</label>
          <select className="w-full p-2 bg-gray-100 border rounded-lg shadow-sm text-gray-400 text-xs">
            <option>District</option>
          </select>
        </AnimatedContainer>

        <AnimatedContainer variant="stagger" staggerItems={true}>
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href={item.path}
                className={`flex items-center p-2 rounded-md transition-colors text-gray-600 ${
                  (pathname || '').startsWith(item.path)
                    ? 'bg-white text-gray-900 shadow-md rounded-lg border'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`mr-3 ${
                  (pathname || '').startsWith(item.path)
                    ? 'text-emerald-800'
                    : 'text-gray-400'
                }`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  );
};

export default Sidebar; 