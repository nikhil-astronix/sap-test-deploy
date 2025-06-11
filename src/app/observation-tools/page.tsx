"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  PencilSimpleLine,
  Archive,
  Warning,
  ClockClockwise,
  CalendarDots,
  ArrowDownRight,
  Briefcase,
  User,
} from "@phosphor-icons/react";
import { BsBarChart, BsBarChartSteps } from "react-icons/bs";
import { BsCalendarEvent, BsPeople } from "react-icons/bs";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { getObservationTools } from "@/services/observationToolService";
import NetworkHeader from "@/components/network/NetworkHeader";
import {
  archiveObservationTools,
  restoreObservationTools,
} from "@/services/observationToolService";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ObservationTool {
  id: string;
  name: string;
  created_at: string;
  createdBy: string[];
}

interface ApiResponse {
  data: ObservationTool[];
  total: number;
  curr_page: number;
  per_page: number;
  totalPages: number;
}

type SortField = "name" | "created_at" | "createdBy";
type SortOrder = "asc" | "desc" | null;

interface SortConfig {
  field: SortField | null;
  order: SortOrder;
}

// Data transformation functions
const formatDate = (isoDateString: any) => {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

const transformObservationToolsResponse = (apiResponse: any) => {
  if (!apiResponse || !apiResponse.observation_tools) {
    return {
      data: [],
      total: 0,
      curr_page: 1,
      per_page: 10,
      totalPages: 1,
    };
  }

  const transformedTools = apiResponse.observation_tools.map((tool: any) => ({
    id: tool.id,
    name: tool.name || "Untitled Observation Tool",
    created_at: formatDate(tool.created_at),
    createdBy: [`${tool.created_by_first_name} ${tool.created_by_last_name}`],
  }));

  return {
    data: transformedTools,
    total: apiResponse.total_observation_tools || 0,
    curr_page: apiResponse.curr_page || 1,
    per_page: apiResponse.per_page || 10,
    totalPages: apiResponse.total_pages || 1,
  };
};

export default function ObservationToolsPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    order: null,
  });
  const [tools, setTools] = useState<ObservationTool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New state for modals
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Add these to your existing state variables
  const [selectedToolIds, setSelectedToolIds] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const [rowsPerPageOptions] = useState([5, 10, 25, 50, 100]);
  // Add this ref to track the timeout safely
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API call function
  const fetchTools = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        curr_page: params.curr_page,
        per_page: params.per_page,
        is_archived: params.is_archived,
      } as any;

      if (params.search) {
        queryParams.search = params.search;
      }

      if (params.sort_by && params.sort_order) {
        queryParams.sort_by = params.sort_by;
        queryParams.sort_order = params.sort_order;
      }

      const response = await getObservationTools(queryParams);

      // if (!response.success) {
      //   throw new Error(
      //     response.error?.message || "Failed to fetch observation tools"
      //   );
      // }

      // Transform the API response to match UI expectations
      const result = transformObservationToolsResponse(response.data);

      setTools(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
      setCurrentPage(result.curr_page);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
      console.error("Error fetching observation tools:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Implement debounced search effect with proper timeout management
  useEffect(() => {
    // Clear any existing timeout to avoid multiple timers
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout and store reference
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Effect to fetch data when debounced search changes
  useEffect(() => {
    // Reset to first page when search changes
    setCurrentPage(1);
    fetchTools({
      curr_page: 1,
      per_page: itemsPerPage,
      search: debouncedSearchQuery || undefined,
      sort_by: sortConfig.field || undefined,
      sort_order: sortConfig.order || undefined,
      is_archived: isActive ? true : false,
    });
  }, [debouncedSearchQuery, isActive, sortConfig, itemsPerPage]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    const newSortConfig = {
      field,
      order:
        sortConfig.field === field
          ? sortConfig.order === "asc"
            ? "desc"
            : sortConfig.order === "desc"
            ? null
            : "asc"
          : ("asc" as SortOrder),
    };

    setSortConfig(newSortConfig);
    setCurrentPage(1); // Reset to first curr_page on sort change

    fetchTools({
      curr_page: 1,
      per_page: itemsPerPage,
      search: searchQuery || undefined,
      sort_by: newSortConfig.field || undefined,
      sort_order: newSortConfig.order || undefined,
      is_archived: isActive ? true : false,
    });
  };

  // Handle pagination
  const handlePageChange = (curr_page: number) => {
    if (curr_page >= 1 && curr_page <= totalPages) {
      setCurrentPage(curr_page);
      fetchTools({
        curr_page,
        per_page: itemsPerPage,
        search: searchQuery || undefined,
        sort_by: sortConfig.field || undefined,
        sort_order: sortConfig.order || undefined,
        is_archived: isActive ? true : false,
      });
    }
  };

  const handleRowsPerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
    fetchTools({
      curr_page: 1,
      per_page: newPerPage,
      search: searchQuery || undefined,
      sort_by: sortConfig.field || undefined,
      sort_order: sortConfig.order || undefined,
      is_archived: isActive ? true : false,
    });
  };

  // Handle is_archived toggle (Active/Archived)
  useEffect(() => {
    setCurrentPage(1); // Reset to first curr_page on is_archived change

    fetchTools({
      curr_page: 1,
      per_page: itemsPerPage,
      search: searchQuery || undefined,
      sort_by: sortConfig.field || undefined,
      sort_order: sortConfig.order || undefined,
      is_archived: isActive ? true : false,
    });
  }, [isActive]);

  // Initial data fetch
  useEffect(() => {
    fetchTools({
      curr_page: currentPage,
      per_page: itemsPerPage,
      is_archived: isActive ? true : false,
    });
  }, []); // Only run on component mount

  const getSortIcon = (field: SortField) => {
    return (
      <div className="flex flex-col items-end mr-1">
        <ChevronUp
          size={12}
          className={`${
            sortConfig.field === field && sortConfig.order === "asc"
              ? "text-white"
              : "text-gray-300"
          }`}
        />
        <ChevronDown
          size={12}
          className={`${
            sortConfig.field === field && sortConfig.order === "desc"
              ? "text-white"
              : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const handleAddTool = () => {
    router.push("/observation-tools/new");
  };

  // Generate curr_page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Update your hasSelectedItems function for proper implementation
  const hasSelectedItems = () => {
    return selectedToolIds.size > 0;
  };

  // Add this function to get info about selected items (for modals)
  const getSelectedItemsInfo = () => {
    const items: { text: string; type: string }[] = [];

    selectedToolIds.forEach((id) => {
      const tool = tools.find((t) => t.id === id);
      if (tool) {
        items.push({
          text: tool.name,
          type: "Observation Tool",
        });
      }
    });

    return items;
  };

  // Add these selection handler functions
  const handleSelectRow = (
    toolId: string,
    event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event) {
      event.stopPropagation();
    }

    const newSelected = new Set(selectedToolIds);

    if (newSelected.has(toolId)) {
      newSelected.delete(toolId);
    } else {
      newSelected.add(toolId);
    }

    setSelectedToolIds(newSelected);
    updateSelectAllState(newSelected);
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      // Select all tools
      const newSelected = new Set<string>();
      tools.forEach((tool) => {
        newSelected.add(tool.id);
      });
      setSelectedToolIds(newSelected);
    } else {
      // Deselect all tools
      setSelectedToolIds(new Set());
    }

    setSelectAll(!selectAll);
  };

  const updateSelectAllState = (selected: Set<string>) => {
    // Set selectAll to true only when all tools are selected
    setSelectAll(tools.length > 0 && selected.size === tools.length);
  };

  // Update archive, restore, and delete handlers to use the selected IDs
  const handleArchive = async () => {
    const selectedIds = Array.from(selectedToolIds);

    if (selectedIds.length === 0) {
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual API call for archiving tools
      const response = await archiveObservationTools({ ids: selectedIds });

      if (response.success) {
        fetchTools({
          curr_page: currentPage,
          per_page: itemsPerPage,
          search: searchQuery || undefined,
          sort_by: sortConfig.field || undefined,
          sort_order: sortConfig.order || undefined,
          is_archived: isActive ? true : false,
        });
        setSelectedToolIds(new Set());
      }
    } catch (err) {
      console.error("Error archiving tools:", err);
      setError("Failed to archive selected tools");
    } finally {
      setLoading(false);
      setShowArchiveModal(false);
    }
  };

  // Add this with your other handler functions
  const handleRestore = async () => {
    const selectedIds = Array.from(selectedToolIds);

    if (selectedIds.length === 0) {
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual API call for restoring tools
      const response = await restoreObservationTools({ ids: selectedIds });

      if (response.success) {
        fetchTools({
          curr_page: currentPage,
          per_page: itemsPerPage,
          search: searchQuery || undefined,
          sort_by: sortConfig.field || undefined,
          sort_order: sortConfig.order || undefined,
          is_archived: isActive ? true : false,
        });
        setSelectedToolIds(new Set());
      }
    } catch (err) {
      console.error("Error restoring tools:", err);
      setError("Failed to restore selected tools");
    } finally {
      setLoading(false);
      setShowRestoreModal(false);
    }
  };

  // Similar updates for handleRestore and handleDelete...

  // Now let's update the table UI to handle selection

  // In your table head, update the checkbox:
  // <th className='w-12 px-4 py-3 text-left font-medium text-sm border-r border-blue-400 first:border-l-0'>
  //   <input
  //     type='checkbox'
  //     className='rounded border-gray-300'
  //     checked={selectAll}
  //     onChange={handleSelectAll}
  //   />
  // </th>

  // And in your table body rows, update each checkbox:
  // <td className='w-12 px-4 py-3 border-b border-gray-200 border-r first:border-l-0'>
  //   <input
  //     type='checkbox'
  //     className='rounded border-gray-300'
  //     checked={selectedToolIds.has(tool.id)}
  //     onChange={(e) => handleSelectRow(tool.id, e)}
  //   />
  // </td>

  return (
    <AnimatedContainer
      variant="fade"
      className="p-8 bg-white rounded-lg shadow-sm h-full"
    >
      <NetworkHeader
        title="Observation Tools"
        description="Browse all observation tools across the platform. Add, update, or archive tools as needed."
        search={searchQuery}
        setSearch={setSearchQuery}
        active={isActive}
        setActive={setIsActive}
        hasSelectedItems={hasSelectedItems}
        setShowArchiveModal={setShowArchiveModal}
        setShowRestoreModal={setShowRestoreModal}
        setShowDeleteModal={setShowDeleteModal}
        addButtonLink="/observation-tools/new"
        addButtonText="Add"
        activeLabel="Active"
        archivedLabel="Archived"
        showDelete={false}
      />

      {/* Results count */}
      {/* <div className='flex justify-end mb-6'>
				<div className='text-sm text-gray-600'>
					Showing {(currentPage - 1) * itemsPerPage + 1}-
					{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
					results
				</div>
			</div> */}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={() =>
              fetchTools({
                curr_page: currentPage,
                per_page: itemsPerPage,
                search: searchQuery || undefined,
                sort_by: sortConfig.field || undefined,
                sort_order: sortConfig.order || undefined,
                is_archived: isActive ? true : false,
              })
            }
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#2264AC] text-white">
              <th className="w-12 px-4 py-3 text-left font-medium text-sm ">
                <input
                  type="checkbox"
                  className="h-4 w-4 relative appearance-none border border-white rounded-sm bg-primary-blue
    checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 
    checked:after:flex checked:after:items-center checked:after:justify-center 
    checked:after:text-white checked:after:text-xs"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                className="px-4 py-3 text-left text-[14px] font-semibold text-[#F9F5FF] border-r border-gray-400 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Briefcase size={24} />
                    <span>Observation Tool</span>
                  </div>
                  {getSortIcon("name")}
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-[14px] font-semibold text-[#F9F5FF] border-r border-gray-400 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <CalendarDots size={24} />
                    <span>Created On</span>
                  </div>
                  {getSortIcon("created_at")}
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-[14px] font-semibold text-[#F9F5FF] border-r border-gray-400 cursor-pointer"
                onClick={() => handleSort("createdBy")}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <User size={24} />
                    <span>Created By</span>
                  </div>
                  {getSortIcon("createdBy")}
                </div>
              </th>

              <th
                className="w-[100px] min-w-[120px] text-center text-[12px] font-normal text-[#F9F5FF] sticky right-0 z-20 border-l-2 border-gray-200 px-2 py-3"
                style={{
                  backgroundColor: "#2264AC",
                  boxShadow: "inset 1px 0 0 #E5E7EB",
                }}
              >
                <div className="flex justify-center items-center space-x-2">
                  <ArrowDownRight size={24} />
                  <span className="text-[14px] text-white font-semibold">
                    Action
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                  </div>
                </td>
              </tr>
            ) : tools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No observation tools found
                </td>
              </tr>
            ) : (
              tools.map((tool, index) => (
                <motion.tr
                  key={tool.id}
                  className={`${index % 2 === 1 ? "bg-[#EFF6FF]" : "bg-white"}`}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.9)" }}
                  // onClick={(e) => handleSelectRow(tool.id, e)}
                >
                  <td className="w-12 px-4 py-3   first:border-l-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-primary-blue"
                      checked={selectedToolIds.has(tool.id)}
                      onChange={(e) => handleSelectRow(tool.id, e)}
                    />
                  </td>
                  <td className="py-3 border-b border-gray-200 border-r text-sm">
                    {tool.name}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 border-r text-sm">
                    {tool.created_at}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 border-r text-sm">
                    {tool.createdBy.map((creator, idx) => (
                      <span key={idx}>
                        {idx > 0 && idx < tool.createdBy.length - 1 && ", "}
                        {creator.includes("+") ? (
                          <span className="text-emerald-600">{creator}</span>
                        ) : (
                          creator
                        )}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 last:border-r-0 flex justify-center">
                    <button className="text-primary-emerald hover:text-emerald-800">
                      <PencilSimpleLine size={20} color="#2A7251" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>

            {getPageNumbers().map((curr_page) => (
              <button
                key={curr_page}
                onClick={() => handlePageChange(curr_page)}
                disabled={loading}
                className={`px-3 py-1 rounded-md text-sm ${
                  curr_page === currentPage
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                } disabled:cursor-not-allowed`}
              >
                {curr_page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )} */}
      <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">
            {tools.length > 0
              ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  totalItems
                )} of ${totalItems}`
              : "0 results"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="text-sm px-1 py-1"
              disabled={loading}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`p-1 border rounded ${
                currentPage === 1 || loading
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm px-1 text-gray-500">
              {currentPage}/{totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || totalPages === 0 || loading
              }
              className={`p-1 border rounded ${
                currentPage === totalPages || totalPages === 0 || loading
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={30} />
              <h2 className="text-[16px] text-black font-medium">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {getSelectedItemsInfo().length === 0
                ? "Please select observation tools to archive."
                : `Are you sure you want to archive ${
                    getSelectedItemsInfo().length === 1
                      ? "this observation tool?"
                      : "these observation tools?"
                  }`}
            </p>

            {/* Selected Items Display */}
            {getSelectedItemsInfo().length > 0 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-2 ${
                  getSelectedItemsInfo().length > 2
                    ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {getSelectedItemsInfo().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-3"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-[12px] text-black font-semibold">
                        {item.text}
                      </p>
                    </div>
                    <div className="text-[12px] text-gray font-semibold text-right">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-bg-warring-red border-l-4 border-primary-red p-4 mb-6 mt-[10px]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Warning size={24} className="text-primary-red" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-[#C23E19] font-medium"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19] mt-2 font-medium">
                {getSelectedItemsInfo().length === 0
                  ? "No observation tools selected. Please select at least one observation tool to archive."
                  : `Archiving ${
                      getSelectedItemsInfo().length === 1
                        ? "this observation tool"
                        : "these observation tools"
                    } will remove ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } from active dashboards and make ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } unavailable for new sessions. ${
                      getSelectedItemsInfo().length === 1 ? "It" : "They"
                    } will remain in the system and can be restored later if needed.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={getSelectedItemsInfo().length === 0}
                className={`px-4 py-2 ${
                  getSelectedItemsInfo().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B4351C] hover:bg-[#943015]"
                } text-white font-medium rounded-lg transition-colors`}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <ClockClockwise className="text-blue-600" size={24} />
              <h2 className="text-[16px] text-black font-medium">Restore</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {getSelectedItemsInfo().length === 0
                ? "Please select observation tools to restore."
                : `Are you sure you want to restore ${
                    getSelectedItemsInfo().length === 1
                      ? "this observation tool?"
                      : "these observation tools?"
                  }`}
            </p>

            {/* Selected Items Display */}
            {getSelectedItemsInfo().length > 0 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-2 mb-6 shadow-md ${
                  getSelectedItemsInfo().length > 2
                    ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {getSelectedItemsInfo().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-3"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-[12px] text-black font-semibold">
                        {item.text}
                      </p>
                    </div>
                    <div className="text-[12px] text-gray font-semibold text-right">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Note Box */}
            <div className="bg-blue-50 border-l-4 border-[#2264AC] p-4 mb-6 mt-[10px] text-[#2264AC]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <BsCalendarEvent size={16} color="#2264AC" />
                </div>
                <div className="ml-1">
                  <p className="text-sm font-medium">Note</p>
                </div>
              </div>
              <p className="text-left text-sm mt-2 font-medium">
                {getSelectedItemsInfo().length === 0
                  ? "No observation tools selected. Please select at least one observation tool to restore."
                  : `Restoring ${
                      getSelectedItemsInfo().length === 1
                        ? "this observation tool"
                        : "these observation tools"
                    } will make ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } available again for new sessions. ${
                      getSelectedItemsInfo().length === 1 ? "It" : "They"
                    } will reappear in all relevant views and become selectable across the platform.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={getSelectedItemsInfo().length === 0}
                className={`px-4 py-2 ${
                  getSelectedItemsInfo().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-700 hover:bg-emerald-800"
                } text-white font-medium rounded-lg transition-colors`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedContainer>
  );
}
