"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Building2,
  FileText,
  User,
  UserCheck,
  Calendar,
  CheckCircle,
  Hash,
} from "lucide-react";
import DashboardTable, {
  TableRow,
  Column,
  TableFilters,
} from "./DashboardTable";
import { fetchObservationToolsPayload } from "@/models/dashboard";
import { fetchObservationTools } from "@/services/dashboardService";

interface ObservationToolsProps {
  searchTerm?: string;
}

const ObservationTools = ({ searchTerm = "" }: ObservationToolsProps) => {
  // Sample data for Observation Tools tab

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "observationTool",
    sort_order: "asc",
  });

  // Filter data when search term changes
  useEffect(() => {
    fetchObservations();
  }, [searchTerm, selectedFilters]);

  const fetchObservations = async () => {
    const requestPayload: fetchObservationToolsPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      page: selectedFilters.page,
      limit: selectedFilters.limit,
    };
    const response = await fetchObservationTools(requestPayload);
    if (response.success) {
      setFilteredData(response.data);
      console.log("Observation data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching Observtion data");
    }
  };

  // Column definitions for Observation Tools tab
  const observationColumns: Column[] = [
    {
      key: "observationTool",
      label: "Observation Tool",
      icon: <ClipboardList size={16} />,
      sortable: true,
    },
    {
      key: "totalSessions",
      label: "Total Sessions",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "usedInDistricts",
      label: "Used in Districts",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "usedInSchools",
      label: "Used in Schools",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "createdBy",
      label: "Created By",
      icon: <User size={16} />,
      sortable: true,
    },
  ];

  // Custom rendering for columns
  const renderCell = (row: TableRow, column: string) => {
    if (column === "createdBy" && row.createdBy) {
      const creator = row.createdBy as { name: string; email: string };
      return (
        <div>
          <div>{creator.name}</div>
          <div className="text-xs text-gray-500">{creator.email}</div>
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
        columns={observationColumns}
        headerColor="purple-800"
        renderCell={renderCell}
        rowColor="purple-50"
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default ObservationTools;
