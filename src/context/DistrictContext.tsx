"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DistrictContextType {
  globalDistrict: string | null;
  setGlobalDistrict: (district: string) => void;
}

const DistrictContext = createContext<DistrictContextType | undefined>(
  undefined
);

export const DistrictProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [globalDistrict, setGlobalDistrictState] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("globalDistrict")
      : null
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "globalDistrict") {
        setGlobalDistrictState(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setGlobalDistrict = (district: string) => {
    setGlobalDistrictState(district);
    localStorage.setItem("globalDistrict", district);
  };

  return (
    <DistrictContext.Provider value={{ globalDistrict, setGlobalDistrict }}>
      {children}
    </DistrictContext.Provider>
  );
};

export const useDistrict = () => {
  const context = useContext(DistrictContext);
  if (!context)
    throw new Error("useDistrict must be used within a DistrictProvider");
  return context;
};
