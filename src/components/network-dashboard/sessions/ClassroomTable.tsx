"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Eye
} from "lucide-react";

// Define the data structure
export interface ClassroomData {
  id: string;
  teacher: string;
  course: string;
  grade: number;
  instructionalMaterials: string[];
  action?: string;
}

export interface ClassroomTableRow {
  id: string;
  teacher: string;
  course: string;
  grade: number;
  instructionalMaterials: string | string[];
  action?: string;
  [key: string]: any; // Allow for additional fields
}

// Column definition for dynamic columns
export interface ClassroomColumn {
  key: string;
  label: string;
  icon: React.ReactNode;
  sortable: boolean;
}

export interface ClassroomTableFilters {
  page: number;
  limit: number;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
}

interface ClassroomTableProps {
  data: ClassroomTableRow[];
  columns: ClassroomColumn[];
  headerColor?: string;
  renderCell?: (row: ClassroomTableRow, column: string) => any;
  rowColor?: string;
  onFiltersChange?: (filters: ClassroomTableFilters) => void;
  totalRecords?: number;
  pageNumber?: number;
  totalPages?: number;
  pageSize?: number;
  searchTerm?: string;
  isLoading?: boolean;
  error?: any;
}

export default function ClassroomTable({
  data: initialData,
  columns,
  headerColor = "#007778",
  renderCell: customRenderCell,
  rowColor = "#EDFFFF",
  onFiltersChange,
  totalRecords = 0,
  pageNumber = 1,
  totalPages = 1,
  pageSize = 10,
  searchTerm,
  isLoading = false,
  error,
}: ClassroomTableProps) {
  // State for current data, sorting, and pagination
  const [filteredData, setFilteredData] = useState<ClassroomTableRow[]>(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const [search, setSearch] = useState("");
  const [visibleColumns] = useState<string[]>(columns?.map((col) => col.key));

  // Effect to update filtered data when initial data or search term changes
  useEffect(() => {
    // Clear any duplicate data by creating a fresh copy
    const data = Array.isArray(initialData) ? [...initialData] : [];
    
    // Apply search filtering if searchTerm is provided
    if (searchTerm && searchTerm.trim() !== '') {
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
      const updatedFilters: ClassroomTableFilters = {
        page: currentPage,
        limit: rowsPerPage,
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction,
      };
      // Notify parent component of filter changes to fetch fresh data
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
  };

  // Function to filter data based on search term
  const filterData = (data: ClassroomTableRow[], term: string) => {
    if (!term || term.trim() === '') return data;
    
    const lowerCaseTerm = term.toLowerCase();
    return data.filter(row => {
      // Generic search across all visible columns
      return visibleColumns.some(colKey => {
        const cellValue = row[colKey];
        
        // For instructional materials, perform specific search
        if (colKey === 'instructionalMaterials') {
          if (Array.isArray(cellValue)) {
            return cellValue.some(material => 
              material.toLowerCase().includes(lowerCaseTerm)
            );
          } else if (typeof cellValue === 'string') {
            return cellValue.toLowerCase().includes(lowerCaseTerm);
          }
        }
        
        // For grade, perform numeric search
        if (colKey === 'grade' && 
            typeof cellValue === 'number' && 
            String(cellValue).includes(lowerCaseTerm)) {
          return true;
        }
        
        // For regular string values
        if (typeof cellValue === 'string' && 
            cellValue.toLowerCase().includes(lowerCaseTerm)) {
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
    const validPage = Math.max(1, Math.min(page, onFiltersChange ? totalPages : calculatedTotalPages));
    setCurrentPage(validPage);
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

  // Function to render cell content with custom formatter if provided
  const renderCellContent = (row: ClassroomTableRow, column: string) => {
    // Use custom renderCell function if provided
    if (customRenderCell) {
      const customOutput = customRenderCell(row, column);
      if (customOutput !== undefined) {
        return customOutput;
      }
    }
    
    // Default renderers for specific columns if no custom renderer is provided
    if (column === 'instructionalMaterials') {
      const materials = row.instructionalMaterials;
      if (Array.isArray(materials)) {
        // If there are more than 2 materials, show first 2 with a +more tag
        if (materials.length > 2) {
          return (
            <div>
              {materials.slice(0, 2).join(', ')}
              <span className="text-blue-600"> +{materials.length - 2} more</span>
            </div>
          );
        }
        return materials.join(', ');
      } else if (typeof materials === 'string') {
        return materials;
      }
      return '-';
    } else if (column === 'action') {
      return (
        <div className="flex space-x-2">
          <button 
            className="text-teal-600 hover:text-teal-800 flex items-center bg-teal-50 px-3 py-1 rounded-md"
          >
            <span className="mr-1">Edit Observation</span>
            <Edit size={14} />
          </button>
          <span className="mx-1 text-gray-300">|</span>
          <button 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">View Calibration</span>
            <Eye size={14} />
          </button>
        </div>
      );
    } else {
      // Handle different value types appropriately
      const value = row[column];

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
      {/* Search Term Display */}
      {searchTerm && (
        <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center">
          <Search size={14} className="text-gray-500 mr-1" />
          <p className="text-sm text-gray-600">Search results for: <span className="font-medium">{searchTerm}</span></p>
        </div>
      )}

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
                    className={`text-left py-2 px-3 cursor-pointer transition-colors duration-200 ${
                      sortConfig.key === column.key
                        ? "bg-opacity-100"
                        : "bg-opacity-85"
                    }`}
                    style={{ backgroundColor: headerColor }}
                    onClick={() => column.sortable && requestSort(column.key)}
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-1">
                        {column.icon}
                        <span className="ml-1 font-medium text-sm">{column.label}</span>
                      </div>

                      {column.sortable && (
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
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading && !error && paginatedData?.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={`${row.id}-${rowIndex}`}
                  style={rowIndex % 2 === 1 ? { backgroundColor: rowColor } : {}}
                  className={`hover:bg-gray-50 ${
                    rowIndex % 2 === 0 ? "bg-white" : ""
                  }`}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column, index) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className="border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-[12px]"
                      >
                        {renderCellContent(row, column.key)}
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
        </div>
      )}

      {/* Pagination - Match system dashboard styling */}
      {!isLoading && !error && filteredData?.length > 0 && (
        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            <p className="text-[12px] text-gray-500">
              {onFiltersChange ? totalRecords : filteredData.length > 0
                ? `${indexOfFirstRow}-${indexOfLastRow} of ${onFiltersChange ? totalRecords : filteredData.length}`
                : "0 results"}
            </p>
          </div>

          <div className="flex items-center">
            {/* Rows per page dropdown */}
            <div className="flex items-center mr-4">
              <span className="text-[12px] text-gray-500 mr-2">Rows per page:</span>
              <select
                className="text-[12px] border border-gray-200 rounded px-1 py-0.5"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center">
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
                <ChevronLeft className="h-4 w-4 text-gray-500 -ml-3" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </button>

              <span className="text-[12px] text-gray-500 mx-2">
                {currentPage} of {onFiltersChange ? totalPages : calculatedTotalPages}
              </span>

              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (onFiltersChange ? totalPages : calculatedTotalPages)}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
              <button
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(onFiltersChange ? totalPages : calculatedTotalPages)}
                disabled={currentPage === (onFiltersChange ? totalPages : calculatedTotalPages)}
                aria-label="Last page"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
                <ChevronRight className="h-4 w-4 text-gray-500 -ml-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
