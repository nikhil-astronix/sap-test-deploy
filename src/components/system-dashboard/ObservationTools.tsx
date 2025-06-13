"use client";

import { useState, useEffect } from "react";
import {User, Hash} from "lucide-react";
import { BiBriefcaseAlt2 } from "react-icons/bi";
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
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
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
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
      setPageNumber(response.data.page);
      setPageSize(response.data.limit);
      console.log("Observation data fetch successfully");
      setIsLoading(false);
    } else {
      setFilteredData([]);
      console.log("Error while fetching Observation data");
      setIsLoading(false);
    }
  };

  // Column definitions for Observation Tools tab
  const observationColumns: Column[] = [
    {
      key: "name",
      label: "Observation Tool",
      icon: <BiBriefcaseAlt2 size={20} />,
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
      label: "Used in Districts",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "school_count",
      label: "Used in Schools",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "creator_name",
      label: "Created By",
      icon: <User size={20} />,
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
        headerColor="#6C4996"
        renderCell={renderCell}
        rowColor="#F9F5FF"
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ObservationTools;
