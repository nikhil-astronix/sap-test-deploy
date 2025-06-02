"use client";

import { useEffect, useState } from "react";
import { School, Building, Calendar, BadgeCheck } from "lucide-react";
import NetworkDashboardTable, {
  NetworkColumn,
  NetworkTableRow,
  NetworkAdmin,
  SessionStatusType
} from "./NetworkDashboardTable";
import { getDistrictsByNetwork } from "@/services/networkService";

interface DistrictsProps {
  searchTerm?: string;
}

export default function Districts({ searchTerm = '' }: DistrictsProps) {
  const [districtsData, setDistrictsData] = useState<NetworkTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Define columns for districts table
  const districtsColumns: NetworkColumn[] = [
    {
      key: "name",
      label: "District",
      icon: <Building className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "admins",
      label: "Admins",
      icon: <School className="h-4 w-4" />,
      sortable: false,
    },
    {
      key: "schools",
      label: "Total Schools",
      icon: <School className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "classrooms",
      label: "Total Classrooms",
      icon: <Building className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "lastSession",
      label: "Last Session",
      icon: <Calendar className="h-4 w-4" />,
      sortable: true,
    },
    {
      key: "sessionStatus",
      label: "Session Status",
      icon: <BadgeCheck className="h-4 w-4" />,
      sortable: true,
    },
  ];

  // Custom cell renderer for districts table
  const renderCell = (row: NetworkTableRow, columnKey: string) => {
    switch (columnKey) {
      case "admins":
        if (!row.admins || row.admins.length === 0) return "None";
        
        // Show first two admins and then +X more if there are more
        const displayAdmins = row.admins.slice(0, 2);
        const remainingCount = row.admins.length - 2;
        
        return (
          <div>
            {displayAdmins.map((admin: NetworkAdmin) => (
              `${admin.first_name} ${admin.last_name}`
            )).join(", ")}
            {remainingCount > 0 && ` +${remainingCount} more`}
          </div>
        );
      
      case "sessionStatus":
        return row.sessionStatus || "No Session";
        
      default:
        return row[columnKey];
    }
  };

  // Fetch districts data
  const fetchDistrictsData = async () => {
    setIsLoading(true);
    try {
      const response = await getDistrictsByNetwork();
      if (response) {
        setDistrictsData(response?.data);
      } else {
        setDistrictsData([]);
        setError("Failed to load districts data");
      }
    } catch (err) {
      setDistrictsData([]);
      setError("An error occurred while fetching districts data");
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
    fetchDistrictsData();
  }, []);

  return (
    <div className="space-y-4">
      <NetworkDashboardTable
        data={districtsData}
        columns={districtsColumns}
        headerColor="#2264AC"
        rowColor="#E9F3FF"
        renderCell={renderCell}
        searchTerm={localSearchTerm}
        isLoading={isLoading}
        error={error}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : districtsData.length === 0 && !error ? (
        <div className="text-center py-8 text-gray-500">
          No district data found
        </div>
      ) : null}
    </div>
  );
}