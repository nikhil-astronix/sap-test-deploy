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
  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "name",
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
      setFilteredData(response.data.tools);
      console.log("Observation data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching Observtion data");
    }
  };

  // Column definitions for Observation Tools tab
  const observationColumns: Column[] = [
    {
      key: "name",
      label: "Observation Tool",
      icon: <ClipboardList size={16} />,
      sortable: true,
    },
    {
      key: "usage_count",
      label: "Total Sessions",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "district_count",
      label: "Used in Districts",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "school_count",
      label: "Used in Schools",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "creator_name",
      label: "Created By",
      icon: <User size={16} />,
      sortable: false,
    },
  ];

  // Custom rendering for columns
  const renderCell = (row: TableRow, column: string) => {
    if (column === "name") {
      const name = row[column] as string;
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            name.includes("IPG")
              ? "bg-green-100 text-green-800"
              : name.includes("Math")
              ? "bg-purple-100 text-purple-800"
              : name.includes("AAPS")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {name}
        </span>
      );
    }
    if (column === "creator_name" && row.creator_name) {
      return (
        <div>
          <div className="text-xs text-black font-normal">{row[column]}</div>
          <div className="text-xs text-gray-500">{row["creator_email"]}</div>
        </div>
      );
    } else {
      return (
        <span className="text-xs text-black font-normal">{row[column]}</span>
      );
    }
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
