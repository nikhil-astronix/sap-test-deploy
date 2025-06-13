"use client";

import { useState, useEffect } from "react";
import {Network, City, IdentificationCard, User, CalendarDots} from "@phosphor-icons/react";
import DashboardTable, {
  TableRow,
  Column,
  TableFilters,
} from "./DashboardTable";
import { fetchUsersPayload } from "@/models/dashboard";
import { fetchUsers } from "@/services/dashboardService";
import { format } from "date-fns";

interface RecentLoginsProps {
  searchTerm?: string;
}

const RecentLogins = ({ searchTerm = "" }: RecentLoginsProps) => {
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
    sort_by: "full_name",
    // sort_by: "full_name, network_name, districts, user_type, last_login_at",
    sort_order: "asc",
  });

  // Filter data when search term changes
  useEffect(() => {
    fetchRecentLoginInfo();
  }, [searchTerm, selectedFilters]);

  const fetchRecentLoginInfo = async () => {
    // Always show loading indicator when fetching data from API
    setIsLoading(true);
    const requestPayload: fetchUsersPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      page: selectedFilters.page,
      limit: selectedFilters.limit,
      user_type: "",
    };
    const response = await fetchUsers(requestPayload);
    if (response.success) {
      setFilteredData(response.data.users);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
      setPageNumber(response.data.page);
      setPageSize(response.data.limit);
      console.log("RecentLogin data fetch successfully");
      setIsLoading(false);
    } else {
      setFilteredData([]);
      console.log("Error while fetching RecentLogin data");
      setIsLoading(false);
    }
  };

  // Column definitions for Recent Logins tab
  const loginColumns: Column[] = [
    {
      key: "full_name",
      label: "User",
      icon: <User size={20} />,
      sortable: true,
    },
    {
      key: "network_name",
      label: "Network",
      icon: <Network size={20} />,
      sortable: true,
    },
    {
      key: "districts",
      label: "District",
      icon: <City size={20} />,
      sortable: true,
    },
    {
      key: "user_type",
      label: "Role",
      icon: <IdentificationCard size={20} />,
      sortable: true,
    },
    {
      key: "last_login_at",
      label: "Date",
      icon: <CalendarDots size={20} />,
      sortable: true,
    },
  ];

  // Custom rendering for roles with background colors
  const renderRoleCell = (row: TableRow, column: string) => {
    if (column === "user_type" && row.user_type) {
      const user_type = row.user_type as string;
      let bgColor, textColor, dotColor;

      switch (user_type) {
        case "System Admin":
          bgColor = "bg-purple-200";
          textColor = "text-purple-800";
          dotColor = "bg-purple-800";
          break;
        case "Admin":
          bgColor = "bg-blue-200";
          dotColor = "bg-blue-800";
          textColor = "text-blue-800";
          break;
        case "Observer":
          bgColor = "bg-green-200";
          dotColor = "bg-green-800";
          textColor = "text-green-800";
          break;
        default:
          bgColor = "bg-gray-200";
          dotColor = "bg-gray-800";
          textColor = "text-gray-800";
      }

      return (
        <span
          className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-md text-xs`}
        >
          <span className={`w-2 h-2 ${dotColor} rounded-md`}></span> {user_type}
        </span>
      );
    }
    if (column === "districts") {
      if (row[column]?.length) {
        return (
          <span className="text-xs text-black font-normal">
            {/* {row[column][0].name} */}
            {row[column]?.map((item: any) => item).join(", ")}
          </span>
        );
      } else {
        return "-";
      }
    }
    if (column === "full_name") {
      if (row[column]) {
        return (
          <span className="flex flex-col">
            <span className="text-xs text-black font-normal">
              {row[column]}
            </span>
            <span className="text-xs text-[#637381]">{row.email}</span>
          </span>
        );
      }
    }
    if (column === "last_login_at") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {format(new Date(row[column]), "MMMM d, yyyy h:mm a")}
          </span>
        );
      } else {
        return "-";
      }
    }
    if (column === "network_name") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {row[column]}
          </span>
        );
      } else {
        return "-";
      }
    }
    return row[column];
  };

  const handleFiltersChange = (newFilters: TableFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div>
      <DashboardTable
        data={filteredData}
        columns={loginColumns}
        headerColor="#007778"
        renderCell={renderRoleCell}
        rowColor="#EDFFFF"
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

export default RecentLogins;
