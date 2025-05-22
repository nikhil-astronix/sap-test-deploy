//   // Get session status badge
//   const getSessionStatusBadge = (status: StatusType) => {
//     switch (status) {
//       case 'Active':
//         return <span className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
//       case 'Inactive':
//         return <span className="inline-flex items-center gap-1 bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
//       case 'No Session':
//         return <span className="inline-flex items-center gap-1 bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
//       default:
//         return status;
//     }
//   };

//   // Get setup status badge
//   const getSetupStatusBadge = (status: SetupStatusType) => {
//     switch (status) {
//       case 'Complete':
//         return <span className="inline-flex items-center gap-1 text-green-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-green-600 rounded-full"></span> {status}</span>;
//       case 'Partial':
//         return <span className="inline-flex items-center gap-1 text-yellow-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> {status}</span>;
//       case 'Incomplete':
//         return <span className="inline-flex items-center gap-1 text-red-600 px-2 py-1 text-xs"><span className="w-2 h-2 bg-red-600 rounded-full"></span> {status}</span>;
//       default:
//         return status;
//     }
//   };

//   // Render cell content
//   const renderCell = (row: TableRow, column: keyof TableRow) => {
//     if (column === 'admins') {
//       const { names, more } = row.admins;
//       return (
//         <div>
//           {names.join(', ')}
//           {more ? ` +${more} more` : ''}
//         </div>
//       );
//     } else if (column === 'sessionStatus') {
//       return getSessionStatusBadge(row.sessionStatus);
//     } else if (column === 'setupStatus') {
//       return getSetupStatusBadge(row.setupStatus);
//     } else {
//       return row[column];
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-white">
//             {columns
//               .filter(col => visibleColumns.includes(col.key))
//               .map((column) => (
//                 <th
//                   key={column.key}
//                   className="border-b whitespace-nowrap bg-blue-400 border-gray-200 p-3 text-left font-medium text-white text-sm"
//                 >
//                   <button
//                     className="flex items-center space-x-1 focus:outline-none"
//                     onClick={() => column.sortable ? requestSort(column.key) : null}
//                     disabled={!column.sortable}
//                   >
//                     <span>{column.icon}</span>
//                     <span>{column.label}</span>
//                     {column.sortable && (
//                       <span className="ml-1">
//                         {sortConfig.key === column.key ? (
//                           sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                         ) : (
//                           <ChevronDown size={14} className="text-gray-300" />
//                         )}
//                       </span>
//                     )}
//                   </button>
//                 </th>
//               ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRows.map((row) => (
//             <tr key={row.id} className="hover:bg-gray-50">
//               {columns
//                 .filter(col => visibleColumns.includes(col.key))
//                 .map((column) => (
//                   <td key={`${row.id}-${column.key}`} className="border-b border-gray-200 p-3 text-sm">
//                     {renderCell(row, column.key)}
//                   </td>
//                 ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center justify-between mt-4 text-sm">
//         <div>
//           {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, data.length)} of {data.length}
//         </div>

//         <div className="flex items-center space-x-2">
//           <div>
//             Rows per page:
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="ml-2 border border-gray-300 rounded p-1"
//             >
//               <option value={9}>9</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//           </div>

//           <div className="flex items-center space-x-1">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <span>{currentPage}/{Math.ceil(data.length / rowsPerPage)}</span>
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
//               disabled={currentPage >= Math.ceil(data.length / rowsPerPage)}
//               className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardTable;

"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define the data structure
export type StatusType = "No Session" | "Inactive" | "Active";
export type SetupStatusType = "Incomplete" | "Partial" | "Complete";

export interface Admin {
  first_name: string;
  last_name: string;
}
export interface TableRow {
  id: string;
  network?: string;
  district?: string;
  admins?: Admin[];
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

export interface TableFilters {
  page: number;
  limit: number;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
}

interface DashboardTableProps {
  data: TableRow[];
  columns: Column[];
  headerColor: string;
  renderCell?: (row: TableRow, column: string) => any;
  rowColor?: string;
  onFiltersChange: (filters: TableFilters) => void;
  totalRecords: number;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
}

const DashboardTable = ({
  data: initialData,
  columns,
  headerColor,
  renderCell: customRenderCell,
  rowColor,
  onFiltersChange,
  totalRecords,
  pageNumber,
  totalPages,
  pageSize,
}: DashboardTableProps) => {
  // State for current data, sorting, and pagination
  const [filteredData, setFilteredData] = useState<TableRow[]>(initialData);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [visibleColumns] = useState<string[]>(columns?.map((col) => col.key));

  // Effect to update filtered data when initial data changes
  useEffect(() => {
    console.log("loading new data ---");
    setFilteredData(initialData);
  }, [initialData]);

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

    setSortConfig({ key, direction });
  };

  const indexOfFirstRow = (pageNumber - 1) * pageSize + 1;
  const indexOfLastRow = Math.min(indexOfFirstRow + pageSize - 1, totalRecords);

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

    if (column === "sessionStatus" && row.sessionStatus) {
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
                    className={`bg-${headerColor} border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-3 text-left font-medium text-white text-sm`}
                  >
                    <button
                      className="flex items-center space-x-1 focus:outline-none w-full"
                      onClick={() =>
                        column.sortable ? requestSort(column.key) : null
                      }
                      disabled={!column.sortable}
                    >
                      <span>{column.icon}</span>
                      <span className="mx-1">{column.label}</span>
                      {column.sortable && (
                        <span className="ml-auto">
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ChevronDown size={14} className="text-gray-300" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                ))}
            </tr>
            {/* <tr>
              {columns?.filter(col => visibleColumns?.includes(col.key))
                .map((column, index) => {
                  const bgColorClass = headerColor === 'blue-600' ? 'bg-blue-200' : 
                                     headerColor === 'green-800' ? 'bg-green-200' : 'bg-purple-200';
                  return (                    <th 
                      key={`subheader-${column.key}`}
                      className={`${bgColorClass} border-b border-gray-200 border-r border-r-gray-300 last:border-r-0 whitespace-nowrap p-2 text-left font-medium text-gray-700 text-xs`}
                    >
                      {column.key === 'sessionStatus' && (
                        <div className="flex justify-between items-center">
                          <span>Completed 0</span>
                          <span className="mx-1">|</span>
                          <span>Upcoming 0</span>
                        </div>
                      )}
                      {column.key === 'setupStatus' && (
                        <div className="flex justify-between items-center">
                          <span>Schools 0</span>
                          <span className="mx-1">|</span>
                          <span>Tools 0</span>
                        </div>
                      )}
                    </th>
                  );
                })}
            </tr> */}
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData?.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    rowIndex % 2 === 1 ? `bg-${rowColor}` : "bg-white"
                  }`}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((column, index) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className="border-b border-gray-200 border-r border-r-gray-100 last:border-r-0 p-3 text-sm"
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
                  className="border-b border-gray-200 p-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage(
                Math.min(
                  currentPage + 1,
                  Math.ceil(filteredData.length / rowsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredData.length / rowsPerPage)
            }
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === Math.ceil(filteredData.length / rowsPerPage)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstRow}</span> to{" "}
              <span className="font-medium">{indexOfLastRow}</span> of{" "}
              <span className="font-medium">{totalRecords}</span> results
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
              className="mr-4 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={9}>9</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">First</span>
                <ChevronLeft size={14} />
                <ChevronLeft size={14} className="-ml-1" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              {Array.from(
                {
                  length: Math.min(5, Math.ceil(totalRecords / pageSize)),
                },
                (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.ceil(filteredData.length / rowsPerPage))
                }
                disabled={
                  currentPage === Math.ceil(filteredData.length / rowsPerPage)
                }
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === Math.ceil(filteredData.length / rowsPerPage)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Last</span>
                <ChevronRight size={14} />
                <ChevronRight size={14} className="-ml-1" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
