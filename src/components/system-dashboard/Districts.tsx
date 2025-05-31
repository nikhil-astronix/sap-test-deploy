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
import { format } from "date-fns";

interface DistrictsProps {
  searchTerm?: string;
}

const Districts = ({ searchTerm = "" }: DistrictsProps) => {
  // State for filtered data

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
      setFilteredData(response.data.districts);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
      setPageNumber(response.data.page);
      setPageSize(response.data.limit);
    } else {
      setFilteredData([]);
      console.log("Error while fetching Districts data");
    }
  };

  // Column definitions for Districts tab
  const districtsColumns: Column[] = [
    {
      key: "network_name",
      label: "Network",
      icon: <Network size={16} />,
      sortable: true,
    },
    {
      key: "name",
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
      key: "user_count",
      label: "Number of Users",
      icon: <Hash size={16} />,
      sortable: true,
    },
    {
      key: "last_observation",
      label: "Last Session",
      icon: <Clock size={16} />,
      sortable: true,
    },
    {
      key: "session_status",
      label: "Session Status",
      icon: <ActivitySquare size={16} />,
      sortable: true,
    },
    {
      key: "setup_status",
      label: "Setup Status",
      icon: <Settings size={16} />,
      sortable: true,
    },
  ];

  // Render custom cells with tooltip
  const renderSessionCell = (row: TableRow, column: string) => {
    // Handle admins column specifically
    if (column === "admins" && row.admins) {
      if (row.admins.length) {
        const full_name = `${row.admins[0].first_name} ${row.admins[0].last_name}`;
        const remainingAdmins = row.admins.slice(1);

        if (row.admins.length === 1) {
          return <span>{full_name}</span>;
        } else {
          const total = row.admins.length - 1;
          return (
            <div className="relative group inline-block">
              <span>
                {full_name}{" "}
                <span className="text-blue-600 text-[12px]">+{total} more</span>
              </span>
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1 w-max max-w-xs text-left">
                {/* Line-by-line names */}

                {remainingAdmins.map((admin, index) => (
                  <div key={index}>
                    {admin.first_name} {admin.last_name}
                  </div>
                ))}
              </div>
            </div>
          );
        }
      } else {
        return "-";
      }
    }

    if (column === "network_name" || column === "name") {
      if (row[column]) {
        return <span>{row[column]}</span>;
      } else {
        return "-";
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
        <div className="relative group">
          <div
            className={`inline-flex items-center gap-1 ${
              statusObj.status === "Incomplete"
                ? "bg-red-200"
                : statusObj.status === "Partial"
                ? "bg-yellow-200"
                : "bg-green-200"
            } ${color} px-2 py-1 rounded-full text-xs`}
          >
            <span className={`w-2 h-2 ${dotColor} rounded-full`}></span>
            {statusObj.status}
          </div>
          {statusObj && (
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
              <div className="flex items-center justify-between whitespace-nowrap">
                <span>Classroom {statusObj.school_count}</span>
                <span className="mx-1">|</span>
                <span>Tools {statusObj.tool_count}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle session status column
    if (column === "session_status") {
      const { status, completed_count, upcoming_count } = row[column];
      let bgColor, textColor, completedCount, upcomingCount;

      switch (status) {
        case "Active":
          bgColor = "bg-green-200";
          textColor = "text-green-800";
          break;
        case "Inactive":
          bgColor = "bg-yellow-200";
          textColor = "text-yellow-800";
          break;
        case "No Session":
          bgColor = "bg-red-200";
          textColor = "text-red-800";
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
              <span>Completed {completed_count}</span>
              <span className="mx-1">|</span>
              <span>Upcoming {upcoming_count}</span>
            </div>
          </div>
        </div>
      );
    }

    if (column === "last_observation") {
      if (row[column] === null || row[column] === undefined) {
        return "-";
      } else {
        return (
          <span className="text-xs text-black font-normal">
            {format(new Date(row[column]), "MMMM d, yyyy")}
          </span>
        );
      }
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
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Districts;
