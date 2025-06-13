"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

// Define the data structure
export type NetworkStatusType = "Active" | "Inactive" | "Archived";
export type SessionStatusType =
  | "No Session"
  | "Upcoming"
  | "In Progress"
  | "Completed";

export interface NetworkAdmin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface NetworkTableRow {
  id: string;
  name: string;
  districts?: number;
  schools?: number;
  admins?: NetworkAdmin[];
  users?: number;
  lastSession?: string | null;
  sessionStatus?: SessionStatusType;
  status?: NetworkStatusType;
  createdAt?: string;
  [key: string]: any; // Allow for additional fields
}

// Column definition for dynamic columns
export interface NetworkColumn {
  key: string;
  label: string;
  icon: React.ReactNode;
  sortable: boolean;
}

export interface NetworkTableFilters {
  page: number;
  limit: number;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
}

interface NetworkDashboardTableProps {
  data: NetworkTableRow[];
  columns: NetworkColumn[];
  headerColor: string;
  renderCell?: (row: NetworkTableRow, column: string) => any;
  rowColor?: string;
  onFiltersChange?: (filters: NetworkTableFilters) => void;
  totalRecords?: number;
  pageNumber?: number;
  totalPages?: number;
  pageSize?: number;
  searchTerm?: string;
  isLoading?: boolean;
  error?: any;
}

export default function NetworkDashboardTable({
  data: initialData,
  columns,
  headerColor,
  renderCell: customRenderCell,
  rowColor,
  onFiltersChange,
  totalRecords = 0,
  pageNumber = 1,
  totalPages = 1,
  pageSize = 10,
  searchTerm,
  isLoading = false,
  error,
}: NetworkDashboardTableProps) {
  // State for current data, sorting, and pagination
  const [filteredData, setFilteredData] =
    useState<NetworkTableRow[]>(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const rowsPerPageOptions = [5, 9, 25, 50, 100];
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleColumns] = useState<string[]>(columns?.map((col) => col.key));

  // Effect to update filtered data when initial data or search term changes
  useEffect(() => {
    // Clear any duplicate data by creating a fresh copy
    // Add null/undefined check to prevent "initialData is not iterable" error
    const data = Array.isArray(initialData) ? [...initialData] : [];

    // Apply search filtering if searchTerm is provided
    if (searchTerm && searchTerm.trim() !== "") {
      const filtered = filterData(data, searchTerm);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [initialData, searchTerm]);

  // Update current page when pageNumber prop changes
  useEffect(() => {
    setCurrentPage(pageNumber);
  }, [pageNumber]);

  // Update rows per page when pageSize prop changes
  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  // Trigger onFiltersChange when filter parameters change
  useEffect(() => {
    if (onFiltersChange) {
      const updatedFilters: NetworkTableFilters = {
        page: currentPage,
        limit: rowsPerPage,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction,
      };
      // Notify parent component of filter changes
      onFiltersChange(updatedFilters);
    }
  }, [currentPage, rowsPerPage, sortConfig, onFiltersChange]);

  // Sorting handler
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    // If we're not using server-side filtering (no onFiltersChange), sort locally
    if (!onFiltersChange) {
      const sortedData = [...filteredData];
      if (direction !== null) {
        sortedData.sort((a, b) => {
          const valueA = a[key] !== undefined ? a[key] : "";
          const valueB = b[key] !== undefined ? b[key] : "";

          if (typeof valueA === "string" && typeof valueB === "string") {
            return direction === "asc"
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          } else {
            return direction === "asc"
              ? valueA > valueB
                ? 1
                : -1
              : valueA < valueB
              ? 1
              : -1;
          }
        });
      }
      setFilteredData(sortedData);
    }
  };

  // Function to filter data based on search term
  const filterData = (data: NetworkTableRow[], term: string) => {
    if (!term || term.trim() === "") return data;

    const lowerCaseTerm = term.toLowerCase();
    return data.filter((row) => {
      // First check name field which is common in most rows
      if (
        row.name &&
        typeof row.name === "string" &&
        row.name.toLowerCase().includes(lowerCaseTerm)
      ) {
        return true;
      }

      // Generic search across all visible columns
      return visibleColumns.some((colKey) => {
        const cellValue = row[colKey];

        // Handle special case for admins array
        if (colKey === "admins" && Array.isArray(row.admins)) {
          return row.admins.some(
            (admin) =>
              `${admin.first_name} ${admin.last_name}`
                .toLowerCase()
                .includes(lowerCaseTerm) ||
              (admin.email && admin.email.toLowerCase().includes(lowerCaseTerm))
          );
        }

        // For session admin or school, perform specific search
        if (
          (colKey === "sessionAdmin" || colKey === "school") &&
          typeof cellValue === "string" &&
          cellValue.toLowerCase().includes(lowerCaseTerm)
        ) {
          return true;
        }

        // For districts, perform specific search
        if (
          colKey === "districts" &&
          typeof cellValue === "number" &&
          String(cellValue).includes(lowerCaseTerm)
        ) {
          return true;
        }

        // For regular string values
        if (
          typeof cellValue === "string" &&
          cellValue.toLowerCase().includes(lowerCaseTerm)
        ) {
          return true;
        }

        return false;
      });
    });
  };

  // Calculate pagination display values
  const indexOfFirstRow = onFiltersChange
    ? (pageNumber - 1) * pageSize + 1
    : (currentPage - 1) * rowsPerPage + 1;

  const indexOfLastRow = onFiltersChange
    ? Math.min(indexOfFirstRow + pageSize - 1, totalRecords)
    : Math.min(indexOfFirstRow + rowsPerPage - 1, filteredData.length);

  const calculatedTotalPages = onFiltersChange
    ? totalPages
    : Math.ceil(filteredData.length / rowsPerPage);

  // Handle page change for both server-side and client-side pagination
  const handlePageChange = (page: number) => {
    // Ensure page is valid and within bounds
    const validPage = Math.max(
      1,
      Math.min(page, onFiltersChange ? totalPages : calculatedTotalPages)
    );
    setCurrentPage(validPage);

    // If we're not using server-side pagination, no need to do anything else
    // The getPaginatedData function will handle slicing the data correctly
  };

  // Get paginated data for client-side pagination
  const getPaginatedData = () => {
    // If using server-side pagination, just return the data as-is
    if (onFiltersChange) return filteredData;

    // For client-side pagination, slice the data based on current page
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return filteredData.slice(startIdx, endIdx);
  };

  // Calculate paginated data only when needed, ensuring it's always fresh
  const paginatedData = getPaginatedData();

  // Get network status badge
  const getNetworkStatusBadge = (status: NetworkStatusType) => {
    let bgColor, textColor, dotColor;

    switch (status) {
      case "Active":
        bgColor = "bg-green-200";
        textColor = "text-green-800";
        dotColor = "bg-green-600";
        break;
      case "Inactive":
        bgColor = "bg-yellow-200";
        textColor = "text-yellow-800";
        dotColor = "bg-yellow-600";
        break;
      case "Archived":
        bgColor = "bg-red-200";
        textColor = "text-red-800";
        dotColor = "bg-red-600";
        break;
      default:
        return status;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}
      >
        <span className={`w-2 h-2 ${dotColor} rounded-full`}></span> {status}
      </span>
    );
  };

  // Get session status badge
  const getSessionStatusBadge = (status: SessionStatusType) => {
    let bgColor, textColor, dotColor;

    switch (status) {
      case "In Progress":
        bgColor = "bg-green-200";
        textColor = "text-green-800";
        dotColor = "bg-green-600";
        break;
      case "Upcoming":
        bgColor = "bg-blue-200";
        textColor = "text-blue-800";
        dotColor = "bg-blue-600";
        break;
      case "Completed":
        bgColor = "bg-purple-200";
        textColor = "text-purple-800";
        dotColor = "bg-purple-600";
        break;
      case "No Session":
        bgColor = "bg-red-200";
        textColor = "text-red-800";
        dotColor = "bg-red-600";
        break;
      default:
        return status;
    }

    return (
      <div className="relative group">
        <span
          className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-1 rounded-full text-xs`}
        >
          <span className={`w-2 h-2 ${dotColor} rounded-full`}></span> {status}
        </span>
        <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1">
          <div className="flex items-center justify-between whitespace-nowrap">
            <span>Completed Sessions: 0</span>
            <span className="mx-1">|</span>
            <span>Upcoming Sessions: 0</span>
          </div>
        </div>
      </div>
    );
  };

  // Render cell content
  const renderCell = (row: NetworkTableRow, column: string) => {
    // Use custom renderCell if provided
    if (customRenderCell) {
      const customRendered = customRenderCell(row, column);
      if (customRendered !== undefined) {
        return customRendered;
      }
    }

    if (column === "status" && row.status) {
      return getNetworkStatusBadge(row.status);
    } else if (column === "sessionStatus" && row.sessionStatus) {
      return getSessionStatusBadge(row.sessionStatus);
    } else if (column === "admins" && row.admins) {
      // Handle admins display
      const admins = row.admins;
      if (admins.length === 0) return "-";

      const displayNames = admins
        .slice(0, 2)
        .map((admin) => `${admin.first_name} ${admin.last_name}`)
        .join(", ");

      const more = admins.length > 2 ? admins.length - 2 : 0;

      return (
        <div>
          {displayNames}
          {more > 0 ? ` +${more} more` : ""}
        </div>
      );
    } else {
      // Handle different value types appropriately
      const value = row[column];

      // Check if value is an object (but not null)
      if (value !== null && typeof value === "object") {
        // For other objects, convert to string
        return JSON.stringify(value);
      }

      // For null or undefined, show a dash
      if (value === null || value === undefined) {
        return "-";
      }

      // For other types (string, number, boolean), return as is
      return value;
    }
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-md w-full mx-auto">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              {columns
                ?.filter((col) => visibleColumns?.includes(col.key))
                .map((column) => (
                  <th
                    key={column.key}
                    className={`p-3 text-left text-sm font-medium cursor-pointer border-r ${
                      sortConfig.key === column.key
                        ? "bg-opacity-90"
                        : "bg-opacity-70"
                    }`}
                    style={{ backgroundColor: headerColor }}
                    onClick={() => column.sortable && requestSort(column.key)}
                  >
                    <div className="flex items-center justify-between text-white ">
                      <div className="flex items-center gap-2">
                        {column.icon}
                        <span>{column.label}</span>
                      </div>

                      {column.sortable && (
                        <div className="flex flex-col">
                          {/* Always show up arrow, highlight when active */}
                          <ChevronUp
                            className={`h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "asc"
                                ? ""
                                : "opacity-30"
                            }`}
                          />
                          {/* Always show down arrow, highlight when active */}
                          <ChevronDown
                            className={`h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === "desc"
                                ? ""
                                : "opacity-30"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading && !error && paginatedData?.length > 0 ? (
              // Use a key based on both id and index to ensure React properly handles rerenders
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={`${row.id}-${rowIndex}`}
                  style={
                    rowIndex % 2 === 1 ? { backgroundColor: rowColor } : {}
                  }
                  className={`hover:bg-gray-50 ${
                    rowIndex % 2 === 0 ? "bg-white" : ""
                  }`}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column, index) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className="border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 p-3 text-[14px]"
                      >
                        {renderCell(row, column.key)}
                      </td>
                    ))}
                </tr>
              ))
            ) : !isLoading && !error ? (
              <tr>
                <td
                  colSpan={columns?.length || 1}
                  className="text-center py-4 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination - Match system dashboard styling */}
      {!isLoading && !error && filteredData?.length > 0 && (
        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            <p className="text-[12px] text-gray-500">
              {(onFiltersChange ? totalRecords : filteredData.length) > 0
                ? `${indexOfFirstRow}-${indexOfLastRow} of ${
                    onFiltersChange ? totalRecords : filteredData.length
                  }`
                : "0"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <div className="flex items-center space-x-2 text-[12px]">
              <span className="text-[14px] text-gray-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  const newRowsPerPage = Number(e.target.value);
                  setRowsPerPage(newRowsPerPage);
                  // Reset to first page when changing rows per page
                  if (!onFiltersChange) {
                    setCurrentPage(1);
                  }
                }}
                className="text-[12px] rounded  py-1"
              >
                {rowsPerPageOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center text-[12px]">
              <button
                onClick={() =>
                  handlePageChange(
                    Math.max(
                      onFiltersChange ? pageNumber - 1 : currentPage - 1,
                      1
                    )
                  )
                }
                disabled={
                  onFiltersChange ? pageNumber === 1 : currentPage === 1
                }
                className={`p-1 border rounded ${
                  (onFiltersChange ? pageNumber === 1 : currentPage === 1) ||
                  isLoading
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[12px] text-gray-500 px-2">
                {onFiltersChange ? pageNumber : currentPage} /{" "}
                {onFiltersChange ? totalPages : calculatedTotalPages || 1}
              </span>
              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      onFiltersChange ? pageNumber + 1 : currentPage + 1,
                      onFiltersChange ? totalPages : calculatedTotalPages
                    )
                  )
                }
                disabled={
                  onFiltersChange
                    ? pageNumber >= totalPages
                    : currentPage >= calculatedTotalPages
                }
                className={`p-1 border rounded text-[12px] ${
                  (onFiltersChange
                    ? pageNumber >= totalPages
                    : currentPage >= calculatedTotalPages) || isLoading
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
