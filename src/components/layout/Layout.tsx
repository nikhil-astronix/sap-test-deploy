"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { AnimatedContainer } from "@/components/ui/animated-container";

interface LayoutProps {
  children: React.ReactElement<{ sidebarVisible?: boolean }>;
}

const Layout = ({ children }: LayoutProps) => {
  const [showSetup, setShowSetup] = useState(false);

  const toggleSetup = () => {
    setShowSetup((prevState) => !prevState);
  };

  // Create a function to modify child elements to pass the sidebar state
  const childrenWithProps = React.Children.map(children, (child) => {
    // Check if the child is a valid element
    if (React.isValidElement(child)) {
      // Clone the child with additional props
      return React.cloneElement(child, { sidebarVisible: showSetup });
    }
    return child;
  });

  return (
    <AnimatedContainer variant="fade" className="min-h-screen bg-gray-50">
      <Header handleSetupClick={toggleSetup} />
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
        <div className="py-6 px-6  h-[calc(100vh-64px)]">
          {childrenWithProps}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default Layout;
