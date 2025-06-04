import React, { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="relative inline-block group w-full">
    {children}
    <div
      className="
        absolute top-full left-1/2 transform -translate-x-1/2 mt-2
        hidden group-hover:flex flex-col items-center
        z-10
      "
    >
      {/* Carrot */}
      <div className="w-2 h-2 bg-black translate-y-1 mb-[-4px]" />
      {/* Tooltip Content */}
      <div
        className="
          bg-black text-white text-xs rounded py-2 px-3
          shadow-lg whitespace-nowrap
        "
      >
        {content}
      </div>
    </div>
  </div>
);

export default Tooltip;
