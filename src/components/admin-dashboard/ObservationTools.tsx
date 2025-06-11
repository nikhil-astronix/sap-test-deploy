"use client";

import { Hash } from "lucide-react";
import { IoSchoolOutline } from "react-icons/io5";
import { PiUsers } from "react-icons/pi";
import { BiBriefcaseAlt2 } from "react-icons/bi";
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
    const requestPayload: fetchObservationToolsPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      page: selectedFilters.page,
      limit: selectedFilters.limit,
    };
    setIsLoading(true);
    try {
      const response = await fetchObservationTools(requestPayload);
      console.log(response?.data?.tools, 'checking the observation tools data');
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
    } catch (error) {
      console.error("Error fetching Observations data:", error);
      setFilteredData([]);
    }
    finally {
      setIsLoading(false);
    }
  };

  // Column definitions for Observation Tools tab
  const toolsColumns: Column[] = [
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
      key: "schools",
      label: "School",
      icon: <IoSchoolOutline size={20} />,
      sortable: true,
    },
    {
      key: "creator_name",
      label: "Created By",
      icon: <PiUsers size={20} />,
      sortable: false,
    },
  ];

  // Custom render function for cells
  // Background colors for tool names
  const bgColors = [
    "bg-[#E9F3FF]",
    "bg-[#F9F5FF]",
    "bg-[#EDFFFF]",
    "bg-[#F9F5FF]",
    "bg-[#D1FAE5]",
    "bg-[#EDFFFF]",
    "bg-[#EDFFFF]",
    "bg-[#FFFCDD]",
    "bg-[#F4EBFF]",
  ];

  const renderCell = (row: TableRow, column: string) => {
    if (column === "name") {
      const name = row[column] as string;
      // Get a consistent color based on the tool name
      const colorIndex = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % bgColors.length;
      const bgColor = bgColors[colorIndex];
      
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
        >
          {name}
        </span>
      );
    }

    // if (column === "schools") {
    //   const schools = row[column] as string[];
    //   return (
    //     <div className="text-xs">
    //       {schools.map((school, index) => (
    //         <span key={index}>{school},</span>
    //       ))}
    //     </div>
    //   );
    // }

    if (column === "schools") {
      const schools = row[column] as string[];
      const displayCount = 2;
      const remaining = schools.length - displayCount;
    
      return (
        <div className="text-xs">
          {schools.slice(0, displayCount).map((school, index) => (
            <span key={index}>
              {school}
              {index < Math.min(displayCount, schools.length) - 1 ? ', ' : ''}
            </span>
          ))}
          {remaining > 0 && (
            <span className="text-[#6C4996]">
              +{remaining} more
            </span>
          )}
        </div>
      );
    }

    if (column === "creator_name") {
      const creatorName = row[column] as string;
      return (
        <div>
          <div className="text-xs text-black font-normal">{creatorName}</div>
          <div className="text-xs text-gray-500">
            {format(new Date(row.created_at as string), "MMMM d, yyyy h:mm a")}
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
    <div>
    <AdminDashboardTable
      data={filteredData}
      columns={toolsColumns}
      headerColor="bg-[#6C4996]"
      rowColor="bg-[#F9F5FF]"
      renderCell={renderCell}
      searchTerm={searchTerm}
      onFiltersChange={handleFiltersChange}
      totalPages={totalPages}
      totalRecords={totalRecords}
      pageNumber={pageNumber}
      pageSize={pageSize}
      isLoading={isLoading}
    />
    {isLoading &&
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4996]"></div>
      </div>
    }
    </div>
  );
};

export default ObservationTools;
