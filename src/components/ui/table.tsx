import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  Save,
  RotateCcw,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ClockClockwise,
  Info,
  MagnifyingGlass,
  Plus,
  Trash,
  Archive,
} from "@phosphor-icons/react";
import Image from "next/image";
import CustomDropdown from "./CustomDropdown";
import MultiSelect from "./MultiSelect";
import Tooltip from "../Tooltip";

// Define the column interface
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  icon?: React.ReactNode;
  renderCell?: (row: any) => React.ReactNode;
  options?: any[]; // For dropdown options
  editable?: boolean;
}

// Define the props for the Table component
interface TableProps {
  columns: Column[];
  data: any[];
  totalCount: number; // Total count from backend
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  onEdit?: (row: any) => void;
  onSave?: (row: any) => void;
  onArchive?: (row: any) => void;
  onRestore?: (row: any) => void;
  onDelete?: (selectedIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onSortChange?: (key: string, direction: "asc" | "desc" | null) => void;
  loading?: boolean;
  currentPage?: number;
  staticbg: string;
  dynamicbg: string;
  onCreate: string;
  onToggleArchived?: (archived: boolean) => void;
  onSearchChange?: (search: string) => void;
  sidebarVisible?: boolean; // New prop to track sidebar visibility
  pageType?: "schools" | "users"; // New prop to differentiate between pages
  onNetworkChange?: (row: any) => void;
  onDistrictChange?: (row: any) => void;
}

export default function Table({
  columns,
  data,
  totalCount,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialRowsPerPage = 10,
  onEdit,
  onSave,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  loading = false,
  currentPage: controlledCurrentPage,
  staticbg,
  dynamicbg,
  onCreate,
  onArchive,
  onRestore,
  onToggleArchived,
  onSearchChange,
  sidebarVisible = false,
  pageType,
  onNetworkChange,
  onDistrictChange,
}: // Default to false if not provided
TableProps) {
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "", direction: null });

  // State for pagination (internal if not controlled)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const router = useRouter();
  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Editing state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showArchiveButton, setShowArchiveButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const currentPage =
    controlledCurrentPage !== undefined
      ? controlledCurrentPage
      : internalCurrentPage;
  const [search, setSearch] = useState("");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleSort = (key: string) => {
    // setShowArchived(false);
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }

    setSortConfig({ key, direction });

    if (onSortChange) {
      onSortChange(key, direction);
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const handlePageChange = (page: number) => {
    // setShowArchived(false);
    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(page);
    }

    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    // setShowArchived(false);
    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(1);
    }

    if (onRowsPerPageChange) {
      // setShowArchived(false);
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  const toggleSelectionModeArchive = () => {
    if (showArchived) {
      setShowRestoreModal(true);
      setSelectionMode(!selectionMode);
      setShowArchiveButton(!showArchiveButton);
    } else {
      setShowArchiveModal(true);
      setSelectionMode(!selectionMode);
      setShowArchiveButton(!showArchiveButton);
    }

    // For schools page, update the button text based on archive state
    if (pageType === "schools" && showArchived) {
      // Change button text or icon to indicate restore action
      // This is handled in the render part
    }
  };
  const toggleSelectionModeDelete = () => {
    setSelectionMode(!selectionMode);
    setShowDeleteButton(!showDeleteButton);
    if (selectionMode) {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.id || row.school));
    }
  };

  // Delete selected rows
  const handleDelete = () => {
    if (onDelete && selectedRows.length > 0) {
      onDelete(selectedRows);
      setSelectedRows([]);
      setSelectionMode(false);
      setShowArchiveButton(false);
      setShowDeleteButton(false);
      // setShowDeleteModal(false);
      setSelectedRows([]);
    }
  };

  const handleArchive = () => {
    if (onArchive && selectedRows.length > 0) {
      onArchive(selectedRows);
      setSelectedRows([]);
      setSelectionMode(false);
      setShowArchiveButton(false);
      setShowDeleteButton(false);
      //setShowArchived(false);
      setShowArchiveModal(false);
    }
  };

  const handleRestore = () => {
    if (onRestore && selectedRows.length > 0) {
      onRestore(selectedRows);
      setSelectedRows([]);
      setSelectionMode(false);
      setShowArchiveButton(false);
      setShowDeleteButton(false);
      //setShowArchived(false);
      setShowRestoreModal(false);
    }
  };

  // Start editing a row
  const handleStartEdit = (row: any) => {
    setEditingRowId(row.id);
    setEditingData({ ...row });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingData(null);
  };

  // Save edited row
  const handleSaveEdit = () => {
    if (onSave && editingData) {
      onSave(editingData);
      setEditingRowId(null);
      setEditingData(null);
    }
  };

  // Handle edit field change
  const handleEditChange = (key: string, value: any) => {
    console.log("keyeeee", key, "valueeeeeeee", value);
    if (editingData) {
      setEditingData({
        ...editingData,
        [key]: value,
      });
    }
    if (key === "network" && onNetworkChange) {
      try {
        setEditingData({
          ...editingData,
          [key]: value,
          district: "",
          school: "",
        });

        onNetworkChange(value);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }

    if (key === "district" && onDistrictChange) {
      try {
        setEditingData({
          ...editingData,
          [key]: value,
          school: "",
        });
        onDistrictChange(value);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    }
  };
  const getGradeOptionsForSchool = (schoolId: string) => {
    const school = data.find((s) => s.id === schoolId);
    if (!school) return [];
    return school.grades.map((g: string) => ({ label: g, value: g }));
  };

  return (
    <div
      className={`w-full bg-white transition-all duration-300 ${
        sidebarVisible ? "table-with-sidebar" : "table-full-width"
      }`}
    >
      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-[16px] text-black font-medium">Archive</h2>
            </div>
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {selectedRows.length === 0
                ? `Please select ${
                    pageType === "schools" ? "schools" : "users"
                  } to archive.`
                : `Are you sure you want to archive ${
                    selectedRows.length === 1 ? "this" : "these"
                  } ${
                    pageType === "schools"
                      ? selectedRows.length === 1
                        ? "school"
                        : "schools"
                      : selectedRows.length === 1
                      ? "user"
                      : "users"
                  }?`}
            </p>

            {/* Single user selection */}
            {selectedRows.length === 1 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4 shadow-md font-normal">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start w-full">
                    {data.find((row) => row.id === selectedRows[0])
                      ?.first_name ? (
                      // User view - show name and email
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="text-[12px] text-black-400 text-start font-medium">
                            {
                              data.find((row) => row.id === selectedRows[0])
                                ?.first_name
                            }
                          </p>
                          <p className="text-[12px] text-[#637381]-400 font-medium">
                            {
                              data.find((row) => row.id === selectedRows[0])
                                ?.email
                            }
                          </p>
                        </div>
                        <p className="text-[12px] text-gray-500 font-medium">
                          {data.find((row) => row.id === selectedRows[0])
                            ?.role || "User"}
                        </p>
                      </div>
                    ) : (
                      // School view - show school name
                      <div className="flex justify-between w-full">
                        <p className="text-[12px] text-black-400 font-medium">
                          {data.find((row) => row.id === selectedRows[0])
                            ?.school ||
                            data.find((row) => row.id === selectedRows[0])
                              ?.name}
                        </p>
                        <p className="text-[12px] text-gray-500 font-medium">
                          School
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Multiple items selection with scrollable list */}
            {selectedRows.length > 1 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-4 mb-6 ${
                  selectedRows.length > 2
                    ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {selectedRows.map((itemId) => {
                  const item = data.find((row) => row.id === itemId);
                  const isUser = !!item?.first_name;

                  return (
                    <div
                      key={itemId}
                      className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-1.5"
                    >
                      <div className="flex flex-col items-start">
                        {isUser ? (
                          <>
                            <p className="text-[12px] text-black-400 font-medium">
                              {item?.first_name}
                            </p>
                            <p className="text-[12px] text-[#637381]-400 font-medium">
                              {item?.email}
                            </p>
                          </>
                        ) : (
                          <p className="text-[12px] text-black-400 font-medium">
                            {item?.school || item?.name}
                          </p>
                        )}
                      </div>
                      <div className="text-[12px] text-black-400 text-right font-medium">
                        {isUser ? item?.role : "School"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-red-50 border-l-4 border-[#C23E19] p-4 mb-6 mt-[10px]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-[#C23E19]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#C23E19] font-medium"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19] font-medium">
                {selectedRows.length === 0
                  ? `No ${
                      pageType === "schools" ? "schools" : "users"
                    } selected. Please select at least one ${
                      pageType === "schools" ? "school" : "user"
                    } to archive.`
                  : pageType === "schools"
                  ? "Archiving this school will remove it from active views. Associated data will remain stored and become visible again if the school is restored. Please confirm before proceeding."
                  : "Archiving this user will revoke their access and remove them from active dashboards. Their account will remain in the system and can be restored later if needed."}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowArchiveModal(false);
                  setSelectedRows([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={selectedRows.length === 0}
                className={`px-4 py-2 ${
                  selectedRows.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B4351C] hover:bg-[#943015]"
                } text-white font-medium rounded-[6px] transition-colors`}
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
            <div className="flex items-center gap-2 mb-4">
              <ClockClockwise className="text-blue-600" size={24} />
              <h2 className="text-[16px] font-medium text-black">Restore</h2>
            </div>
            <p className="text-left text-gray-700 mb-4 font-medium">
              {selectedRows.length === 0
                ? `Please select ${
                    pageType === "schools" ? "schools" : "users"
                  } to restore.`
                : `Are you sure you want to restore ${
                    selectedRows.length === 1 ? "this" : "these"
                  } ${
                    pageType === "schools"
                      ? selectedRows.length === 1
                        ? "school"
                        : "schools"
                      : selectedRows.length === 1
                      ? "user"
                      : "users"
                  }?`}
            </p>

            {/* Single user selection */}
            {selectedRows.length === 1 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    {/* Check if we're dealing with users or schools */}
                    {data.find((row) => row.id === selectedRows[0])
                      ?.first_name ? (
                      <>
                        <p className="text-[12px] text-black-400 font-medium">
                          {
                            data.find((row) => row.id === selectedRows[0])
                              ?.first_name
                          }
                        </p>
                        <p className="text-[12px] text-[#637381]-400 font-medium">
                          {
                            data.find((row) => row.id === selectedRows[0])
                              ?.email
                          }
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-start w-full">
                        <div className="flex justify-between w-full">
                          <p className="text-[12px] text-black-400 font-medium">
                            {data.find((row) => row.id === selectedRows[0])
                              ?.school ||
                              data.find((row) => row.id === selectedRows[0])
                                ?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-[12px] text-black-400 items-center font-medium">
                    {data.find((row) => row.id === selectedRows[0])?.role ||
                      (data.find((row) => row.id === selectedRows[0])?.school
                        ? ""
                        : "School")}
                  </div>
                </div>
              </div>
            )}

            {/* Multiple items selection with scrollable list */}
            {selectedRows.length > 1 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-4 mb-6 ${
                  selectedRows.length > 2
                    ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {selectedRows.map((itemId) => {
                  const item = data.find((row) => row.id === itemId);
                  const isUser = !!item?.first_name;

                  return (
                    <div
                      key={itemId}
                      className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-1.5"
                    >
                      <div className="flex flex-col items-start">
                        {isUser ? (
                          <>
                            <p className="text-[12px] text-black-400 font-medium">
                              {item?.first_name}
                            </p>
                            <p className="text-[12px] text-[#637381]-400 font-medium">
                              {item?.email}
                            </p>
                          </>
                        ) : (
                          <p className="text-[12px] text-black-400 font-medium">
                            {item?.school || item?.name}
                          </p>
                        )}
                      </div>
                      <div className="text-[12px] text-black-400 text-right font-medium">
                        {isUser ? item?.role : "School"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="bg-blue-50 border-l-4 border-[#2264AC] p-4 mb-6 mt-[10px]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info size={16} color="#2264AC" />
                </div>
                <div>
                  <p className="text-sm text-[#2264AC] px-1 font-medium">
                    {" "}
                    Note
                  </p>
                </div>
              </div>
              <div>
                <p className="text-left text-sm text-[#2264AC] font-medium">
                  {selectedRows.length === 0
                    ? `No ${
                        pageType === "schools" ? "schools" : "users"
                      } selected. Please select at least one ${
                        pageType === "schools" ? "school" : "user"
                      } to restore.`
                    : pageType === "schools"
                    ? "Restoring this school will make it active again. Please confirm before proceeding."
                    : "Restoring this user will return their access and visibility across the platform. Any roles, assignments, or linked sessions will become active and reappear in relevant views."}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedRows([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-[6px] font-medium"
              >
                Cancel
              </button>
              <button
                disabled={selectedRows.length === 0}
                onClick={handleRestore}
                className={`px-4 py-2 text-white font-medium rounded-[6px] ${
                  selectedRows.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2A7251] hover:bg-[#2A7251]"
                }  transition-colors`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal - Only for Schools page */}
      {pageType === "schools" && showDeleteButton && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <Trash size={24} />
              <h2 className="text-[16px] text-black font-medium">Delete</h2>
            </div>
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {selectedRows.length === 0
                ? "Please select schools to delete."
                : `Are you sure you want to delete ${
                    selectedRows.length === 1 ? "this" : "these"
                  } school${selectedRows.length > 1 ? "s" : ""}?`}
            </p>

            {/* Display selected schools */}
            {selectedRows.length > 0 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-4  shadow-md font-normal ${
                  selectedRows.length > 2
                    ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {selectedRows.map((itemId) => {
                  const item = data.find(
                    (row) => row.id === itemId || row.school === itemId
                  );
                  return (
                    <div
                      key={itemId}
                      className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-1.5"
                    >
                      <div className="flex flex-col items-start">
                        <p className="text-[12px] text-black-400 font-medium">
                          {item?.name || item?.school}
                        </p>
                      </div>

                      <p className="text-[12px] text-black-400 font-medium">
                        School
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Warning message */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 mt-[10px]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600 font-medium">Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-red-600 mt-2 font-medium">
                {selectedRows.length === 0
                  ? "No schools selected. Please select at least one school to delete."
                  : "Deleting this school will remove it from the scheduled observation sessions. Please confirm before proceeding"}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowDeleteButton(false);
                  setSelectionMode(false);
                  setSelectedRows([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={selectedRows.length === 0}
                className={`px-4 py-2 ${
                  selectedRows.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white font-medium rounded-[6px] transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between px-1 py-1 w-full gap-y-2">
        <div className="flex items-center space-x-2 sm:w-2/3 w-full">
          {!editingRowId && (
            <div className="relative w-[50%]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full border rounded-[6px] pl-10 pr-3 py-2 text-sm"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  if (onSearchChange) {
                    onSearchChange(value);
                  }
                }}
              />
            </div>
          )}
          {/* <div className="flex items-center space-x-2"> */}
          {editingRowId && ( //selectionMode ||
            <button
              onClick={() => {
                if (selectionMode) {
                  setSelectionMode(false);
                  setSelectedRows([]);
                } else {
                  handleCancelEdit();
                }
              }}
              className={` py-1 rounded ${
                selectionMode ? " hover:bg-gray-200" : ""
              }`}
            >
              Close
            </button>
          )}

          {editingRowId && ( //!selectionMode &&
            <button
              onClick={handleSaveEdit}
              className=" bg-[#2A7251] text-white px-4 py-2 rounded-lg hover:bg-[#2A7251] transition-colors"
            >
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSelectionModeArchive}
            // className="p-2 text-gray-400"
            className={`${
              selectedRows.length > 0
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            } ${pageType === "schools" ? "py-2" : "p-2"}`}
            disabled={selectedRows.length <= 0}
            title={
              pageType === "schools" && showArchived ? "Restore" : "Archive"
            }
          >
            <span className="sr-only">
              {pageType === "schools" && showArchived ? "Restore" : "Archive"}
            </span>
            {pageType === "schools" && showArchived ? (
              <ClockClockwise size={24} className="text-black" />
            ) : (
              <Archive size={24} className="text-black" />
            )}
          </button>

          {/* Show delete button only on Schools page */}
          {pageType === "schools" && (
            <button
              onClick={toggleSelectionModeDelete}
              className={`p-2 ${
                selectedRows.length > 0
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={selectedRows.length <= 0}
            >
              <span className="sr-only">Delete</span>
              <Trash size={24} className="text-black" />
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(onCreate)}
            className="flex gap-2 items-center bg-[#2A7251] text-white px-6 py-2 rounded-[6px] hover:bg-[#2A7251] transition-colors"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>
      </div>

      <div className="px-1 py-2 ">
        <div className="flex items-center space-x-2">
          <span
            className={`text-12px ${
              showArchived ? "text-[#494B56]" : "text-[#000] font-medium"
            }`}
          >
            Active
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const newState = !showArchived;
              setShowArchived(newState);
              if (onToggleArchived) {
                onToggleArchived(newState);
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showArchived ? "bg-[#2A7251]" : "bg-[#2A7251]" //'bg-gray-200'
            }`}
          >
            <motion.span
              layout
              initial={false}
              animate={{
                x: showArchived ? 24 : 4,
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
              showArchived ? "text-[#000] font-medium" : "text-[#494B56]"
            }`}
          >
            Archived
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto rounded-[6px] overflow-visible">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: staticbg }} className="text-white">
                {/* {selectionMode && ( */}
                <th className="pl-3  py-3 w-8 min-w-[20px]">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 appearance-none border border-white rounded-sm checked:bg-[color:var(--accent)] checked:border-white checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center"
                      style={{ accentColor: staticbg }}
                    />
                  </div>
                </th>
                {/* )} */}
                {columns.map((column, colIndex) => {
                  const isLastColumn = colIndex === columns.length - 1;
                  return (
                    <th
                      key={column.key}
                      className={`min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-semibold border-r-2 border-gray-200 ${
                        isLastColumn && showArchived
                          ? "rounded-tr-xl"
                          : "border-r-2 border-[#D4D4D4]"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between w-full text-[14px] font-semibold text-[#F9F5FF] ${
                          column.sortable ? "cursor-pointer" : ""
                        }`}
                        onClick={() =>
                          column.sortable && handleSort(column.key)
                        }
                      >
                        {/* Left side: icon and label */}
                        <div className="flex items-center space-x-2">
                          {column.icon && <span>{column.icon}</span>}
                          <span>{column.label}</span>
                        </div>

                        {/* Right side: sorting indicators */}
                        {column.sortable && (
                          <div className="ml-4 flex flex-col items-end">
                            <ChevronUp
                              size={12}
                              className={`${
                                sortConfig.key === column.key &&
                                sortConfig.direction === "asc"
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            />
                            <ChevronDown
                              size={12}
                              className={`${
                                sortConfig.key === column.key &&
                                sortConfig.direction === "desc"
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
                {!showArchived && (
                  <th
                    className="w-[100px] min-w-[100px] text-center text-[12px] font-normal text-[#F9F5FF] sticky right-0 z-20 border-l-2 border-gray-200 px-2 py-3"
                    style={{
                      backgroundColor: staticbg,
                      boxShadow: "inset 1px 0 0 #E5E7EB",
                    }}
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <Image
                        src="/action.svg"
                        height={13}
                        width={13}
                        alt="Action"
                      />
                      <span className="text-[14px] text-white font-semibold">
                        Action
                      </span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="px-6 py-4 text-center"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, index) => {
                  const rowId = row.id || row.school;
                  const isEditing = editingRowId === rowId;

                  return (
                    <tr
                      key={rowId || index}
                      style={{
                        backgroundColor: index % 2 === 1 ? dynamicbg : "#fff",
                      }}
                      className={`${
                        isEditing
                          ? "shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative z-10"
                          : ""
                      }`}
                    >
                      <td className="pl-3  py-4 w-8 min-w-[32px]">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(rowId)}
                            onChange={() => handleSelectRow(rowId)}
                            className="h-4 w-4"
                            style={{ accentColor: staticbg }}
                          />
                        </div>
                      </td>

                      {columns.map((column, colIndex) => {
                        const isLastColumn = colIndex === columns.length - 1;
                        return (
                          <td
                            key={`${rowId || index}-${column.key}`}
                            className={`px-3 py-3 whitespace-nowrap border-r-2 border-gray-200 ${
                              isLastColumn && !showArchived
                                ? "rounded-tr-xl"
                                : "border-r-1 border-[#D4D4D4]"
                            }`}
                          >
                            {isEditing && column.editable ? (
                              column.options ? (
                                <div className="relative">
                                  {/* <select
                                    value={editingData[column.key]}
                                    onChange={(e) =>
                                      handleEditChange(
                                        column.key,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                                  >
                                    {column.options.map((option, i) => (
                                      <option
                                        key={i}
                                        value={option.value || option}
                                      >
                                        {option.label || option}
                                      </option>
                                    ))}
                                  </select> */}

                                  {column.key === "grades" ||
                                  column.key === "curriculums" ||
                                  column.key === "interventions" ? (
                                    <MultiSelect
                                      options={
                                        column.key === "grades"
                                          ? getGradeOptionsForSchool(
                                              editingData.id
                                            ) // use the row's `id` as `schoolId`
                                          : column.options || []
                                      }
                                      values={editingData[column.key] || []}
                                      isGrade={column.key === "grades"}
                                      onChange={(vals) =>
                                        handleEditChange(column.key, vals)
                                      }
                                    />
                                  ) : (
                                    <CustomDropdown
                                      value={editingData[column.key]}
                                      options={column.options}
                                      onChange={(val) =>
                                        handleEditChange(column.key, val)
                                      }
                                    />
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={editingData[column.key]}
                                  onChange={(e) =>
                                    handleEditChange(column.key, e.target.value)
                                  }
                                  className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                                />
                              )
                            ) : column.renderCell ? (
                              column.renderCell(row)
                            ) : (
                              // row[column.key]
                              <span
                                className={`flex items-center gap-1 px-2 py-1 rounded text-[14px] font-normal text-[#000] ${
                                  column.key === "user_type"
                                    ? row[column.key] === "Admin"
                                      ? "bg-[#E9F3FF] text-[#2264AC]"
                                      : row[column.key] === "Super Admin"
                                      ? "bg-[#F4EBFF] text-[#6C4996]"
                                      : row[column.key] === "Network Admin"
                                      ? "bg-[#FFFCDD] text-[#F59E0B]"
                                      : row[column.key] === "Observer"
                                      ? "bg-[#D6FDFD] text-[#007778]"
                                      : row[column.key] === "District Viewer"
                                      ? "bg-[#FFF4EF] text-[#F25D00]"
                                      : "bg-gray-100 text-gray-700"
                                    : "text-black"
                                }`}
                              >
                                {column.key === "user_type" && (
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      row[column.key] === "Admin"
                                        ? "bg-[#2264AC]"
                                        : row[column.key] === "Super Admin"
                                        ? "bg-[#6C4996]"
                                        : row[column.key] === "Network Admin"
                                        ? "bg-[#F59E0B]"
                                        : row[column.key] === "Observer"
                                        ? "bg-[#007778]"
                                        : row[column.key] === "District Viewer"
                                        ? "bg-[#F25D00]"
                                        : "bg-gray-700"
                                    }`}
                                  ></span>
                                )}

                                {/* ✅ For multiselect keys */}
                                {[
                                  "grades",
                                  "curriculums",
                                  "interventions",
                                ].includes(column.key) &&
                                Array.isArray(row[column.key]) ? (
                                  <>
                                    {(() => {
                                      const values: string[] =
                                        row[column.key] || [];

                                      const validOptions = column.options || [];

                                      const labels = values
                                        .map((val) => {
                                          const found = validOptions.find(
                                            (opt) => opt.value === val
                                          );
                                          return found?.label;
                                        })
                                        .filter(Boolean); // removes undefined

                                      const firstLabel = labels[0];
                                      const remainingCount = labels.length - 1;

                                      return (
                                        <>
                                          {firstLabel}
                                          {remainingCount > 0 && (
                                            <Tooltip
                                              content={
                                                <div className="flex flex-col space-y-1">
                                                  {labels.map((label, idx) => (
                                                    <div key={idx}>{label}</div>
                                                  ))}
                                                </div>
                                              }
                                            >
                                              <span className="text-blue-600 cursor-pointer ml-1">
                                                +{remainingCount} more
                                              </span>
                                            </Tooltip>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </>
                                ) : (
                                  row[column.key]
                                )}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {!showArchived && (
                        <td
                          className="w-[100px] min-w-[100px] text-center sticky right-0 border-l-2 border-gray-400 px-2 py-4"
                          style={{
                            backgroundColor: "#ffffff",
                            boxShadow: "inset 2px 0 0 #D4D4D4",
                          }}
                        >
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() => handleStartEdit(row)}
                              className="text-green-500 hover:text-green-700"
                              title="Edit"
                            >
                              <Image
                                src="/actionrow.svg"
                                height={20}
                                width={20}
                                alt="Edit"
                                className="inline"
                              />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500">
                {startIndex + 1}-
                {Math.min(startIndex + rowsPerPage, totalCount)} of {totalCount}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="text-sm  px-1 py-1"
                disabled={loading}
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1 ">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={`p-1 border rounded  ${
                  currentPage === 1 || loading
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-500 px-1">
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
      </div>
    </div>
  );
}
