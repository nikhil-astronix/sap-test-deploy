"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  FaChevronRight,
} from "react-icons/fa";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion } from "framer-motion";
import MultiSelectDropdown from "../MultiSelectDropdown";
//import { Tag } from "lucide-react";
import {
  Network,
  City,
  Tag,
  GraduationCap,
  Book,
  ChalkboardTeacher,
  Users,
  Toolbox,
  Note,
} from "@phosphor-icons/react";
import { fetchAllDistricts } from "@/services/districtService";
import { getDistrictsPayload } from "@/services/districtService";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    icon: <Network className="w-5 h-5" />,
    label: "Networks",
    path: "/network",
  },
  {
    icon: <City className="w-5 h-5" />,
    label: "Districts",
    path: "/districts",
  },
  {
    icon: <Tag className="w-5 h-5" />,
    label: "Tags & Attributes",
    path: "/interventions",
  },
  {
    icon: <Book className="w-5 h-5" />,
    label: "Instructional Materials",
    path: "/curriculums",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    label: "Schools",
    path: "/schools",
  },
  {
    icon: <ChalkboardTeacher className="w-5 h-5" />,
    label: "Classrooms",
    path: "/classrooms",
  },
  { icon: <Users className="w-5 h-5" />, label: "Users", path: "/users" },
  {
    icon: <Toolbox className="w-5 h-5" />,
    label: "Observation Tools",
    path: "/observation-tools",
  },
  {
    icon: <Note className="w-5 h-5" />,
    label: "Observation Sessions",
    path: "/observation-sessions",
  },
  {
    icon: <FaClipboardList className="w-5 h-5" />,
    label: "Observation Form",
    path: "/observation-form",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedDistrictValue = localStorage.getItem("districtValue");
    if (storedDistrictValue) {
      setSelectedDistricts([storedDistrictValue]);
    }
  }, []);
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    const payload: getDistrictsPayload = {
      is_archived: null,
      network_id: null,
      sort_by: null,
      sort_order: null,
      page: 1,
      limit: 100,
      search: null,
    };
    fetchAllDistrictsInfo(payload);
  }, []);

  const fetchAllDistrictsInfo = async (payload: getDistrictsPayload) => {
    const response = await fetchAllDistricts(payload);

    if (response.success) {
      const formattedDistricts = response.data.districts.map(
        (district: any) => ({
          id: district._id,
          label: district.name,
          value: district._id,
        })
      );
      setDistricts(formattedDistricts);
    } else {
      setDistricts([]);
    }
  };

  // Mobile menu button that's always visible
  const MobileMenuButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 rounded-md bg-emerald-600 text-white md:hidden"
      aria-label="Toggle menu"
    >
      {isMobileOpen ? (
        <FaTimes className="w-6 h-6" />
      ) : (
        <FaBars className="w-6 h-6" />
      )}
    </button>
  );

  const sidebarContent = (
    <div
      className={`bg-gray-50 min-h-screen transition-all duration-300 ease-in-out flex-shrink-0
    ${
      isExpanded ? "w-[280px] 2xl:w-96 xl:w-80 lg:w-72 md:w-64" : "w-16 md:w-20"
    } 
    ${isMobile ? "fixed left-0 top-0 bottom-0 z-40" : "relative"}`}
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

      <div className={`p-6 ${!isExpanded && !isMobile ? "px-6" : ""}`}>
        <AnimatedContainer variant="fade">
          <h2
            className={`text-lg font-semibold mb-5 text-center transition-opacity duration-200 ${
              !isExpanded && !isMobile ? "opacity-0" : "opacity-100"
            }`}
          >
            Setup
          </h2>
        </AnimatedContainer>

        <div className="space-y-1.5 ">
          {isExpanded && (
            <AnimatedContainer variant="fade" className="mb-3">
              <MultiSelectDropdown
                label="District"
                options={districts}
                selectedValues={selectedDistricts}
                onChange={(values) => setSelectedDistricts(values)}
                placeholder="Select district"
                className="text-xs"
                required
                allowClear={false}
                isMulti={false}
              />
            </AnimatedContainer>
          )}

          <AnimatedContainer variant="stagger" staggerItems={true}>
            <div className="flex flex-col gap-y-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.02, x: isExpanded ? 4 : 0 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center p-1.5 rounded-md transition-colors text-gray-600 ${
                      (pathname || "").startsWith(item.path)
                        ? "bg-white text-gray-900 shadow-md rounded-lg border"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center py-1.5">
                      <span
                        className={`${
                          (pathname || "").startsWith(item.path)
                            ? "text-emerald-800"
                            : "text-gray-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {(isExpanded || isMobile) && (
                        <span className="ml-2.5 text-sm">{item.label}</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );

  // Backdrop for mobile menu
  const Backdrop = () =>
    isMobile &&
    isMobileOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setIsMobileOpen(false)}
      />
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
