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
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        hidden group-hover:flex flex-col items-center
        z-50
      "
      style={{ minWidth: "200px" }} // make tooltip wide enough
    >
      {/* Tooltip box above */}
      <div
        className="
          bg-black text-white text-xs rounded py-2 px-3
          shadow-lg max-h-40 overflow-y-auto max-w-xs
        "
        style={{ wordBreak: "break-word" }} // break long words
      >
        {content}
      </div>
      {/* Downward-pointing carrot below the box */}
      <div className="w-2 h-2 bg-black rotate-45 mt-[-4px]" />
    </div>
  </div>
);

export default Tooltip;
