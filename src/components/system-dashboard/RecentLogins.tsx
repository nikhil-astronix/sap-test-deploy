"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Clock,
  Mail,
  UserCircle,
  User,
  Network,
  Calendar,
  Laptop,
} from "lucide-react";
import DashboardTable, {
  TableRow,
  Column,
  TableFilters,
} from "./DashboardTable";
import { fetchUsersPayload } from "@/models/dashboard";
import { fetchUsers } from "@/services/dashboardService";

interface RecentLoginsProps {
  searchTerm?: string;
}

const RecentLogins = ({ searchTerm = "" }: RecentLoginsProps) => {
  // State for filtered data
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "userName",
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
    const response = await fetchUsers(requestPayload);
    if (response.success) {
      setFilteredData(response.data);
      console.log("Observation data fetch successfully");
    } else {
      setFilteredData([]);
      console.log("Error while fetching Observtion data");
    }
  };

  // Column definitions for Recent Logins tab
  const loginColumns: Column[] = [
    {
      key: "userName",
      label: "User",
      icon: <User size={16} />,
      sortable: true,
    },
    {
      key: "network",
      label: "Network",
      icon: <Network size={16} />,
      sortable: true,
    },
    {
      key: "district",
      label: "District",
      icon: <Building2 size={16} />,
      sortable: true,
    },
    { key: "role", label: "Role", icon: <Users size={16} />, sortable: true },
    {
      key: "lastLogin",
      label: "Date",
      icon: <Calendar size={16} />,
      sortable: true,
    },
    // { key: 'loginCount', label: 'Login Count', icon: <Clock size={16} />, sortable: true },
    // { key: 'device', label: 'Device', icon: <Laptop size={16} />, sortable: true },
  ];

  // Custom rendering for roles with background colors
  const renderRoleCell = (row: TableRow, column: string) => {
    if (column === "role" && row.role) {
      const role = row.role as string;
      let bgColor, textColor, dotColor;

      switch (role) {
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
          <span className={`w-2 h-2 ${dotColor} rounded-md`}></span> {role}
        </span>
      );
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
        headerColor="green-800"
        renderCell={renderRoleCell}
        rowColor="green-50"
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default RecentLogins;
