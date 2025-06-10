"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignOut, UserCircle } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

const Header = ({
  handleSetupClick,
  handleDashboardClick,
}: {
  handleSetupClick: () => void;
  handleDashboardClick: () => void;
}) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "setup" | null>(
    null
  );
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedRole = localStorage.getItem("userrole");
    let firstname = localStorage.getItem("name");
    setRole(storedRole);
    setName(firstname);

    if (pathname === "/" || pathname === "/system-dashboard") {
      setActiveTab("dashboard");
    } else if (pathname === "/network") {
      setActiveTab("setup");
    } else {
      setActiveTab(null);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleDashboardClickInternal = () => {
    handleDashboardClick(); // sets sidebar to false & navigates to Networks
  };

  const handleSetupClickInternal = () => {
    setActiveTab("setup");
    router.push("/network");
    handleSetupClick(); // trigger passed-in callback
  };

  return (
    <AnimatedContainer
      variant="fade"
      className="h-16 flex items-center justify-between px-6 border-b bg-gray-50 sticky top-0 z-10"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/" className="flex items-center">
          <img src="\logo.png" alt="Logo" />
        </Link>
      </motion.div>

      <AnimatedContainer
        variant="stagger"
        staggerItems={true}
        className="flex items-center space-x-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-1.5 text-sm transition-colors font-medium ${
            activeTab === "dashboard"
              ? "text-[#2A7251] text-[14px]-400"
              : "text-black text-[14px]-400"
          } hover:bg-[#2A7251] hover:text-white px-2 py-2 rounded`}
          onClick={handleDashboardClickInternal}
        >
          Dashboard
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-1.5 text-sm transition-colors font-medium ${
            activeTab === "setup"
              ? "text-[#2A7251] text-[14px]-400"
              : "text-black text-[14px]-400"
          }  hover:bg-[#2A7251] hover:text-white px-2 py-2 rounded`}
          onClick={handleSetupClickInternal}
        >
          Setup
        </motion.button>

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mr-3 text-right">
            <div className="text-sm font-medium">{name}</div>
            <Link href="/system-dashboard" className="block">
              <div className="text-xs text-emerald-700 cursor-pointer">
                {role}
              </div>
            </Link>
          </div>
          <div className="relative" ref={dropdownRef}>
            <motion.button
              className="p-1.5 rounded-full hover:bg-gray-100"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 py-1 border">
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  {role === "Observer" ? (
                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-2 px-6 py-2 text-white bg-[#2A7251] text-sm rounded-md hover:bg-[#2A7251]"
                    >
                      <UserCircle className="text-white-400" size={18} />
                      Profile
                    </button>
                  ) : null}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black bg-white rounded hover:bg-[#2A7251] hover:text-white"
                  >
                    <SignOut className="text-black-400" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatedContainer>
    </AnimatedContainer>
  );
};

export default Header;
