"use client";

import {CalendarDots, IdentificationCard, User} from "@phosphor-icons/react";
import AdminDashboardTable, { TableRow, Column } from "./AdminDashboardTable";
import { useEffect, useState } from "react";
import { TableFilters } from "../system-dashboard/DashboardTable";
import { fetchUsersPayload } from "@/models/dashboard";
import { fetchRecentLogins } from "@/services/adminDashboardService";
import { format } from "date-fns";

interface RecentLoginsProps {
  searchTerm?: string;
}

const RecentLogins = ({ searchTerm = "" }: RecentLoginsProps) => {
  // Sample data for Recent Logins tab
  const loginsData: TableRow[] = [];

  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "full_name",
    sort_order: "asc",
  });

  // Filter data when search term changes
  useEffect(() => {
    fetchRecentLoginInfo();
  }, [searchTerm, selectedFilters]);

  const fetchRecentLoginInfo = async () => {
    const requestPayload: fetchUsersPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      page: selectedFilters.page,
      limit: selectedFilters.limit,
      user_type: "",
    };
    setIsLoading(true);
    try {
      const response = await fetchRecentLogins(requestPayload);
      if (response.success) {
        // const responseInfo = processData(response.data.users);
        setFilteredData(response.data.users);
        setTotalPages(response.data.pages);
        setTotalRecords(response.data.total);
        setPageNumber(response.data.page);
        setPageSize(response.data.limit);
        console.log("RecentLogin data fetch successfully");
      } else {
        setFilteredData([]);
        console.log("Error while fetching RecentLogin data");
      }
    } catch (error) {
      console.error("Error fetching RecentLogin data:", error);
      setFilteredData([]);
    }
    finally {
      setIsLoading(false);
    }
  };

  // Column definitions for Recent Logins tab
  const loginsColumns: Column[] = [
    {
      key: "full_name",
      label: "User",
      icon: <User size={20} />,
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

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === "user_type") {
      const role = row[column] as string;
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${role === "Admin"
              ? "bg-[#D6FDFD] text-[#007778]"
              : role === "Principal"
                ? "bg-[#E9F3FF] text-[#2264AC]"
                : "bg-[#E9F3FF] text-[#2264AC]"
            }`}
        >
          {role}
        </span>
      );
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

    return row[column];
  };

  const handleFiltersChange = (newFilters: TableFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div>
      <AdminDashboardTable
        data={filteredData}
        columns={loginsColumns}
        headerColor="bg-[#2A7251]"
        rowColor="bg-[#E4F5EC]"
        renderCell={renderCell}
        searchTerm={searchTerm}
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
        isLoading={isLoading}
        emptyMessage="No recent logins found"
      />
    </div>
  );
};

export default RecentLogins;
