"use client";

import { useEffect, useState } from "react";
import {City, Note, Hash, GearFine, Users} from "@phosphor-icons/react";
import NetworkDashboardTable, {
  NetworkColumn,
  NetworkTableRow,
  NetworkTableFilters
} from "./NetworkDashboardTable";
import { getDistrictsByNetwork } from "@/services/networkService";

interface DistrictsProps {
  searchTerm?: string;
}

export default function Districts({ searchTerm = '' }: DistrictsProps) {
  const [districtsData, setDistrictsData] = useState<NetworkTableRow[]>([]);
  const [filteredData, setFilteredData] = useState<NetworkTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedFilters, setSelectedFilters] = useState<NetworkTableFilters>({
    page: 1,
    limit: 9,
    sort_by: "districtname",
    sort_order: "asc",
  });
  const [dataFetched, setDataFetched] = useState(false);

  // Define columns for districts table
  const districtsColumns: NetworkColumn[] = [
    {
      key: "districtname",
      label: "District",
      icon: <City size={20} />,
      sortable: true,
    },
    {
      key: "admins",
      label: "Admins",
      icon: <Users size={20} />,
      sortable: false,
    },
    {
      key: "schools",
      label: "Total Schools",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "classrooms",
      label: "Total Classrooms",
      icon: <Hash size={20} />,
      sortable: true,
    },
    {
      key: "lastSession",
      label: "Last Session",
      icon: <Note size={20} />,
      sortable: true,
    },
    {
      key: "sessionStatus",
      label: "Session Status",
      icon: <GearFine size={20} />,
      sortable: true,
    },
  ];

  // Fetch districts data - only called once initially
  const fetchDistrictsData = async () => {
    setIsLoading(true);
    try {
      const response = await getDistrictsByNetwork();
      console.log(response.data.networks[0].districts, 'checking the in districts response here');
      if (response && response.data && response.data.networks && response.data.networks[0] && response.data.networks[0].districts) {
        // Extract districts from the API response
        const districts = response.data.networks[0].districts;
        setDistrictsData(districts);
        setFilteredData(districts);
        setDataFetched(true);
      } else {
        setDistrictsData([]);
        setFilteredData([]);
        setError("Failed to load districts data");
      }
    } catch (err) {
      setDistrictsData([]);
      setFilteredData([]);
      setError("An error occurred while fetching districts data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort data locally
  const filterAndSortData = () => {
    if (districtsData.length === 0) return;

    // Start with all data
    let filtered = [...districtsData];

    // Apply search filter if term exists
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(district => {
        // Search by district name
        if (district.name && district.name.toLowerCase().includes(term)) {
          return true;
        }

        // Search by admins
        if (district.admins && district.admins.length > 0) {
          return district.admins.some(admin =>
            `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(term) ||
            (admin.email && admin.email.toLowerCase().includes(term))
          );
        }

        return false;
      });
    }

    // Apply sorting if sort parameters exist
    if (selectedFilters.sort_by && selectedFilters.sort_order) {
      filtered.sort((a, b) => {
        let valueA, valueB;

        // Map column keys to actual data properties
        switch (selectedFilters.sort_by) {
          case 'districtname':
            valueA = a.name || '';
            valueB = b.name || '';
            break;
          case 'schools':
            valueA = (a.setup_status && a.setup_status.school_count) || 0;
            valueB = (b.setup_status && b.setup_status.school_count) || 0;
            break;
          case 'classrooms':
            valueA = a.user_count || 0;
            valueB = b.user_count || 0;
            break;
          case 'lastSession':
            valueA = a.last_observation || '';
            valueB = b.last_observation || '';
            break;
          case 'sessionStatus':
            valueA = a.session_status || '';
            valueB = b.session_status || '';
            break;
          default:
            // Handle the case when the property might not exist
            valueA = selectedFilters.sort_by && a[selectedFilters.sort_by] !== undefined ? a[selectedFilters.sort_by] : '';
            valueB = selectedFilters.sort_by && b[selectedFilters.sort_by] !== undefined ? b[selectedFilters.sort_by] : '';
        }

        // Perform the comparison based on data types
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return selectedFilters.sort_order === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          // For numbers or other types
          return selectedFilters.sort_order === 'asc'
            ? (valueA > valueB ? 1 : -1)
            : (valueA < valueB ? 1 : -1);
        }
      });
    }

    setFilteredData(filtered);
  };

  // Update localSearchTerm when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Fetch data only once on component mount
  useEffect(() => {
    if (!dataFetched) {
      fetchDistrictsData();
    }
  }, [dataFetched]);

  // Filter and sort data when search term or filters change
  useEffect(() => {
    filterAndSortData();
  }, [selectedFilters, searchTerm, districtsData]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle filter changes from the table component
  const handleFiltersChange = (filters: NetworkTableFilters) => {
    setSelectedFilters(filters);
  };

  const renderCell = (row: NetworkTableRow, column: string) => {
    // Map column keys to match API data structure
    const columnMapping: { [key: string]: string } = {
      "districtname": "name",
      "lastSession": "last_observation",
      "sessionStatus": "session_status",
      "schools": "setup_status"
    };

    // Use mapped column key if available
    const mappedColumn = columnMapping[column] || column;

    // Handle admins column specifically
    if (column === "admins") {
      const admins = row.admins || [];
      if (!admins.length) {
        return "None";
      }

      if (admins.length === 1) {
        const admin = admins[0];
        return <span>{`${admin.first_name} ${admin.last_name}`}</span>;
      } else {
        const total = admins.length - 1;
        return (
          <div className="relative group inline-block">
            <span>
              {`${admins[0].first_name} ${admins[0].last_name}`}{" "}
              <span className="text-blue-600 text-[12px]">+{total} more</span>
            </span>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1 w-max max-w-xs text-left">
              {admins.slice(1).map((admin, index) => (
                <div key={index}>
                  {admin.first_name} {admin.last_name}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Handle district name
    if (column === "districtname") {
      return <span>{row.name || "-"}</span>;
    }

    // Handle schools (using setup_status.school_count)
    if (column === "schools") {
      const setupStatus = row.setup_status;
      if (setupStatus && typeof setupStatus === "object") {
        return setupStatus.school_count || 0;
      }
      return 0;
    }

    // Handle classrooms (using user_count as a placeholder)
    if (column === "classrooms") {
      return row.user_count || 0;
    }

    // Handle setup status
    if (column === "setup_status" || mappedColumn === "setup_status") {
      const statusObj = row.setup_status;
      if (!statusObj) return "-";

      let color = "";
      let dotColor = "";
      let bgColor = "";

      switch (statusObj.status) {
        case "Incomplete":
          color = "text-red-800";
          dotColor = "bg-red-600";
          bgColor = "bg-red-200";
          break;
        case "Partial":
          color = "text-yellow-800";
          dotColor = "bg-yellow-600";
          bgColor = "bg-yellow-200";
          break;
        case "Complete":
          color = "text-green-800";
          dotColor = "bg-green-600";
          bgColor = "bg-green-200";
          break;
        default:
          color = "text-gray-800";
          dotColor = "bg-gray-600";
          bgColor = "bg-gray-200";
      }

      return (
        <div className="relative group">
          <div
            className={`inline-flex items-center gap-1 ${bgColor} ${color} px-2 py-1 rounded-full text-xs`}
          >
            <span className={`w-2 h-2 ${dotColor} rounded-full`}></span>
            {statusObj.status}
          </div>
          <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-3
              after:content-[''] after:absolute after:top-full after:left-12 after:border-4 after:border-transparent after:border-t-black">
            <div className="flex items-center text-center justify-between whitespace-nowrap p-1">
              <span className={`w-2 h-2 mx-1 left-0 ${dotColor} rounded-full`}></span>
              <span>
                Schools {statusObj.school_count}
              </span>
              <span className="mx-1">|</span>
              <span>Tools {statusObj.tool_count}</span>
            </div>
          </div>
        </div>
      );
    }

    // Handle session status
    if (column === "sessionStatus" || mappedColumn === "session_status") {
      const statusObj = row.session_status;
      if (!statusObj) return "No Session";

      let bgColor, textColor;

      switch (statusObj.status) {
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
          bgColor = "bg-gray-200";
          textColor = "text-gray-800";
      }

      return (
        <div className="relative group">
          <span
            className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}
          >
            <span className="w-2 h-2 bg-black rounded-full"></span> {statusObj.status}
          </span>
          <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-3
              after:content-[''] after:absolute after:top-full after:left-1/2 after:border-4 after:border-transparent after:border-t-black">
            <div className="flex items-center text-center justify-between whitespace-nowrap p-1">
              <span className={`w-2 h-2 mx-1 left-0 ${bgColor} rounded-full`}></span>
              <span className="">Completed {statusObj.completed_count}</span>
              <span className="mx-1">|</span>
              <span className="">Upcoming {statusObj.upcoming_count}</span>
            </div>
          </div>
        </div>
      );
    }

    // Handle last observation date
    if (column === "lastSession" || mappedColumn === "last_observation") {
      if (row.last_observation === null || row.last_observation === undefined) {
        return "-";
      } else {
        return (
          <span className="text-xs text-black font-normal">
            {formatDate(row.last_observation)}
          </span>
        );
      }
    }

    // For other columns, check if the value is an object
    const value = row[mappedColumn];
    if (value !== null && typeof value === "object") {
      return JSON.stringify(value);
    }

    return value || "-";
  };

  return (
    <div className="space-y-4">
      <NetworkDashboardTable
        data={filteredData}
        columns={districtsColumns}
        headerColor="#2264AC"
        rowColor="#E9F3FF"
        renderCell={renderCell}
        searchTerm={localSearchTerm}
        isLoading={isLoading}
        error={error}
        onFiltersChange={handleFiltersChange}
        totalRecords={filteredData.length}
        pageNumber={selectedFilters.page}
        totalPages={Math.ceil(filteredData.length / selectedFilters.limit)}
        pageSize={selectedFilters.limit}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredData.length === 0 && !error ? (
        <div className="text-center py-8 text-gray-500">
          No district data found
        </div>
      ) : null}
    </div>
  );
}