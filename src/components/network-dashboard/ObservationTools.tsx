"use client";

import { useEffect, useState } from "react";
import { Network, Hash, Building, Calendar } from "lucide-react";
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

  // Define columns for observation tools table
  const toolsColumns: NetworkColumn[] = [
    {
      key: "name",
      label: "Observation Tool",
      icon: <Network className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "sessions",
      label: "Total Sessions",
      icon: <Hash className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "districts",
      label: "Used In Districts",
      icon: <Building className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "schools",
      label: "Used In Schools",
      icon: <Building className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "lastUsedDate",
      label: "Last Used Date",
      icon: <Calendar className="h-4 w-4" />,
      sortable: true,
    },
  ];

  // Custom cell renderer for observation tools table
  const renderCell = (row: NetworkTableRow, columnKey: string) => {
    switch (columnKey) {
      case "districts":
        if (!row.districtsList || row.districtsList.length === 0) return "None";
        
        // Show first two districts and then +X more if there are more
        const displayDistricts = row.districtsList.slice(0, 2);
        const remainingCount = row.districtsList.length - 2;
        
        return (
          <div>
            {displayDistricts.join(", ")}
            {remainingCount > 0 && ` +${remainingCount} more`}
          </div>
        );
      
      case "lastUsedDate":
        return row.lastUsedDate || "None";
        
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