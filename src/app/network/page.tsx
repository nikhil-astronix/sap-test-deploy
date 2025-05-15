"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";

import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Archive,
  Building,
  MapPin,
  Globe,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import { useRouter } from "next/navigation";

const mockActiveNetworks = [
  {
    id: "1",
    name: "network1",
    classrooms: [
      {
        id: "1",
        district: "New York city Department of Education",
        state: "New York",
        city: "Los Angeles",
        created: "jane Doe",
      },
      {
        id: "2",
        district: "los Angeles unified School District",
        state: "california",
        city: "Birmingham",
        created: "jane Doe",
      },
      {
        id: "3",
        district: "Chicago Public Schools",
        state: "lllinois",
        city: "Bridgeport",
        created: "jane Doe",
      },
    ],
  },
  {
    id: "2",
    name: "network2",
    classrooms: [
      {
        id: "1",
        district: "New York city Department of Education",
        state: "New York",
        city: "Los Angeles",
        created: "jane Doe",
      },
      {
        id: "2",
        district: "los Angeles unified School District",
        state: "california",
        city: "Birmingham",
        created: "jane Doe",
      },
      {
        id: "3",
        district: "Chicago Public Schools",
        state: "lllinois",
        city: "Bridgeport",
        created: "jane Doe",
      },
    ],
  },
  {
    id: "3",
    name: "network3",
    classrooms: [
      {
        id: "1",
        district: "New York city Department of Education",
        state: "New York",
        city: "Los Angeles",
        created: "jane Doe",
      },
      {
        id: "2",
        district: "los Angeles unified School District",
        state: "california",
        city: "Birmingham",
        created: "jane Doe",
      },
      {
        id: "3",
        district: "Chicago Public Schools",
        state: "lllinois",
        city: "Bridgeport",
        created: "jane Doe",
      },
    ],
  },
];

const mockArchivedNetworks = [
  {
    id: "4",
    name: "Archived Network 1",
    classrooms: [
      {
        id: "1",
        district: "Boston Public Schools",
        state: "Massachusetts",
        city: "Boston",
        created: "John Smith",
      },
      {
        id: "2",
        district: "Seattle Public Schools",
        state: "Washington",
        city: "Seattle",
        created: "John Smith",
      },
    ],
  },
  {
    id: "5",
    name: "Archived Network 2",
    classrooms: [
      {
        id: "1",
        district: "Miami-Dade County Public Schools",
        state: "Florida",
        city: "Miami",
        created: "Sarah Johnson",
      },
    ],
  },
];

const stateOptions = [
  { label: "New York", value: "New York" },
  { label: "California", value: "California" },
  { label: "Illinois", value: "Illinois" },
  { label: "Florida", value: "Florida" },
];
const cityOptions = [
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Birmingham", value: "Birmingham" },
  { label: "Bridgeport", value: "Bridgeport" },
];
const creatorOptions = [
  { label: "Jane Doe", value: "Jane Doe" },
  { label: "John Smith", value: "John Smith" },
  { label: "Sarah Johnson", value: "Sarah Johnson" },
];

export default function NetworksPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    networkId: string;
    districtId: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [editData, setEditData] = useState<any>(null);
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
  const rowsPerPage = 5;
  const router = useRouter();

  const networks = active ? mockArchivedNetworks : mockActiveNetworks;
  const paginatedNetworks = networks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(networks.length / rowsPerPage);

  // Helper function to check if all districts of a network are selected
  const areAllDistrictsSelected = (networkId: string, districts: any[]) => {
    return districts.every((district) =>
      selectedRows.districts.has(`${networkId}-${district.id}`)
    );
  };

  // Helper function to check if any district of a network is selected
  const isAnyDistrictSelected = (networkId: string, districts: any[]) => {
    return districts.some((district) =>
      selectedRows.districts.has(`${networkId}-${district.id}`)
    );
  };

  const handleExpand = (networkId: string) => {
    setExpanded(expanded === networkId ? null : networkId);
    setEditing(null);
  };

  const handleEdit = (networkId: string, district: any) => {
    setEditing({ networkId, districtId: district.id });
    setEditData({ ...district });
  };

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(null);
    // Save logic here
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
        network.classrooms.forEach((district) => {
          newSelected.districts.add(`${networkId}-${district.id}`);
        });
      } else {
        // Deselect network and all its districts
        newSelected.networks.delete(networkId);
        network.classrooms.forEach((district) => {
          newSelected.districts.delete(`${networkId}-${district.id}`);
        });
      }
    } else {
      const rowId = `${networkId}-${districtId}`;
      const shouldSelect = !selectedRows.districts.has(rowId);

      if (shouldSelect) {
        newSelected.districts.add(rowId);
        // Check if all districts are now selected
        const allDistrictsSelected = network.classrooms.every((district) =>
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
        network.classrooms.forEach((district) => {
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
      totalDistricts += network.classrooms.length;
      selectedDistricts += network.classrooms.filter((district) =>
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
      const district = network?.classrooms.find((d) => d.id === distId);
      if (district && !selectedRows.networks.has(networkId)) {
        items.push(
          `${district.district} - ${district.state}, ${district.city}`
        );
      }
    });

    return items;
  };

  const handleRestore = () => {
    // Move selected items to active networks
    const newActiveNetworks = [...mockActiveNetworks];
    const newArchivedNetworks = [...mockArchivedNetworks];
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
          classrooms: [],
        };
        newActiveNetworks.push(activeNetwork);
      }

      // Find all selected districts from this network
      const selectedDistrictsFromNetwork = Array.from(selectedRows.districts)
        .filter((id) => id.startsWith(networkId))
        .map((id) => id.split("-")[1]);

      // Move selected districts to active network
      selectedDistrictsFromNetwork.forEach((districtId) => {
        const districtIndex = archivedNetwork.classrooms.findIndex(
          (d) => d.id === districtId
        );
        if (districtIndex !== -1) {
          const [district] = archivedNetwork.classrooms.splice(
            districtIndex,
            1
          );
          activeNetwork.classrooms.push(district);
        }
      });

      // Remove archived network if it's empty
      if (archivedNetwork.classrooms.length === 0) {
        const index = newArchivedNetworks.findIndex((n) => n.id === networkId);
        if (index !== -1) {
          newArchivedNetworks.splice(index, 1);
        }
      }
    });

    // Update the mock data
    mockActiveNetworks.splice(
      0,
      mockActiveNetworks.length,
      ...newActiveNetworks
    );
    mockArchivedNetworks.splice(
      0,
      mockArchivedNetworks.length,
      ...newArchivedNetworks
    );

    // Clear selections and close modal
    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowRestoreModal(false);
  };

  const handleArchive = () => {
    // Move selected items to archived networks
    const newActiveNetworks = [...mockActiveNetworks];
    const newArchivedNetworks = [...mockArchivedNetworks];

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

    // Handle individual district archival
    selectedRows.districts.forEach((districtId) => {
      const [networkId, distId] = districtId.split("-");
      if (!selectedRows.networks.has(networkId)) {
        const activeNetwork = newActiveNetworks.find((n) => n.id === networkId);
        const archivedNetwork = newArchivedNetworks.find(
          (n) => n.id === networkId
        ) || {
          ...activeNetwork,
          classrooms: [],
          id: networkId,
          name: activeNetwork?.name || "",
        };

        if (activeNetwork) {
          const districtIndex = activeNetwork.classrooms.findIndex(
            (d) => d.id === distId
          );
          if (districtIndex !== -1) {
            const [district] = activeNetwork.classrooms.splice(
              districtIndex,
              1
            );

            // If archived network doesn't exist, add it
            if (!newArchivedNetworks.find((n) => n.id === networkId)) {
              newArchivedNetworks.push(archivedNetwork);
            }

            // Add district to archived network
            archivedNetwork.classrooms.push(district);
          }
        }
      }
    });

    // Update the mock data
    mockActiveNetworks.splice(
      0,
      mockActiveNetworks.length,
      ...newActiveNetworks
    );
    mockArchivedNetworks.splice(
      0,
      mockArchivedNetworks.length,
      ...newArchivedNetworks
    );

    // Clear selections and close modal
    setSelectedRows({ networks: new Set(), districts: new Set() });
    setShowArchiveModal(false);
  };

  const handleDelete = () => {
    // Implementation of delete functionality
    // Similar structure to handleArchive but removes items completely
    setShowDeleteModal(false);
    setSelectedRows({ networks: new Set(), districts: new Set() });
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md overflow-y-auto">
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
              className="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                <svg
                  className="h-7 w-7 text-red-400 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600">
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
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600">
                  Deleting this district will remove it from the existing
                  networks. Please confirm before proceeding.
                </p>
              </div>
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

      <h1 className="text-2xl font-bold text-center mb-2">Networks</h1>
      <p className="text-center text-gray-600 mb-6">
        Manage your network organization and district assignments.
      </p>

      {editing ? (
        <div className="flex items-center gap-4 mb-4">
          <button
            className="text-gray-700 text-sm font-medium"
            onClick={handleCloseEdit}
          >
            Close
          </button>
          <button
            className="bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      ) : (
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
                hasSelectedItems()
                  ? "Delete selected"
                  : "Select items to delete"
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
      )}

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

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#2264AC] text-white border-b border-gray-300">
              <th className="w-[5%] px-4 py-3 text-left border-r border-gray-300">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                  />
                </div>
              </th>
              <th className="w-[25%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center gap-2">
                  <Building size={16} />
                  District
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Globe size={16} />
                  State
                </span>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  City
                </span>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  Created By
                </span>
              </th>
              <th className="w-[5%] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedNetworks.map((network) => (
              <React.Fragment key={network.id}>
                <tr
                  className="bg-[#F3F8FF] hover:bg-[#E5F0FF] cursor-pointer border-y border-gray-300"
                  onClick={(e) => {
                    handleSelectRow(network.id, "all", e);
                  }}
                >
                  <td
                    className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.networks.has(network.id)}
                        onChange={(e) => handleSelectRow(network.id, "all", e)}
                        className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
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
                      <span className="font-semibold text-sm">
                        {network.name}
                      </span>
                      <span>
                        {expanded === network.id ? (
                          <ChevronUp className="text-gray-600" />
                        ) : (
                          <ChevronDown className="text-gray-600" />
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
                {expanded === network.id &&
                  network.classrooms.length > 0 &&
                  network.classrooms.map((district) => (
                    <tr
                      key={district.id}
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
                            className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                          />
                        </div>
                      </td>
                      {editing &&
                      editing.networkId === network.id &&
                      editing.districtId === district.id ? (
                        <>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.district}
                              onChange={(e) =>
                                handleEditChange("district", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <Dropdown
                              options={stateOptions}
                              value={editData.state}
                              onChange={(val) => handleEditChange("state", val)}
                              placeholder="Select state"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <Dropdown
                              options={cityOptions}
                              value={editData.city}
                              onChange={(val) => handleEditChange("city", val)}
                              placeholder="Select city"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <Dropdown
                              options={creatorOptions}
                              value={editData.created}
                              onChange={(val) =>
                                handleEditChange("created", val)
                              }
                              placeholder="Select creator"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* No edit icon in edit mode */}
                          </td>
                        </>
                      ) : (
                        <>
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
                            <button
                              className="text-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(network.id, district);
                              }}
                            >
                              <Edit2 size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white text-xs mt-2">
          <div>
            <span className="text-gray-600">
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, networks.length)} of{" "}
              {networks.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Rows per page:</span>
            <select
              className="border rounded px-2 py-1 text-xs"
              value={rowsPerPage}
              disabled
            >
              <option value={5}>5</option>
            </select>
            <button
              className="p-1 rounded disabled:text-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-600">
              {currentPage}/{totalPages}
            </span>
            <button
              className="p-1 rounded disabled:text-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
