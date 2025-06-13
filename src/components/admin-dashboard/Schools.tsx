"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Hash,
  Toolbox,
  GearFine,
  Note,
} from "@phosphor-icons/react";
import AdminDashboardTable, { TableRow, Column } from "./AdminDashboardTable";
import { TableFilters } from "../system-dashboard/DashboardTable";
import { fetchDistrictsPayload } from "@/models/dashboard";
import { fetchSchools } from "@/services/adminDashboardService";
import { format } from "date-fns";

interface SchoolsProps {
  searchTerm?: string;
}

const Schools = ({ searchTerm = "" }: SchoolsProps) => {
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

  // Filter data when search term changes or filters changed
  useEffect(() => {
    fetchSchoolsInfo();
  }, [selectedFilters, searchTerm]);

  const fetchSchoolsInfo = async () => {
    const requestPayload: fetchDistrictsPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      session_status: "",
      setup_status: "",
      page: selectedFilters.page,
      limit: selectedFilters.limit,
    };
    setIsLoading(true);
    try {
      const response = await fetchSchools(requestPayload);
      console.log(response.data.schools, "checking the schools data");
      if (response.success) {
        setFilteredData(response.data.schools);
        setTotalPages(response.data.pages);
        setTotalRecords(response.data.total);
        setPageNumber(response.data.page);
        setPageSize(response.data.limit);
        console.log("Schools data fetch successfully");
      } else {
        setFilteredData([]);
        console.log("Error while fetching Schools data");
      }
    } catch (error) {
      console.error("Error fetching Schools data:", error);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Column definitions for Schools tab
  const schoolsColumns: Column[] = [
    {
      key: "name",
      label: "School",
      icon: <GraduationCap size={20} />,
      sortable: true,
    },
    {
      key: "classroom_count",
      label: "Number of Classrooms",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "tools",
      label: "Observation Tool(s)",
      icon: <Toolbox size={20} />,
      sortable: false,
    },
    {
      key: "last_observation",
      label: "Last Session",
      icon: <Note size={20} />,
      sortable: true,
    },
    {
      key: "setup_status",
      label: "Setup Status",
      icon: <GearFine size={20} />,
      sortable: true,
    },
  ];

  // Background colors for school names
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

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === "name") {
      const name = row[column] as string;
      // Get a consistent color based on the school name
      const colorIndex =
        Math.abs(
          name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        ) % bgColors.length;
      const bgColor = bgColors[colorIndex];

      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
        >
          {name}
        </span>
      );
    }
    if (column === "tools") {
      const tools = row[column] as string[];
      if (!tools || tools.length === 0) return "None";

      return (
        <div className=" flex-col space-y-1">
          {tools.map((tool: any) => (
            <span
              key={tool.id}
              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                 ${
                   typeof tool.name === "string" && tool.name.includes("IPG")
                     ? "bg-[#EDFFFF] text-green-800"
                     : typeof tool.name === "string" &&
                       tool.name.includes("Math")
                     ? "bg-[#F4EBFF] text-purple-800"
                     : "bg-[#E9F3FF] text-blue-800"
                 }
              `}
            >
              {tool.name}
            </span>
          ))}
        </div>
      );
    }

    if (column === "last_observation") {
      if (row[column] === null || row[column] == undefined) {
        return "None";
      } else {
        return (
          <span className="text-xs text-black font-normal">
            {format(new Date(row[column]), "MMMM d, yyyy")}
          </span>
        );
      }
    }

    if (column === "setup_status") {
      const statusObj = row[column];
      // const statusData = (row as any).setupStatusData;

      let color = "";
      let dotColor = "";

      switch (statusObj.status) {
        case "Incomplete":
          color = "text-red-800";
          dotColor = "bg-red-600";
          break;
        case "Partial":
          color = "text-yellow-800";
          dotColor = "bg-yellow-600";
          break;
        case "Complete":
          color = "text-green-800";
          dotColor = "bg-green-600";
          break;
        default:
          color = "text-gray-800";
          dotColor = "bg-gray-600";
      }

      return (
        // <div className="relative group">
        //   <div
        //     className={`inline-flex items-center gap-1 ${statusObj.status === "Incomplete"
        //         ? "bg-red-200"
        //         : statusObj.status === "Partial"
        //           ? "bg-yellow-200"
        //           : "bg-green-200"
        //       } ${color} px-2 py-1 rounded-full text-xs`}
        //   >
        //     <span className={`w-2 h-2 ${dotColor} rounded-full`}></span>
        //     {statusObj.status}
        //   </div>
        //   {statusObj && (
        //     <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
        //       <div className="flex items-center justify-between whitespace-nowrap">
        //         <span>Classroom {statusObj.classroom_count}</span>
        //         <span className="mx-1">|</span>
        //         <span>Tools {statusObj.tool_count}</span>
        //       </div>
        //     </div>
        //   )}
        // </div>
        <div className="relative group">
          {/* <span
            className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}
          >
            <span className="w-2 h-2 bg-black rounded-full"></span> {statusObj.status}
          </span> */}
          <div
            className={`inline-flex items-center gap-1 ${color} px-2 py-1 rounded-full text-xs`}
          >
            <span className={`w-2 h-2 ${dotColor} rounded-full`}></span>
            {statusObj.status}
          </div>
          <div
            className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-3
              after:content-[''] after:absolute after:top-full after:left-12 after:border-4 after:border-transparent after:border-t-black"
          >
            <div className="flex items-center text-center justify-between whitespace-nowrap p-1">
              <span
                className={`w-2 h-2 mx-1 left-0 ${dotColor} rounded-full`}
              ></span>
              <span className="">Classroom {statusObj.classroom_count}</span>
              <span className="mx-1">|</span>
              <span className="">Tools {statusObj.tool_count}</span>
            </div>
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
        columns={schoolsColumns}
        headerColor="bg-[#2264AC]"
        rowColor="bg-[#E9F3FF]"
        renderCell={renderCell}
        searchTerm={searchTerm}
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
        isLoading={isLoading}
        emptyMessage="No schools found"
      />
    </div>
  );
};

export default Schools;
