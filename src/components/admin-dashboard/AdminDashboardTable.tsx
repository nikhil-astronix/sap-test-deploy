"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TableFilters } from "../system-dashboard/DashboardTable";

// Define the data structure
export type StatusType = "No Session" | "Inactive" | "Active";
export type SetupStatusType = "Incomplete" | "Partial" | "Complete";

export interface TableRow {
  id: string;
  network?: string;
  district?: string;
  admins?: {
    names: string[];
    more?: number;
  };
  users?: number;
  lastSession?: string | null;
  sessionStatus?: StatusType;
  setupStatus?: SetupStatusType;
  [key: string]: any; // Allow for additional fields
}

// Column definition for dynamic columns
export interface Column {
  key: string;
  label: string;
  icon: React.ReactNode;
  sortable: boolean;
}

interface AdminDashboardTableProps {
  data: TableRow[];
  columns: Column[];
  headerColor: string;
  renderCell?: (row: TableRow, column: string) => any;
  rowColor?: string;
  searchTerm?: string;
  onFiltersChange: (filters: TableFilters) => void;
  totalRecords: number;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  isLoading?: boolean;
  emptyMessage?: string;
}

const AdminDashboardTable = ({
  data: initialData,
  columns,
  headerColor,
  renderCell: customRenderCell,
  rowColor = "bg-blue-50",
  searchTerm = "",
  onFiltersChange,
  totalRecords,
  pageNumber,
  totalPages,
  pageSize,
  isLoading,
  emptyMessage = "No data available",
}: AdminDashboardTableProps) => {
  // State for current data, sorting, and pagination
  const [filteredData, setFilteredData] = useState<TableRow[]>(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [visibleColumns] = useState<string[]>(columns?.map((col) => col.key));

  const colorCode = headerColor.split("bg-")[1];

  // Effect to update filtered data when initial data changes
  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);
  
  // Create a state to track if sorting/filtering is happening locally
  const [isLocalOperation, setIsLocalOperation] = useState(false);

  useEffect(() => {
    const updatedFilters: TableFilters = {
      page: currentPage,
      limit: rowsPerPage,
      sort_by: sortConfig.key,
      sort_order: sortConfig.direction,
    };
    onFiltersChange(updatedFilters);
  }, [currentPage, rowsPerPage, sortConfig]);

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
    
    // Set local operation flag to true before sorting
    setIsLocalOperation(true);
    setSortConfig({ key, direction });
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsLocalOperation(false);
    }, 300);
  };

  // Get current page data
  const indexOfFirstRow = (pageNumber - 1) * pageSize + 1;
  const indexOfLastRow = Math.min(indexOfFirstRow + pageSize - 1, totalRecords);
  // const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

  // Get session status badge with tooltip
  const getSessionStatusBadge = (status: StatusType, row?: TableRow) => {
    let bgColor, textColor, dotColor, completedCount, upcomingCount;

    switch (status) {
      case "Active":
        bgColor = "bg-green-200";
        textColor = "text-green-800";
        dotColor = "bg-black";
        completedCount = 15;
        upcomingCount = 0;
        break;
      case "Inactive":
        bgColor = "bg-yellow-200";
        textColor = "text-yellow-800";
        dotColor = "bg-black";
        completedCount = 15;
        upcomingCount = 0;
        break;
      case "No Session":
        bgColor = "bg-red-200";
        textColor = "text-red-800";
        dotColor = "bg-black";
        completedCount = 0;
        upcomingCount = 0;
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
            <span>Completed {completedCount}</span>
            <span className="mx-1">|</span>
            <span>Upcoming {upcomingCount}</span>
          </div>
        </div>
      </div>
    );
  };

  // Get setup status badge with tooltip
  const getSetupStatusBadge = (status: SetupStatusType, row?: TableRow) => {
    let bgColor, textColor, dotColor, schoolsCount, toolsCount;

    switch (status) {
      case "Complete":
        bgColor = "bg-green-200";
        textColor = "text-green-800";
        dotColor = "bg-black";
        schoolsCount = 4;
        toolsCount = 2;
        break;
      case "Partial":
        bgColor = "bg-yellow-200";
        textColor = "text-yellow-800";
        dotColor = "bg-black";
        schoolsCount = 0;
        toolsCount = 0;
        break;
      case "Incomplete":
        bgColor = "bg-red-200";
        textColor = "text-red-800";
        dotColor = "bg-black";
        schoolsCount = 0;
        toolsCount = 0;
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
            <span>Schools {schoolsCount}</span>
            <span className="mx-1">|</span>
            <span>Tools {toolsCount}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render cell content
  const renderCell = (row: TableRow, column: string) => {
    // Use custom renderCell if provided
    if (customRenderCell) {
      const customRendered = customRenderCell(row, column);
      if (customRendered !== undefined) {
        return customRendered;
      }
    }

    if (column === "admins" && row.admins) {
      const { names, more } = row.admins;
      return (
        <div>
          {names.join(", ")}
          {more ? ` +${more} more` : ""}
        </div>
      );
    } else if (column === "sessionStatus" && row.sessionStatus) {
      return getSessionStatusBadge(row.sessionStatus);
    } else if (column === "setupStatus" && row.setupStatus) {
      return getSetupStatusBadge(row.setupStatus);
    } else {
      // Handle different value types appropriately
      const value = row[column];

      // Check if value is an object (but not null)
      if (value !== null && typeof value === "object") {
        // If it's the admins object that somehow wasn't caught by the earlier condition
        if ("names" in value && "more" in value) {
          const { names, more } = value;
          return (
            <div>
              {Array.isArray(names) ? names.join(", ") : ""}
              {more ? ` +${more} more` : ""}
            </div>
          );
        }
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
                .map((column, index) => (
                  <th
                    key={column.key}
                    className={`${headerColor} border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm`}
                  >
                    <button
                      className="flex items-center justify-between space-x-1 focus:outline-none w-full"
                      onClick={() =>
                        column.sortable ? requestSort(column.key) : null
                      }
                      disabled={!column.sortable}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.icon}</span>
                        <span className="mx-1">{column.label}</span>
                      </div>
                      {column.sortable && (
                        // <span className="ml-auto">
                        //   {sortConfig.key === column.key ? (
                        //     sortConfig.direction === "asc" ? (
                        //       <ChevronUp size={14} />
                        //     ) : (
                        //       <ChevronDown size={14} />
                        //     )
                        //   ) : (
                        //     <ChevronDown size={14} className="text-gray-300" />
                        //   )}
                        // </span>
                        <div className="flex flex-col">
                          {/* Always show up arrow, highlight when active */}
                          <ChevronUp 
                            className={`h-3 w-3 ${sortConfig.key === column.key && sortConfig.direction === "asc" ? "" : "opacity-30"}`} 
                          />
                          {/* Always show down arrow, highlight when active */}
                          <ChevronDown 
                            className={`h-3 w-3 ${sortConfig.key === column.key && sortConfig.direction === "desc" ? "" : "opacity-30"}`} 
                          />
                        </div>
                      )}
                    </button>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && !isLocalOperation ? (
              <tr>
                <td colSpan={columns.length} className="border-b border-gray-200 py-8 text-center">
                  <div className="flex justify-center items-center py-8">
                    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${headerColor.includes('[') ? headerColor.replace('bg-[', 'border-[') : headerColor.replace('bg-', 'border-')}`}></div>
                  </div>
                </td>
              </tr>
            ) : filteredData?.length > 0 ? (
              filteredData?.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`text-xs hover:bg-gray-50 ${
                    rowIndex % 2 === 1 ? rowColor : "bg-white"
                  }`}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column, index) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className="whitespace-nowrap border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-xs"
                      >
                        {renderCell(row, column.key)}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border-b border-gray-200 py-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-gray-500 text-base font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Match network dashboard styling */}
      {!isLoading && filteredData?.length > 0 && (
        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            <p className="text-[12px] text-gray-500">
              {totalRecords > 0
                ? `${indexOfFirstRow}-${indexOfLastRow} of ${totalRecords}`
                : "0 results"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <div className="flex items-center space-x-2 text-[12px]">
              <span className="text-[12px] text-gray-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  const newRowsPerPage = Number(e.target.value);
                  setRowsPerPage(newRowsPerPage);
                  // Reset to first page when changing rows per page
                  setCurrentPage(1);
                }}
                className="text-[12px] border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={9}>9</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-1 text-[12px]">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className={`p-1 border rounded ${currentPage === 1 || isLoading
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[12px] text-gray-500">
                {currentPage}/{totalPages || 1}
              </span>
              <button
                onClick={() => 
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage >= totalPages || isLoading}
                className={`p-1 border rounded text-[12px] ${currentPage >= totalPages || isLoading
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardTable;
