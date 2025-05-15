"use client";

import { useState, useEffect } from "react";
import {
  Network,
  Building2,
  Users,
  Hash,
  Clock,
  ActivitySquare,
  Settings,
} from "lucide-react";
import DashboardTable, {
  TableRow,
  Column,
  TableFilters,
} from "./DashboardTable";
import { fetchDistricts } from "@/services/dashboardService";
import { fetchDistrictsPayload } from "@/models/dashboard";

interface DistrictsProps {
  searchTerm?: string;
}

const Districts = ({ searchTerm = "" }: DistrictsProps) => {
  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "name",
    sort_order: "asc",
  });

  // Filter data when search term changes or filters changed
  useEffect(() => {
    fetchDistrictsInfo();
  }, [selectedFilters, searchTerm]);

  const fetchDistrictsInfo = async () => {
    const requestPayload: fetchDistrictsPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      session_status: "",
      setup_status: "",
      page: selectedFilters.page,
      limit: selectedFilters.limit,
    };
    const response = await fetchDistricts(requestPayload);
    if (response.success) {
      setFilteredData(response.data);
      console.log("Districts data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching Districts data");
    }
  };

  // Column definitions for Districts tab
  const districtsColumns: Column[] = [
    {
      key: "network",
      label: "Network",
      icon: <Network size={16} />,
      sortable: true,
    },
    {
      key: "district",
      label: "District",
      icon: <Building2 size={16} />,
      sortable: true,
    },
    {
      key: "admins",
      label: "Admins",
      icon: <Users size={16} />,
      sortable: false,
    },
    {
      key: "users",
      label: "Number of Users",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "lastSession",
      label: "Last Session",
      icon: <Clock size={16} />,
      sortable: true,
    },
    {
      key: "sessionStatus",
      label: "Session Status",
      icon: <ActivitySquare size={16} />,
      sortable: true,
    },
    {
      key: "setupStatus",
      label: "Setup Status",
      icon: <Settings size={16} />,
      sortable: true,
    },
  ];

  // Render custom cells with tooltip
  const renderSessionCell = (row: TableRow, column: string) => {
    // Handle admins column specifically
    if (column === "admins" && row.admins) {
      const { names, more } = row.admins;
      return (
        <div>
          {names.join(", ")}
          {more ? ` +${more} more` : ""}
        </div>
      );
    }

    // Handle session status column
    if (column === "sessionStatus") {
      const status = row[column] as string;
      let bgColor, textColor, completedCount, upcomingCount;

      switch (status) {
        case "Active":
          bgColor = "bg-green-200";
          textColor = "text-green-800";
          completedCount = 15;
          upcomingCount = 0;
          break;
        case "Inactive":
          bgColor = "bg-yellow-200";
          textColor = "text-yellow-800";
          completedCount = 15;
          upcomingCount = 0;
          break;
        case "No Session":
          bgColor = "bg-red-200";
          textColor = "text-red-800";
          completedCount = 0;
          upcomingCount = 0;
          break;
        default:
          return status;
      }

      return (
        <div className="relative group">
          <span
            className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}
          >
            <span className="w-2 h-2 bg-black rounded-full"></span> {status}
          </span>
          <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
            <div className="flex items-center justify-between whitespace-nowrap">
              <span>Completed {completedCount}</span>
              <span className="mx-1">|</span>
              <span>Upcoming {upcomingCount}</span>
            </div>
          </div>
        </div>
      );
    }

    // For other columns, check if the value is an object
    const value = row[column];
    if (value !== null && typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  };

  const handleFiltersChange = (newFilters: TableFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div>
      <DashboardTable
        data={filteredData}
        columns={districtsColumns}
        headerColor="blue-700"
        renderCell={renderSessionCell}
        rowColor="blue-50"
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default Districts;
