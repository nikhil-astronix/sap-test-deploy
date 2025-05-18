"use client";

import { User, Calendar, Clock, School, Laptop } from "lucide-react";
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
    const response = await fetchRecentLogins(requestPayload);
    if (response.success) {
      // const responseInfo = processData(response.data.users);
      setFilteredData(response.data.users);
      console.log("RecentLogin data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching RecentLogin data");
    }
  };

  // Column definitions for Recent Logins tab
  const loginsColumns: Column[] = [
    {
      key: "full_name",
      label: "User",
      icon: <User size={16} />,
      sortable: true,
    },
    {
      key: "user_type",
      label: "Role",
      icon: <User size={16} />,
      sortable: true,
    },
    // {
    //   key: "school",
    //   label: "School",
    //   icon: <School size={16} />,
    //   sortable: true,
    // },
    {
      key: "last_login_at",
      label: "Date",
      icon: <Calendar size={16} />,
      sortable: true,
    },
    // { key: "time", label: "Time", icon: <Clock size={16} />, sortable: true },
    // {
    //   key: "device",
    //   label: "Device",
    //   icon: <Laptop size={16} />,
    //   sortable: true,
    // },
  ];

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === "user_type") {
      const role = row[column] as string;
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            role === "Admin"
              ? "bg-blue-100 text-blue-800"
              : role === "Principal"
              ? "bg-purple-100 text-purple-800"
              : "bg-green-100 text-green-800"
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
    <AdminDashboardTable
      data={filteredData}
      columns={loginsColumns}
      headerColor="green-800"
      rowColor="green-50"
      renderCell={renderCell}
      searchTerm={searchTerm}
      onFiltersChange={handleFiltersChange}
    />
  );
};

export default RecentLogins;
