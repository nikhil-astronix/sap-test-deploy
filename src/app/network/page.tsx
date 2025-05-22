"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Info,
  Bank,
  Building,
  User,
  PencilSimpleLine,
  CaretCircleDown,
  CaretCircleUp,
  City,
  XCircle,
} from "@phosphor-icons/react";

import {
  Trash2,
  Archive,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  archiveNetwork,
  deleteNetwork,
  editNetwork,
  getNetwork,
  restoreNetwork,
} from "@/services/networkService";

import NetworkHeader from "@/components/network/NetworkHeader";

import { AxiosError } from "axios";

export default function NetworksPage() {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // Now tracks only networkId
  const [search, setSearch] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [editData, setEditData] = useState<{ name: string }>({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<{
    networks: Set<string>;
    districts: Set<string>;
  }>({
    networks: new Set<string>(),
    districts: new Set<string>(),
  });
  const [selectAll, setSelectAll] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const [activeNetworks, setActiveNetworks] = useState<any[]>([]);
  const [archivedNetworks, setArchivedNetworks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const networks = active ? archivedNetworks : activeNetworks;
  const paginatedNetworks = networks;

  const startIndex = (currentPage - 1) * rowsPerPage;

  const handleExpand = (networkId: string) => {
    setExpanded(expanded === networkId ? null : networkId);
    setEditing(null);
  };

  const handleEdit = (networkId: string) => {
    const network = networks.find((n) => n.id === networkId);
    if (network) {
      setEditing(networkId);
      setEditData({ name: network.name });
    }
  };

  const handleEditChange = (value: string) => {
    setEditData({ name: value });
  };

  // Handle save action
  const handleSave = async (updatedRow: any) => {
    try {
      let data = {
        name: editData.name,
        state: updatedRow.state,
      };
      const response = await editNetwork(updatedRow.id, data);

      if (response.success) {
        setEditing(null);
        fetchData(currentPage, rowsPerPage, null, null, active, search);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      let errorMessage = "Failed to edit network. Please try again.";
      if (
        axiosError?.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
      ) {
        errorMessage =
          (axiosError.response.data as { message?: string }).message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseEdit = () => {
    setEditing(null);
  };

  const handleSelectRow = (
    networkId: string,
    districtId: string | "all",
    event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event) {
      event.stopPropagation();
    }

    const newSelected = {
      networks: new Set(selectedRows.networks),
      districts: new Set(selectedRows.districts),
    };

    const network = networks.find((n) => n.id === networkId);
    if (!network) return;

    if (districtId === "all") {
      const shouldSelect = !selectedRows.networks.has(networkId);

      if (shouldSelect) {
        // Select network and all its districts
        newSelected.networks.add(networkId);
        network.districts.forEach((district: any) => {
          newSelected.districts.add(`${networkId}-${district.id}`);
        });
      } else {
        // Deselect network and all its districts
        newSelected.networks.delete(networkId);
        network.districts.forEach((district: any) => {
          newSelected.districts.delete(`${networkId}-${district.id}`);
        });
      }
    } else {
      const rowId = `${networkId}-${districtId}`;
      const shouldSelect = !selectedRows.districts.has(rowId);

      if (shouldSelect) {
        newSelected.districts.add(rowId);
        // Check if all districts are now selected
        const allDistrictsSelected = network.districts.every((district: any) =>
          newSelected.districts.has(`${networkId}-${district.id}`)
        );
        if (allDistrictsSelected) {
          newSelected.networks.add(networkId);
        }
      } else {
        newSelected.districts.delete(rowId);
        newSelected.networks.delete(networkId);
      }
    }

    setSelectedRows(newSelected);
    updateSelectAllState(newSelected);
  };

  const handleSelectAll = () => {
    const newSelected = {
      networks: new Set<string>(),
      districts: new Set<string>(),
    };

    if (!selectAll) {
      // Select all networks and their districts
      networks.forEach((network) => {
        newSelected.networks.add(network.id);
        network.districts.forEach((district: any) => {
          newSelected.districts.add(`${network.id}-${district.id}`);
        });
      });
    }

    setSelectedRows(newSelected);
    setSelectAll(!selectAll);
  };

  // Replace the current updateSelectAllState function with this:
  const updateSelectAllState = (selected: typeof selectedRows) => {
    // Count total networks and selected networks
    const totalNetworks = networks.length;
    const selectedNetworkCount = selected.networks.size;

    // Set selectAll to true only when all networks are selected
    setSelectAll(totalNetworks > 0 && selectedNetworkCount === totalNetworks);
  };

  const hasSelectedItems = () => {
    return selectedRows.networks.size > 0 || selectedRows.districts.size > 0;
  };

  const getSelectedItemsInfo = () => {
    const selectedNetworks = Array.from(selectedRows.networks);
    const selectedDistricts = Array.from(selectedRows.districts);
    const items: { text: string; type: "Network" | "District" }[] = [];

    selectedNetworks.forEach((networkId) => {
      const network = networks.find((n) => n.id === networkId);
      if (network) {
        items.push({
          text: `${network.name}`,
          type: "Network",
        });
      }
    });

    selectedDistricts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");
      const network = networks.find((n) => n.id === networkId);
      const district = network?.districts.find((d: any) => d.id === distId);
      if (district && !selectedRows.networks.has(networkId)) {
        items.push({
          text: `${district.district} - ${district.state}, ${district.city}`,
          type: "District",
        });
      }
    });

    return items;
  };

  const handleRestore = async () => {
    const newActiveNetworks = [...activeNetworks];
    const newArchivedNetworks = [...archivedNetworks];
    const selectedNetworkIds = Array.from(selectedRows.networks);
    const selectedDistrictIds = Array.from(selectedRows.districts).filter(
      (id) => {
        const [networkId] = id.split("-");
        return !selectedRows.networks.has(networkId); // only keep if network not selected
      }
    );

    // Prepare final ID list to send to backend
    const idsToArchive = [
      ...selectedNetworkIds,
      ...selectedDistrictIds.map((id) => id.split("-")[1]), // extract districtId only
    ];

    // Call the API

    const response = await restoreNetwork({ ids: idsToArchive });
    console.log("archived network respose-----", response);
    if (response.success) {
      fetchData(currentPage, rowsPerPage, null, null, active, search);
    }

    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowRestoreModal(false);
  };

  const handleArchive = async () => {
    const selectedNetworkIds = Array.from(selectedRows.networks);
    const selectedDistrictIds = Array.from(selectedRows.districts).filter(
      (id) => {
        const [networkId] = id.split("-");
        return !selectedRows.networks.has(networkId); // only keep if network not selected
      }
    );

    // Prepare final ID list to send to backend
    const idsToArchive = [
      ...selectedNetworkIds,
      ...selectedDistrictIds.map((id) => id.split("-")[1]), // extract districtId only
    ];

    // Call the API

    const response = await archiveNetwork({ ids: idsToArchive });
    console.log("archived network respose-----", response);
    if (response.success) {
      fetchData(currentPage, rowsPerPage, null, null, active, search);
    }

    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowArchiveModal(false);
  };

  const handleDelete = async () => {
    const selectedNetworkIds = Array.from(selectedRows.networks);
    const selectedDistrictIds = Array.from(selectedRows.districts).filter(
      (id) => {
        const [networkId] = id.split("-");
        return !selectedRows.networks.has(networkId); // only keep if network not selected
      }
    );

    // Prepare final ID list to send to backend
    const idsToArchive = [
      ...selectedNetworkIds,
      ...selectedDistrictIds.map((id) => id.split("-")[1]), // extract districtId only
    ];

    // Call the API

    const response = await deleteNetwork({ ids: idsToArchive });

    if (response.success) {
      fetchData(currentPage, rowsPerPage, null, null, active, search);
    }

    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowDeleteModal(false);
  };

  // Improved error handling in fetchData
  const fetchData = async (
    page: number,
    limit: number,
    sortBy: string | null,
    sortOrder: "asc" | "desc" | null,
    isArchived: boolean = false,
    search: string | null
  ) => {
    setLoading(true);
    try {
      const requestPayload = {
        is_archived: isArchived,
        sort_by: null,
        sort_order: null,
        curr_page: page,
        per_page: limit,
        search: search, // Don't send empty strings
      };

      const response = await getNetwork(requestPayload);
      console.log("response------", response);
      if (response.success && response.data) {
        // Transform API data with safe access patterns
        const transformedNetworks = (response.data.networks || []).map(
          (network: any, index: any) => ({
            id: network.id || `api-${index}`,
            name: network.name || "",
            districts: Array.isArray(network.districts)
              ? network.districts.map((district: any, dIndex: string) => ({
                  id: district.id || `district-${dIndex}`,
                  district: district.name || "",
                  state: district.state || network.state || "",
                  city: district.city || "",
                  created:
                    district.created_by_first_name +
                      " " +
                      district.created_by_last_name || "",
                }))
              : [],
          })
        );

        // Update with proper state management
        if (isArchived) {
          setArchivedNetworks(transformedNetworks);
        } else {
          setActiveNetworks(transformedNetworks);
        }

        // Update pagination with null checks
        setTotalCount(response.data.total_networks || 0);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.curr_page || 1);
      } else {
        console.error("API returned unsuccessful response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, null, null, active, search);
  }, [currentPage, rowsPerPage, search, active]);

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
    fetchData(1, limit, null, null, active, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, rowsPerPage, null, null, active, search);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-full bg-white rounded-lg shadow-md">
      {/* Archive Confirmation Modal */}

      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-[16px] text-black-400">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4">
              {getSelectedItemsInfo().length === 0
                ? "Please select districts to archive."
                : `Are you sure you want to archive ${
                    getSelectedItemsInfo().length === 1
                      ? "this District?"
                      : "these Districts?"
                  }`}
            </p>

            {/* Selected Districts Display */}
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
                      <p className="text-[12px] text-black-400">{item.text}</p>
                    </div>
                    <div className="text-[12px] text-gray-500 text-right">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mt-[10px]">
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
                <div className="ml-3">
                  <p className="text-sm text-[#C23E19]"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19] mt-2">
                {getSelectedItemsInfo().length === 0
                  ? "No districts selected. Please select at least one district to archive."
                  : `Archiving ${
                      getSelectedItemsInfo().length === 1
                        ? "this district"
                        : "these districts"
                    } will remove ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } from active views. Associated data will remain stored and become visible again if ${
                      getSelectedItemsInfo().length === 1
                        ? "the district"
                        : "the districts"
                    } is restored. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                } text-white rounded-lg transition-colors`}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="text-blue-600" size={24} />
              <h2 className="text-[20px] font-semibold text-black-400">
                Restore
              </h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4">
              {getSelectedItemsInfo().length === 0
                ? "Please select districts to restore."
                : `Are you sure you want to restore ${
                    getSelectedItemsInfo().length === 1
                      ? "this District?"
                      : "these Districts?"
                  }`}
            </p>

            {/* Selected Districts Display */}
            {getSelectedItemsInfo().length > 0 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-4 mb-6 ${
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
                      <p className="text-[12px] text-black-400">{item.text}</p>
                    </div>
                    <div className="text-[12px] text-gray-500 text-right">
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
                  <Info size={16} color="#2264AC" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">Note</p>
                </div>
              </div>
              <p className="text-left text-sm mt-2">
                {getSelectedItemsInfo().length === 0
                  ? "No districts selected. Please select at least one district to restore."
                  : `Restoring ${
                      getSelectedItemsInfo().length === 1
                        ? "this district"
                        : "these districts"
                    } will make ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } active again. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                } text-white rounded-lg transition-colors`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="text-gray-700" size={24} />
              <h2 className="text-[16px] font-normal text-black-400">Delete</h2>
            </div>

            {/* Prompt */}
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete this District?
            </p>

            {/* District Info Card */}
            {getSelectedItemsInfo().length > 0 && (
              <div
                className={`rounded-lg bg-[#F4F6F8] p-4 mb-4 ${
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
                      <p className="text-[12px] text-black-400">{item.text}</p>
                    </div>
                    <div className="text-[12px] text-gray-500 text-right">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-6">
              <div className="flex items-start gap-2">
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
              </div>
              <p className="text-sm text-[#C23E19] py-2">
                Deleting this district will remove it from the existing
                networks. Please confirm before proceeding.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#B4351C] text-white rounded-lg hover:bg-[#943015] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <NetworkHeader
        title="Networks"
        description="Manage your network organization and district assignments."
        search={search ?? ""}
        setSearch={setSearch}
        active={active}
        setActive={setActive}
        hasSelectedItems={hasSelectedItems}
        setShowArchiveModal={setShowArchiveModal}
        setShowRestoreModal={setShowRestoreModal}
        setShowDeleteModal={setShowDeleteModal}
        isEditing={false}
        onSave={handleSave}
        onClose={handleCloseEdit}
        isActiveArchived={false}
      />

      <div className=" rounded-lg border border-gray-300 shadow-sm bg-white">
        <table className="w-full border-collapse text-sm rounded-lg">
          <thead>
            <tr className="bg-[#2264AC] text-white border-b border-gray-300 ">
              <th className="w-[0.1%] px-4 py-3 text-left border-gray-300 rounded-tl-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 appearance-none text-[#2264AC] border border-white rounded-sm checked:bg-[color:var(--accent)] checked:border-white checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center"
                  />
                </div>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center gap-2">
                  <City size={16} />
                  District
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Bank size={16} />
                  State
                </span>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Building size={16} />
                  City
                </span>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  Created By
                </span>
              </th>
              <th className="w-[5%] px-4 py-3 rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedNetworks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No networks found
                </td>
              </tr>
            ) : (
              paginatedNetworks.map((network) => (
                <React.Fragment key={network.id}>
                  <tr
                    className="bg-[#F3F8FF] hover:bg-[#E5F0FF] cursor-pointer border-y border-gray-300"
                    onClick={(e) => {
                      handleSelectRow(network.id, "all", e);
                    }}
                  >
                    <td
                      className="px-4 py-3 border-gray-200 bg-[#F8FAFC]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.networks.has(network.id)}
                          onChange={(e) =>
                            handleSelectRow(network.id, "all", e)
                          }
                          className="w-4 h-4 rounded-md border-2 border-white text-[#2264AC] cursor-pointer"
                        />
                      </div>
                    </td>
                    <td
                      colSpan={5}
                      className="px-4 py-3 border-b border-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpand(network.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {editing === network.id ? (
                          <input
                            className="font-semibold text-sm py-1 px-0 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:ring-0 w-full max-w-[250px]"
                            value={editData.name}
                            onChange={(e) => handleEditChange(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-sm">
                            {network.name}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          {!editing && (
                            <button
                              className="text-emerald-700 mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(network.id);
                              }}
                            >
                              <PencilSimpleLine size={16} color="#2264AC" />
                            </button>
                          )}
                          {editing === network.id ? (
                            <>
                              <button
                                className="text-emerald-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSave(network);
                                }}
                              >
                                <Check size={18} />
                              </button>
                              <button
                                className="text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditing(null);
                                }}
                              >
                                <XCircle color="#2264AC" size={18} />
                              </button>
                            </>
                          ) : expanded === network.id ? (
                            <CaretCircleUp
                              className="text-gray-600"
                              size={16}
                            />
                          ) : (
                            <CaretCircleDown
                              className="text-gray-600"
                              size={16}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expanded === network.id &&
                    (network.districts && network.districts.length > 0 ? (
                      network.districts.map((district: any) => (
                        <tr
                          key={`${network.id}-${district.id}`}
                          className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                          onClick={(e) =>
                            handleSelectRow(network.id, district.id, e)
                          }
                        >
                          <td
                            className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRows.districts.has(
                                  `${network.id}-${district.id}`
                                )}
                                onChange={(e) =>
                                  handleSelectRow(network.id, district.id, e)
                                }
                                className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] bg-white cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {district.district}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {district.state}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {district.city}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {district.created}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* District actions removed */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500 italic border-b border-gray-200"
                        >
                          No districts available in this network
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">
              {networks.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    totalCount
                  )} of ${totalCount}`
                : "0 results"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
                className="text-sm border rounded px-2 py-1"
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
              <span className="text-sm text-gray-500">
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
