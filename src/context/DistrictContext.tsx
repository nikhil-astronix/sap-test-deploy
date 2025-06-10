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
  const [globalDistrict, setGlobalDistrictState] = useState<string | null>(
    null
  );

  useEffect(() => {
    const stored = localStorage.getItem("globalDistrict");
    if (stored) setGlobalDistrictState(stored);
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
