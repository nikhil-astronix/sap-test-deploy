"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactElement<{ sidebarVisible?: boolean }>;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(false);

  // On initial load, check localStorage for the previous selection
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab === "setup") {
      setShowSetup(true);
    } else {
      setShowSetup(false);
    }
  }, []);

  const toggleSetup = () => {
    setShowSetup(true);
    localStorage.setItem("activeTab", "setup");
  };

  // const handleDashboardClick = () => {
  //   setShowSetup(false);
  //   localStorage.setItem("activeTab", "dashboard");
  //   router.push("/system-dashboard");
  // };

  const handleDashboardClick = () => {
    setShowSetup(false);
    // Check both possible localStorage keys for role (userrole from login page, userRole as fallback)
    let role = localStorage.getItem("userrole") || localStorage.getItem("userRole") || "";
    
    if (role === "Super Admin") {
      localStorage.setItem("activeTab", "dashboard");
      router.push("/system-dashboard");
    } else if (role === "District Admin") {
      localStorage.setItem("activeTab", "dashboard");
      router.push("/admin-dashboard");
    } else if (role === "Network Admin") {
      localStorage.setItem("activeTab", "dashboard");
      router.push("/network-dashboard");
    } else {
      localStorage.setItem("activeTab", "dashboard");
      router.push("/users");
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { sidebarVisible: showSetup });
    }
    return child;
  });

  return (
    <AnimatedContainer variant="fade" className="min-h-screen bg-gray-50">
      <Header
        handleSetupClick={toggleSetup}
        handleDashboardClick={handleDashboardClick}
      />
      {showSetup ? (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <Sidebar />
          <AnimatedContainer
            variant="slide"
            className="flex-1 py-6 px-2 pr-6 w-full overflow-auto"
          >
            {childrenWithProps}
          </AnimatedContainer>
        </div>
      ) : (
        <div className="py-6 px-6 h-[calc(100vh-64px)]">
          {childrenWithProps}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default Layout;
