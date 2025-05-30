"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import {
  FaSearch,
  FaArchive,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsBarChart, BsBarChartSteps } from "react-icons/bs";
import { BsCalendarEvent, BsPeople } from "react-icons/bs";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { getObservationTools } from "@/services/observationToolService";

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
  const [itemsPerPage] = useState(10);

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

  // Debounced search function
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setCurrentPage(1); // Reset to first curr_page on new search
        fetchTools({
          curr_page: 1,
          per_page: itemsPerPage,
          search: query || undefined,
          sort_by: sortConfig.field || undefined,
          sort_order: sortConfig.order || undefined,
          is_archived: isActive ? true : false,
        });
      }, 500); // 500ms debounce

      setSearchTimeout(timeout);
    },
    [fetchTools, itemsPerPage, sortConfig, isActive, searchTimeout]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <HiOutlineArrowsUpDown className="ml-auto w-3 h-3 " />;
    }
    if (sortConfig.order === "asc") {
      return <FaSortUp className="ml-auto w-3 h-3" />;
    }
    if (sortConfig.order === "desc") {
      return <FaSortDown className="ml-auto w-3 h-3" />;
    }
    return <FaSort className="ml-auto w-3 h-3" />;
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

  return (
    <AnimatedContainer
      variant="fade"
      className="p-8 bg-white rounded-lg shadow-sm h-full"
    >
      <AnimatedContainer variant="slide" className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Observation Tools
        </h1>
        <p className="text-gray-600 text-center">
          Browse all observation tools across the platform. Add, update, or
          archive tools as needed.
        </p>
      </AnimatedContainer>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <FaArchive className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddTool}
            className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 mt-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-12px ${
                isActive ? "text-[#494B56]" : "text-[#000] font-medium"
              }`}
            >
              Active
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActive((a) => !a)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-700`}
            >
              <motion.span
                layout
                initial={false}
                animate={{
                  x: isActive ? 24 : 4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="inline-block h-4 w-4 rounded-full bg-white"
              />
            </motion.button>
            <span
              className={`text-12px ${
                isActive ? "text-[#000] font-medium" : "text-[#494B56]"
              }`}
            >
              Archived
            </span>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </div>
      </div>

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
                is_archived: isActive ? "active" : "archived",
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
              <th className="w-12 px-4 py-3 text-left font-medium text-sm border-r border-blue-400 first:border-l-0">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  <BsBarChart className="mr-2 w-4 h-4" />
                  <span>Observation Tool</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center">
                  <BsCalendarEvent className="mr-2 w-4 h-4" />
                  <span>Created On</span>
                  {getSortIcon("created_at")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-sm border-r border-blue-400 cursor-pointer"
                onClick={() => handleSort("createdBy")}
              >
                <div className="flex items-center">
                  <BsPeople className="mr-2 w-4 h-4" />
                  <span>Created By</span>
                  {getSortIcon("createdBy")}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm last:border-r-0">
                <div className="flex items-center">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                    <span>Loading...</span>
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
                >
                  <td className="w-12 px-4 py-3 border-b border-gray-200 border-r first:border-l-0">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 border-r text-sm">
                    {tool.name}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 border-r text-sm text-gray-600">
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
                  <td className="px-4 py-3 border-b border-gray-200 last:border-r-0">
                    <button className="text-emerald-600 hover:text-emerald-800">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </AnimatedContainer>
  );
}
