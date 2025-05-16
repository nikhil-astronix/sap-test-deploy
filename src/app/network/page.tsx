"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  Bank,
  Building,
  User,
  PencilSimpleLine,
  CaretCircleDown,
  CaretCircleUp,
  City,
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
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to edit network. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  const updateSelectAllState = (selected: typeof selectedRows) => {
    let totalDistricts = 0;
    let selectedDistricts = 0;

    networks.forEach((network) => {
      totalDistricts += network.districts.length;
      selectedDistricts += network.districts.filter((district: any) =>
        selected.districts.has(`${network.id}-${district.id}`)
      ).length;
    });

    setSelectAll(totalDistricts > 0 && selectedDistricts === totalDistricts);
  };

  const hasSelectedItems = () => {
    return selectedRows.networks.size > 0 || selectedRows.districts.size > 0;
  };

  const getSelectedItemsInfo = () => {
    const selectedNetworks = Array.from(selectedRows.networks);
    const selectedDistricts = Array.from(selectedRows.districts);
    const items: string[] = [];

    selectedNetworks.forEach((networkId) => {
      const network = networks.find((n) => n.id === networkId);
      if (network) {
        items.push(`${network.name}`);
      }
    });

    selectedDistricts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");
      const network = networks.find((n) => n.id === networkId);
      const district = network?.districts.find((d: any) => d.id === distId);
      if (district && !selectedRows.networks.has(networkId)) {
        items.push(
          `${district.district} - ${district.state}, ${district.city}`
        );
      }
    });

    return items;
  };

  const handleRestore1 = () => {
    // Move selected items to active networks
    const newActiveNetworks = [...activeNetworks];
    const newArchivedNetworks = [...archivedNetworks];
    const processedNetworks = new Set<string>();

    // First, process any selected networks
    selectedRows.networks.forEach((networkId) => {
      const networkIndex = newArchivedNetworks.findIndex(
        (n) => n.id === networkId
      );
      if (networkIndex !== -1) {
        const [network] = newArchivedNetworks.splice(networkIndex, 1);
        newActiveNetworks.push(network);
        processedNetworks.add(networkId);
      }
    });

    // Then process selected districts and their parent networks if needed
    selectedRows.districts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");

      // Skip if we already processed this network
      if (processedNetworks.has(networkId)) return;

      const archivedNetwork = newArchivedNetworks.find(
        (n) => n.id === networkId
      );
      if (!archivedNetwork) return;

      // Find or create the active network
      let activeNetwork = newActiveNetworks.find((n) => n.id === networkId);
      if (!activeNetwork) {
        activeNetwork = {
          id: networkId,
          name: archivedNetwork.name,
          districts: [],
        };
        newActiveNetworks.push(activeNetwork);
      }

      // Find all selected districts from this network
      const selectedDistrictsFromNetwork = Array.from(selectedRows.districts)
        .filter((id) => id.startsWith(networkId))
        .map((id) => id.split("-")[1]);

      // Move selected districts to active network
      selectedDistrictsFromNetwork.forEach((districtId) => {
        const districtIndex = archivedNetwork.districts.findIndex(
          (d: any) => d.id === districtId
        );
        if (districtIndex !== -1) {
          const [district] = archivedNetwork.districts.splice(districtIndex, 1);
          activeNetwork.districts.push(district);
        }
      });

      // Remove archived network if it's empty
      if (archivedNetwork.districts.length === 0) {
        const index = newArchivedNetworks.findIndex((n) => n.id === networkId);
        if (index !== -1) {
          newArchivedNetworks.splice(index, 1);
        }
      }
    });

    // Update state with new arrays
    setActiveNetworks(newActiveNetworks);
    setArchivedNetworks(newArchivedNetworks);

    // Clear selections and close modal
    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowRestoreModal(false);

    // Call API to restore items
    // restoreNetworks(selectedItems);
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

  const handleArchive1 = () => {
    // Create copies of the current state
    const newActiveNetworks = [...activeNetworks];
    const newArchivedNetworks = [...archivedNetworks];

    // Handle full network archival
    selectedRows.networks.forEach((networkId) => {
      const networkIndex = newActiveNetworks.findIndex(
        (n) => n.id === networkId
      );
      if (networkIndex !== -1) {
        const [network] = newActiveNetworks.splice(networkIndex, 1);
        newArchivedNetworks.push(network);
      }
    });

    // Handle district archival
    selectedRows.districts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");
      if (selectedRows.networks.has(networkId)) return; // Skip if network is already archived

      const networkIndex = newActiveNetworks.findIndex(
        (n) => n.id === networkId
      );
      if (networkIndex !== -1) {
        const network = newActiveNetworks[networkIndex];
        const districtIndex = network.districts.findIndex(
          (d: any) => d.id === distId
        );

        if (districtIndex !== -1) {
          // Move district to archived network
          const [district] = network.districts.splice(districtIndex, 1);

          // Find or create the archived network
          let archivedNetwork = newArchivedNetworks.find(
            (n) => n.id === networkId
          );
          if (!archivedNetwork) {
            archivedNetwork = {
              id: networkId,
              name: network.name,
              districts: [],
            };
            newArchivedNetworks.push(archivedNetwork);
          }

          archivedNetwork.districts.push(district);

          // Remove empty networks
          if (network.districts.length === 0) {
            newActiveNetworks.splice(networkIndex, 1);
          }
        }
      }
    });

    // Update state with new arrays
    setActiveNetworks(newActiveNetworks);
    setArchivedNetworks(newArchivedNetworks);

    // Clear selections and close modal
    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowArchiveModal(false);

    // Call API to update archived status
    // updateNetworkStatus(selectedNetworks, selectedDistricts, true);
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

  // Implement the delete functionality
  const handleDelete1 = () => {
    // Implementation of delete functionality using state variables
    const newActiveNetworks = [...activeNetworks];
    const newArchivedNetworks = [...archivedNetworks];

    // Handle network deletions
    selectedRows.networks.forEach((networkId) => {
      if (active) {
        const index = newArchivedNetworks.findIndex((n) => n.id === networkId);
        if (index !== -1) {
          newArchivedNetworks.splice(index, 1);
        }
      } else {
        const index = newActiveNetworks.findIndex((n) => n.id === networkId);
        if (index !== -1) {
          newActiveNetworks.splice(index, 1);
        }
      }
    });

    // Handle individual district deletions
    selectedRows.districts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");
      if (selectedRows.networks.has(networkId)) return; // Skip if network is already deleted

      if (active) {
        const network = newArchivedNetworks.find((n) => n.id === networkId);
        if (network) {
          const index = network.districts.findIndex(
            (d: any) => d.id === distId
          );
          if (index !== -1) {
            network.districts.splice(index, 1);
            // Remove network if empty
            if (network.districts.length === 0) {
              const networkIndex = newArchivedNetworks.findIndex(
                (n) => n.id === networkId
              );
              if (networkIndex !== -1) {
                newArchivedNetworks.splice(networkIndex, 1);
              }
            }
          }
        }
      } else {
        const network = newActiveNetworks.find((n) => n.id === networkId);
        if (network) {
          const index = network.districts.findIndex(
            (d: any) => d.id === distId
          );
          if (index !== -1) {
            network.districts.splice(index, 1);
            // Remove network if empty
            if (network.districts.length === 0) {
              const networkIndex = newActiveNetworks.findIndex(
                (n) => n.id === networkId
              );
              if (networkIndex !== -1) {
                newActiveNetworks.splice(networkIndex, 1);
              }
            }
          }
        }
      }
    });

    // Update state with new arrays
    setActiveNetworks(newActiveNetworks);
    setArchivedNetworks(newArchivedNetworks);

    // Clear selections and close modal
    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowDeleteModal(false);

    // Call API to delete items
    // deleteNetworks(selectedItems);
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
    <div className="container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md">
      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-xl font-semibold">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">
              {`Are you sure you want to archive ${
                getSelectedItemsInfo()?.length === 1
                  ? "this District?"
                  : "these Districts?"
              }`}
            </p>

            {/* Selected Item(s) Box */}
            <div
              className="space-y-3 mb-4"
              style={{ maxHeight: "180px", overflowY: "auto" }} // ~2 boxes height
            >
              {getSelectedItemsInfo()?.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 shadow-md flex justify-between items-center text-sm text-gray-600 font-medium"
                >
                  <span>{item}</span>
                  <span className="text-gray-500">District</span>
                </div>
              ))}
            </div>

            {/* Warning Box */}
            <div
              className="bg-red-50 border-l-4 border-red-400 p-2 mb-6"
              aria-live="polite"
            >
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
                {`Archiving ${
                  getSelectedItemsInfo()?.length === 1
                    ? "this district"
                    : "these districts"
                } will remove ${
                  getSelectedItemsInfo()?.length === 1 ? "it" : "them"
                } from active views. Associated data will remain stored and become visible again if ${
                  getSelectedItemsInfo()?.length === 1
                    ? "the district"
                    : "the districts"
                } is restored. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-[#B4351C] text-white rounded-lg hover:bg-[#943015] transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Restore</h2>
            </div>

            {/* Description */}
            <p className="text-gray-800 mb-4">
              Are you sure you want to restore this District?
            </p>

            {/* Selected District Display */}
            <div className="bg-gray-50 border rounded-md p-4 mb-4 shadow-sm flex justify-between items-center text-sm font-medium text-gray-700">
              <span>
                {getSelectedItemsInfo().map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </span>
              <span className="text-gray-500">District</span>
            </div>

            {/* Note Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-blue-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 000 1v3a1 1 0 001 1h1a 1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-blue-600">
                  Restoring this district will make it active again. Please
                  confirm before proceeding.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
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
              <h2 className="text-xl font-semibold">Delete</h2>
            </div>

            {/* Prompt */}
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete this District?
            </p>

            {/* District Info Card */}
            <div className="bg-gray-50 border rounded-md p-4 mb-4 shadow-sm flex justify-between items-center text-sm font-medium text-gray-700">
              <span>
                {getSelectedItemsInfo().map((item, idx) => (
                  <div key={idx}>{item}</div>
                ))}
              </span>
              <span className="text-gray-500">District</span>
            </div>

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

      <h1 className="text-2xl  text-center mb-2">Networks</h1>
      <p className="text-center text-gray-600 mb-6">
        Manage your network organization and district assignments.
      </p>

      <div className="flex items-center justify-between mb-2">
        <div className="relative w-[35%] ">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          {!active ? (
            <button
              className={`p-2 ${
                hasSelectedItems()
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!hasSelectedItems()}
              onClick={() => hasSelectedItems() && setShowArchiveModal(true)}
              title={
                hasSelectedItems()
                  ? "Archive selected"
                  : "Select items to archive"
              }
            >
              <Archive size={20} className="text-black" />
            </button>
          ) : (
            <button
              className={`p-2 ${
                hasSelectedItems()
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!hasSelectedItems()}
              onClick={() => hasSelectedItems() && setShowRestoreModal(true)}
              title={
                hasSelectedItems()
                  ? "Restore selected"
                  : "Select items to restore"
              }
            >
              <RotateCcw size={20} className="text-black" />
            </button>
          )}
          <button
            className={`p-2 ${
              hasSelectedItems()
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={!hasSelectedItems()}
            onClick={() => hasSelectedItems() && setShowDeleteModal(true)}
            title={
              hasSelectedItems() ? "Delete selected" : "Select items to delete"
            }
          >
            <Trash2 size={20} className="text-black" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/network/new")}
            className="flex gap-2 items-center bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 mt-4">
        <div className="flex items-center space-x-2">
          <span
            className={`text-12px ${
              active ? "text-[#494B56]" : "text-[#000] font-medium"
            }`}
          >
            Active
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive((a) => !a)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-600`}
          >
            <motion.span
              layout
              initial={false}
              animate={{
                x: active ? 24 : 4,
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
              active ? "text-[#000] font-medium" : "text-[#494B56]"
            }`}
          >
            Archived
          </span>
        </div>
      </div>

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
                    className="w-4 h-4 rounded-md border-2 border-white text-[#2264AC] cursor-pointer"
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
                                <RotateCcw size={18} />
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
