"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaClipboardList,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion } from "framer-motion";
import MultiSelectDropdown from "../MultiSelectDropdown";
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
import { useDistrict } from "@/context/DistrictContext";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export const navItemsSystemAdmin: NavItem[] = [
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

export const navItemsAdmin: NavItem[] = [
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
  if (pathname === "/observation-form") {
    return null;
  }
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const { globalDistrict, setGlobalDistrict } = useDistrict();
  const [selectedDistrict, setSelectedDistricts] = useState<string[]>(
    globalDistrict ? [globalDistrict] : []
  );
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let storedRole = localStorage.getItem("userrole");
    setRole(storedRole);
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
        setIsMobileOpen(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = role === "Super Admin" ? navItemsSystemAdmin : navItemsAdmin;
  const routing = role === "Super Admin" ? "/network" : "/interventions";
  useEffect(() => {
    if (selectedDistrict.length > 0) {
      setGlobalDistrict(selectedDistrict[0]);

      const navItemsPath = navItems.map((item) => item.path);
      if (
        pathname === "/select-district" ||
        !navItemsPath.includes(pathname || "")
      ) {
        router.push(routing);
      } else {
        router.refresh();
      }
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (!globalDistrict) {
      router.push("/select-district");
    } else {
      setSelectedDistricts([globalDistrict]);
    }
  }, [globalDistrict]);

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
      className={`h-full bg-gray-50 transition-all duration-300 ease-in-out flex-shrink-0
        ${isExpanded ? "w-[280px]" : "w-[280px]"}
      `}
    >
      {isMobile && (
        <div className="relative">
          <button
            onClick={toggleSidebar}
            className="absolute left-6 top-6 bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-full shadow-lg z-10"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <FaChevronLeft className="w-4 h-4" />
            ) : (
              <FaChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      <div className="p-6">
        <AnimatedContainer variant="fade">
          <h2
            className={`text-lg font-semibold mb-5 text-center transition-opacity duration-200 ml-8 ${
              !isExpanded && !isMobile ? "opacity-0" : "opacity-100"
            }`}
          >
            Setup
          </h2>
        </AnimatedContainer>

        {isExpanded && (
          <AnimatedContainer variant="fade" className="mb-3">
            <MultiSelectDropdown
              label="District"
              options={districts}
              selectedValues={selectedDistrict}
              onChange={(values) => setSelectedDistricts(values)}
              placeholder="District"
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
                      ? "bg-white text-[#494B56] font-semibold shadow-md rounded-lg border"
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
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      <>
        <MobileMenuButton />

        {/* Sidebar */}
        {isMobile ? (
          <>
            {/* Backdrop */}
            {isMobileOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsMobileOpen(false)}
              />
            )}

            <div
              className={`
            fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
            >
              {sidebarContent}
            </div>
          </>
        ) : (
          <div className="h-full">{sidebarContent}</div>
        )}
      </>

      {/* Backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden bg-white z-10 relative">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
