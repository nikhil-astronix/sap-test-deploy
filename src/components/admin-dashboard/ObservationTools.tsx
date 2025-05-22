"use client";

import { BookOpen, Hash, School, User } from "lucide-react";
import AdminDashboardTable, { TableRow, Column } from "./AdminDashboardTable";
import { TableFilters } from "../system-dashboard/DashboardTable";
import { useEffect, useState } from "react";
import { fetchObservationToolsPayload } from "@/models/dashboard";
import { fetchObservationTools } from "@/services/adminDashboardService";
import { format } from "date-fns";

interface ObservationToolsProps {
  searchTerm?: string;
}

const ObservationTools = ({ searchTerm = "" }: ObservationToolsProps) => {
  // Sample data for Observation Tools tab
  const observationToolsData: TableRow[] = [];

  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
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
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
      setPageNumber(response.data.page);
      setPageSize(response.data.limit);
      console.log("Observation data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching Observtion data");
    }
  };

  // Column definitions for Observation Tools tab
  const toolsColumns: Column[] = [
    {
      key: "name",
      label: "Observation Tool",
      icon: <BookOpen size={16} />,
      sortable: true,
    },
    {
      key: "usage_count",
      label: "Total Sessions",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "schools",
      label: "School",
      icon: <School size={16} />,
      sortable: true,
    },
    {
      key: "creator",
      label: "Created By",
      icon: <User size={16} />,
      sortable: false,
    },
  ];

  // Custom render function for cells
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

    if (column === "schools") {
      const schools = row[column] as { name: string; moreCount: number };
      return (
        <div>
          {schools.name}
          {schools.moreCount > 0 && (
            <span className="ml-1 text-xs text-gray-400">
              +{schools.moreCount} more
            </span>
          )}
        </div>
      );
    }

    // if (column === "createdBy") {
    //   const createdBy = row[column] as { name: string; date: string };
    //   return (
    //     <div>
    //       {createdBy.name}
    //       <div className="text-xs text-gray-400">{createdBy.date}</div>
    //     </div>
    //   );
    // }

    if (column === "creator" && row.creator) {
      const creator = row.creator as {
        first_name: string;
        last_name: string;
        email: string;
      };
      return (
        <div>
          <div className="text-xs text-black font-normal">
            {creator.first_name}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(row.created_at), "MMMM d, yyyy h:mm a")}
          </div>
        </div>
      );
    }

    return row[column];
  };

  const handleFiltersChange = (newFilters: TableFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <AdminDashboardTable
      data={filteredData}
      columns={toolsColumns}
      headerColor="purple-800"
      rowColor="purple-50"
      renderCell={renderCell}
      searchTerm={searchTerm}
      onFiltersChange={handleFiltersChange}
      totalPages={totalPages}
      totalRecords={totalRecords}
      pageNumber={pageNumber}
      pageSize={pageSize}
    />
  );
};

export default ObservationTools;
