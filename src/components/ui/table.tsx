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
  onDelete?: (selectedIds: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onSortChange?: (key: string, direction: "asc" | "desc" | null) => void;
  loading?: boolean;
  currentPage?: number;
  staticbg: string;
  dynamicbg: string;
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

  const currentPage =
    controlledCurrentPage !== undefined
      ? controlledCurrentPage
      : internalCurrentPage;

  const handleSort = (key: string) => {
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

    if (controlledCurrentPage === undefined) {
      setInternalCurrentPage(1);
    }

    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
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
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          {(selectionMode || editingRowId) && (
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

          {selectionMode && (
            <button
              onClick={handleDelete}
              className="px-4 py-1 rounded bg-red-50 text-red-500 flex items-center space-x-1 hover:bg-red-100"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}

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
          <button onClick={toggleSelectionMode} className="p-2 text-gray-500">
            <span className="sr-only">Delete</span>
            <Archive size={20} />
          </button>

          <button onClick={toggleSelectionMode} className="p-2 text-gray-500">
            <span className="sr-only">Delete</span>
            <Trash2 size={20} />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/curriculums/new")}
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
              onClick={() => setShowArchived(!showArchived)}
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
                {selectionMode && (
                  <th className="px-4 py-3 w-10">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === data.length && data.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4"
                      />
                    </div>
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left whitespace-nowrap font-medium"
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
                <th className="px-6 py-3 text-center">Action</th>
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
                      className={index % 2 === 0 ? dynamicbg : "bg-white"}
                    >
                      {selectionMode && (
                        <td className="px-4 py-4 w-10">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(rowId)}
                              onChange={() => handleSelectRow(rowId)}
                              className="h-4 w-4"
                            />
                          </div>
                        </td>
                      )}

                      {columns.map((column) => (
                        <td
                          key={`${rowId || index}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap"
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

                      <td className="px-6 py-4 text-center">
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
