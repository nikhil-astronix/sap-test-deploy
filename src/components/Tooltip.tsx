import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10, // Position above the trigger element
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible]);

  const tooltipContent = isVisible && (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
      }}
    >
      {/* Tooltip box */}
      <div
        className="
          bg-gray-900 text-white text-xs rounded-lg py-2 px-3
          shadow-lg max-h-40 overflow-y-auto max-w-xs
          border border-gray-700
        "
        style={{
          wordBreak: "break-word",
        }}
      >
        {content}
      </div>
      {/* Downward-pointing arrow */}
      <div
        className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45 mx-auto"
        style={{ marginTop: "-4px" }}
      />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block w-full cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
