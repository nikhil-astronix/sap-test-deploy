import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Archive,
  Check,
  X,
  Save,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  onToggleArchived,
  onSearchChange,
}: TableProps) {
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
    setShowArchived(false);
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
    setShowArchived(false);
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
    setShowArchived(false);
    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(1);
    }

    if (onRowsPerPageChange) {
      setShowArchived(false);
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  const toggleSelectionModeArchive = () => {
    // if (selectionMode) {
    //   setSelectedRows([]);
    // }
    if (showArchived) {
      setShowRestoreModal(true);
      setSelectionMode(!selectionMode);
      setShowArchiveButton(!showArchiveButton);

      //setSelectedRows([]);
    } else {
      setShowArchiveModal(true);
      setSelectionMode(!selectionMode);
      setShowArchiveButton(!showArchiveButton);
      //setSelectedRows([]);
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
      setShowArchiveModal(false);
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
      setShowArchived(false);
      setShowRestoreModal(false);
    }
  };

  // Start editing a row
  const handleStartEdit = (row: any) => {
    setEditingRowId(row.id || row.school);
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
    if (editingData) {
      setEditingData({
        ...editingData,
        [key]: value,
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-xl font-semibold">Archive</h2>
            </div>
            <p className="text-left text-gray-700 mb-4">
              Are you sure you want to archive this user?
            </p>

            {/* Single user selection */}
            {selectedRows.length === 1 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        data.find((row) => row.id === selectedRows[0])
                          ?.first_name
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {data.find((row) => row.id === selectedRows[0])?.email}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {data.find((row) => row.id === selectedRows[0])?.role}
                  </div>
                </div>
              </div>
            )}
            {/* Multiple users selection with scrollable list */}
            {selectedRows.length > 1 && (
              <div
                className={`rounded-lg bg-gray-50 p-4 mb-6 ${
                  selectedRows.length > 2
                    ? "max-h-32 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400"
                    : ""
                }`}
              >
                {selectedRows.map((userId) => {
                  const user = data.find((row) => row.id === userId);
                  return (
                    <div
                      key={userId}
                      className="flex justify-between items-center border-b border-gray-200 last:border-0 py-1.5"
                    >
                      <div className="flex flex-col items-start">
                        <p className="font-medium">{user?.first_name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div className="text-sm font-medium text-right ">
                        {user?.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
                  <p className="text-sm text-[#C23E19]"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19]">
                Archiving this user will revoke their access and remove them
                from active dashboards. Their account will remain in the system
                and can be restored later if needed.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#B4351C] text-white rounded-lg hover:bg-[#943015] transition-colors"
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
              <RotateCcw className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Restore</h2>
            </div>
            <p className="text-left text-gray-700 mb-4">
              Are you sure you want to restore this user?
            </p>

            {/* Single user selection */}
            {selectedRows.length === 1 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        data.find((row) => row.id === selectedRows[0])
                          ?.first_name
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {data.find((row) => row.id === selectedRows[0])?.email}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {data.find((row) => row.id === selectedRows[0])?.role}
                  </div>
                </div>
              </div>
            )}
            {/* Multiple users selection with scrollable list */}
            {selectedRows.length > 1 && (
              <div
                className={`rounded-lg bg-gray-50 p-4 mb-6 ${
                  selectedRows.length > 2
                    ? "max-h-32 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400"
                    : ""
                }`}
              >
                {selectedRows.map((userId) => {
                  const user = data.find((row) => row.id === userId);
                  return (
                    <div
                      key={userId}
                      className="flex justify-between items-center border-b border-gray-200 last:border-0 py-1.5"
                    >
                      <div className="flex flex-col items-start">
                        <p className="font-medium">{user?.first_name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div className="text-sm font-medium text-right ">
                        {user?.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#2264AC]"> Note</p>
                </div>
              </div>
              <div>
                <p className="text-left text-sm text-[#2264AC]">
                  Restoring this user will return their access and visibility
                  across the platform. Any roles, assignments, or linked
                  sessions will become active and reappear in relevant views.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between px-6 py-3 w-full">
        <div className="flex items-center space-x-2 w-2/3">
          <input
            className="border rounded-lg px-3 py-2 w-1/3 text-sm"
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
              className={`px-4 py-1 rounded ${
                selectionMode ? "bg-gray-100 hover:bg-gray-200" : ""
              }`}
            >
              Close
            </button>
          )}

          {/* {selectionMode && showDeleteButton && (
            <button
              onClick={handleDelete}
              className="px-4 py-1 rounded bg-red-50 text-red-500 flex items-center space-x-1 hover:bg-red-100"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )} */}

          {/* {selectionMode && showArchiveButton && (
            <button
              onClick={() =>
                showArchived
                  ? setShowRestoreModal(true)
                  : setShowArchiveModal(true)
              }
              className="px-4 py-1 rounded bg-red-50 text-red-500 flex items-center space-x-1 hover:bg-red-100"
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
          )} */}

          {!selectionMode && editingRowId && (
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1 rounded bg-emerald-700 text-white flex items-center space-x-1 hover:bg-green-700"
            >
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSelectionModeArchive}
            className="p-2 text-gray-500"
          >
            <span className="sr-only">Archive</span>
            <Archive size={20} />
          </button>

          {/* <button
            onClick={toggleSelectionModeDelete}
            className="p-2 text-gray-500"
          >
            <span className="sr-only">Delete</span>
            <Trash2 size={20} />
          </button> */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(onCreate)}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            + Add
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-2 ">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Active</span>
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
                showArchived ? "bg-emerald-600" : "bg-emerald-600" //'bg-gray-200'
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
            <span>Archived</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: staticbg }} className="text-white">
                {/* {selectionMode && ( */}
                <th className="px-4 py-3 w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 bg"
                    />
                  </div>
                </th>
                {/* )} */}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left whitespace-nowrap font-medium border-l border-gray-200"
                  >
                    <div
                      className={`flex items-center space-x-1 ${
                        column.sortable ? "cursor-pointer" : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.icon && <span>{column.icon}</span>}
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
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
                ))}
                <th
                  className="px-6 py-3 text-center sticky right-0 z-20 border-l border-gray-200"
                  style={{ backgroundColor: staticbg }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectionMode ? 2 : 1)}
                    className="px-6 py-4 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectionMode ? 2 : 1)}
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
                    >
                      {/* {selectionMode && ( */}
                      <td className="px-4 py-4 w-10 border-l border-gray-200">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(rowId)}
                            onChange={() => handleSelectRow(rowId)}
                            className="h-4 w-4"
                          />
                        </div>
                      </td>
                      {/* )} */}

                      {columns.map((column) => (
                        <td
                          key={`${rowId || index}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap border-l border-[#D4D4D4]"
                        >
                          {isEditing && column.editable ? (
                            column.options ? (
                              <div className="relative">
                                <select
                                  value={editingData[column.key]}
                                  onChange={(e) =>
                                    handleEditChange(column.key, e.target.value)
                                  }
                                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {column.options.map((option, i) => (
                                    <option
                                      key={i}
                                      value={option.value || option}
                                    >
                                      {option.label || option}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={editingData[column.key]}
                                onChange={(e) =>
                                  handleEditChange(column.key, e.target.value)
                                }
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            )
                          ) : column.renderCell ? (
                            column.renderCell(row)
                          ) : (
                            row[column.key]
                          )}
                        </td>
                      ))}

                      <td
                        className="px-6 py-4 text-center sticky right-0 z-10 border-l border-gray-200"
                        style={{
                          backgroundColor:
                            index % 2 === 1 ? dynamicbg : "#ffffff",
                        }}
                      >
                        <button
                          onClick={() => handleStartEdit(row)}
                          className="text-green-500 hover:text-green-700"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t">
        <div>
          {totalCount > 0 && (
            <p className="text-sm text-gray-500">
              {startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalCount)}{" "}
              of {totalCount}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="text-sm border rounded px-2 py-1"
            disabled={loading}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`p-1 rounded ${
                currentPage === 1 || loading
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-500">
              {currentPage}/{totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || totalPages === 0 || loading
              }
              className={`p-1 rounded ${
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
  );
}
