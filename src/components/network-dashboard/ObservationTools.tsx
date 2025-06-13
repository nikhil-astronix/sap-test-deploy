"use client";

import { useEffect, useState } from "react";
import {Hash, Toolbox, CalendarDots} from "@phosphor-icons/react";
import NetworkDashboardTable, {
  NetworkColumn,
  NetworkTableRow,
} from "./NetworkDashboardTable";
import { getObservationToolsByNetwork } from "@/services/networkService";

interface ObservationToolsProps {
  searchTerm?: string;
}

export default function ObservationTools({ searchTerm = '' }: ObservationToolsProps) {
  const [toolsData, setToolsData] = useState<NetworkTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Background colors for observation tool names
  const bgColors = [
    "bg-[#E9F3FF]",
    "bg-[#D1FAE5]",
    "bg-[#EDFFFF]",
    "bg-[#FFFCDD]",
    "bg-[#F4EBFF]",
    "bg-[#EDFFFF]",
    "bg-[#F9F5FF]",
  ];

  // Define columns for observation tools table
  const toolsColumns: NetworkColumn[] = [
    {
      key: "name",
      label: "Observation Tool",
      icon: <Toolbox size={20} />,
      sortable: true,
    },
    {
      key: "usage_count",
      label: "Total Sessions",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "district_count",
      label: "Used In Districts",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "schools_count",
      label: "Used In Schools",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "last_used",
      label: "Last Used Date",
      icon: <CalendarDots size={20} />,
      sortable: true,
    },
  ];

  // Custom cell renderer for observation tools table
  const renderCell = (row: NetworkTableRow, columnKey: string) => {
    switch (columnKey) {
      case "name":
        const name = row[columnKey] as string;
        // Get index based on row index to cycle through background colors
        const index = toolsData.findIndex(item => item === row);
        const bgColor = bgColors[index % bgColors.length];
        
        return (
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
          >
            {name}
          </span>
        );

      case "district_count":
        const districts = row.districts_used as string[];
        if (!districts || districts.length === 0) return "None";
        
        // Show first two districts and then +X more if there are more
        const displayDistricts = districts.slice(0, 2);
        const remainingCount = districts.length - 2;
        
        return (
          <div>
            {displayDistricts.join(", ")}
            {remainingCount > 0 && <span className="text-[#F9F5FF]"> +{remainingCount} more</span>}
          </div>
        );
      
      case "last_used":
        return row[columnKey] || "None";
        
      default:
        return row[columnKey];
    }
  };

  // Fetch observation tools data
  const fetchObservationToolsData = async () => {
    setIsLoading(true);
    try {
      const response = await getObservationToolsByNetwork();
      console.log(response, 'checking the reponse in tools');
      if (response) {
        // Transform data if needed to match NetworkTableRow format
        setToolsData(response?.data?.tools);
      } else {
        setToolsData([]);
        setError("Failed to load observation tools data");
      }
    } catch (err) {
      setToolsData([]);
      setError("An error occurred while fetching observation tools data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update localSearchTerm when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    fetchObservationToolsData();
  }, []);

  return (
    <div className="space-y-4">
      <NetworkDashboardTable
        data={toolsData}
        columns={toolsColumns}
        headerColor="#6C4996"
        rowColor="#F9F5FF"
        renderCell={renderCell}
        searchTerm={localSearchTerm}
        isLoading={isLoading}
        error={error}
      />
      {/* {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      ) : toolsData?.length === 0 && !error ? (
        <div className="text-center py-8 text-gray-500">
          No observation tools data found
        </div>
      ) : null
      } */}
      {isLoading &&
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      }
    </div>
  );
}