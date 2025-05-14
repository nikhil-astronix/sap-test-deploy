"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { motion } from "framer-motion";

const Header = ({ handleSetupClick }: any) => {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    let storedRole = localStorage.getItem("userRole");
    if (storedRole === "super-admin") {
      storedRole = "Super Admin";
    } else if (storedRole === "admin") {
      storedRole = "Admin";
    }
    setRole(storedRole);
  }, []);

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
        <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
          <Link
            href="/system-dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            onClick={handleSetupClick}
          >
            Dashboard
          </Link>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-1.5 bg-emerald-700 text-white text-sm rounded-md hover:bg-emerald-800 transition-colors"
          onClick={handleSetupClick}
        >
          Setup
        </motion.button>

        <motion.div
          className="flex items-center pl-6 "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mr-3 text-right">
            <div className="text-sm font-medium">John Doe</div>
            <Link href="/system-dashboard" className="block">
              <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer">
                {role}
              </div>
            </Link>
            {/* <Link href="/admin-dashboard" className="block">
              <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer">
                Admin
              </div>
            </Link> */}
          </div>
          <motion.button
            className="p-1.5 rounded-full hover:bg-gray-100"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
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
        </motion.div>
      </AnimatedContainer>
    </AnimatedContainer>
  );
};

export default Header;
