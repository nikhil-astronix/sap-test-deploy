"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  City,
  Bank,
  Building,
  Network,
  Ruler,
  PencilSimpleLine,
  ClockClockwise,
  Info,
} from "@phosphor-icons/react";
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
  User,
} from "lucide-react";
import {
  archiveDistricts,
  districtPayload,
  fetchAllDistricts,
  getDistrictsPayload,
  unArchiveDistricts,
  updateDistrict,
} from "@/services/districtService";
import Image from "next/image";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { Column } from "@/components/ui/table";
import { Span } from "next/dist/trace";
import { getNetwork } from "@/services/networkService";
import { fetchNetworkRequestPayload } from "@/types/userData";

interface District {
  id: string;
  name: string;
  state: string;
  city: string;
  network_name: string;
  enrollment_range: string;
  [key: string]: any;
}

const DistrictsPage = () => {
  const router = useRouter();
  // Add these new state variables
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<District | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [archiveAction, setArchiveAction] = useState<boolean>(true);

  const [totalRecords, setTotalRecords] = useState(0);

  const [totalPages, setTotalPages] = useState<number>(0);

  const [districts, setDistricts] = useState<District[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "created_at", direction: "desc" });
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  //dropdown options
  const enrollmentRanges: { id: string; label: string }[] = [
    { id: "a9x1v", label: "Less than 100,000" },
    { id: "b7m3r", label: "100,000 - 200,000" },
    { id: "c2k6p", label: "200,000 - 400,000" },
    { id: "d5z9n", label: "Greater than 400,000" },
  ];

  const states: { id: string; label: string }[] = [
    { id: "a1f3g", label: "Alabama" },
    { id: "k2j4m", label: "Alaska" },
    { id: "b7z9p", label: "Arizona" },
    { id: "d8r3x", label: "Arkansas" },
    { id: "f2n8v", label: "California" },
    { id: "l6w3e", label: "Colorado" },
    { id: "q1z5k", label: "Connecticut" },
    { id: "h4c2a", label: "Delaware" },
    { id: "y9u7m", label: "Florida" },
    { id: "t3x8b", label: "Georgia" },
    { id: "m6v9s", label: "Hawaii" },
    { id: "n3d5f", label: "Idaho" },
    { id: "j7q1r", label: "Illinois" },
    { id: "o4l2t", label: "Indiana" },
    { id: "v5b6n", label: "Iowa" },
    { id: "u9a3m", label: "Kansas" },
    { id: "z3x4l", label: "Kentucky" },
    { id: "c7w8q", label: "Louisiana" },
    { id: "e2n5k", label: "Maine" },
    { id: "w1p6r", label: "Maryland" },
    { id: "r9d3c", label: "Massachusetts" },
    { id: "g7m2h", label: "Michigan" },
    { id: "s3f5n", label: "Minnesota" },
    { id: "i6t9v", label: "Mississippi" },
    { id: "b2z7x", label: "Missouri" },
    { id: "p4e1q", label: "Montana" },
    { id: "x9l3d", label: "Nebraska" },
    { id: "n7w6o", label: "Nevada" },
    { id: "q8t2a", label: "New Hampshire" },
    { id: "u1j4s", label: "New Jersey" },
    { id: "t9m5r", label: "New Mexico" },
    { id: "a8x3v", label: "New York" },
    { id: "c6e9z", label: "North Carolina" },
    { id: "f1p7m", label: "North Dakota" },
    { id: "d5k2x", label: "Ohio" },
    { id: "m3z9q", label: "Oklahoma" },
    { id: "g4v7s", label: "Oregon" },
    { id: "z1x3w", label: "Pennsylvania" },
    { id: "v6r8b", label: "Rhode Island" },
    { id: "j5t2n", label: "South Carolina" },
    { id: "y2u4a", label: "South Dakota" },
    { id: "l9c6e", label: "Tennessee" },
    { id: "h8d5o", label: "Texas" },
    { id: "r3f2s", label: "Utah" },
    { id: "e9k1x", label: "Vermont" },
    { id: "s8w4m", label: "Virginia" },
    { id: "n1z5v", label: "Washington" },
    { id: "o7p6q", label: "West Virginia" },
    { id: "t4x8l", label: "Wisconsin" },
    { id: "k3j9d", label: "Wyoming" },
  ];

  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    const payload: fetchNetworkRequestPayload = {
      is_archived: false,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null,
    };
    const response = await getNetwork(payload);
    console.log("response from network is ", response);
    if (response.success) {
      let result: any[] = [];
      response.data.networks.forEach((network: any) => {
        result.push({
          id: network.id,
          label: network.name,
          value: network.id,
        });
      });

      setNetworks(result);
    }
  };

  useEffect(() => {
    const payload: getDistrictsPayload = {
      is_archived: active,
      network_id: null,
      sort_by: sortConfig.key,
      sort_order: sortConfig.direction,
      page: 1,
      limit: rowsPerPage,
      search: search,
    };
    fetchAllDistrictsInfo(payload);
  }, [active, archiveAction, search]);

  const fetchAllDistrictsInfo = async (payload: getDistrictsPayload) => {
    const response = await fetchAllDistricts(payload);
    if (response.success) {
      let processedDistricts: District[] = [];
      response.data.districts.forEach((d: District) => {
        const stateObj = states.filter((s) => s.label === d.state);
        const enrollmentRange = enrollmentRanges.filter(
          (e) => e.label === d.enrollment_range
        );
        processedDistricts.push({
          ...d,
          id: d._id,
          state: stateObj.length ? stateObj[0].id : "",
          enrollment_range: enrollmentRange ? enrollmentRange[0].id : "",
        });
      });
      setDistricts(processedDistricts);
      setTotalRecords(response.data.total);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.pages);
    } else {
      setDistricts([]);
    }
  };

  const indexOfFirstRow = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastRow = Math.min(
    indexOfFirstRow + rowsPerPage - 1,
    totalRecords
  );

  // Get the appropriate district list based on active state
  // const districts = !active ? activeDistricts : archivedDistricts;

  const handleSelectRow = (
    districtId: string,
    event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event) {
      event.stopPropagation();
    }

    const newSelected = new Set(selectedRows);
    if (selectedRows.has(districtId)) {
      newSelected.delete(districtId);
    } else {
      newSelected.add(districtId);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === districts.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(districts.map((d) => d.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
    const payload: getDistrictsPayload = {
      is_archived: active,
      network_id: null,
      sort_by: sortConfig.key,
      sort_order: sortConfig.direction,
      page: 1,
      limit: limit,
      search: search,
    };
    fetchAllDistrictsInfo(payload);
  };

  // Function to get information about selected items for displaying in modals
  const getSelectedItemsInfo = () => {
    const items: string[] = [];

    Array.from(selectedRows).forEach((districtId) => {
      const district = districts.find((d) => d.id === districtId);
      if (district) {
        items.push(`${district.name} - ${district.state}, ${district.city}`);
      }
    });

    return items;
  };

  const columns: Column[] = [
    {
      key: "name",
      label: "District",
      sortable: true,
      icon: <City size={20} />,
      editable: true,
    },
    {
      key: "state",
      label: "State",
      sortable: true,
      icon: <Bank size={20} />,
      editable: true,
      options: states,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      icon: <Building size={20} />,
      editable: true,
      // options: ,
    },
    {
      key: "network",
      label: "Network",
      sortable: true,
      icon: <Network size={20} />,
      editable: true,
      options: networks,
    },
    {
      key: "enrollment_range",
      label: "Enrollment Range",
      sortable: true,
      icon: <Ruler size={20} />,
      editable: true,
      options: enrollmentRanges,
    },
  ];

  // Handler for archiving districts
  const handleArchive = async () => {
    console.log("selected rows are ", selectedRows);
    const payload = {
      ids: Array.from(selectedRows),
    };
    const response = await archiveDistricts(payload);
    if (response.success) {
      setSelectedRows(new Set());
      setSelectAll(false);
      setShowArchiveModal(false);
      setArchiveAction(!archiveAction);
    }
  };

  // Handler for restoring districts
  const handleRestore = async () => {
    const payload = {
      ids: Array.from(selectedRows),
    };
    const response = await unArchiveDistricts(payload);
    if (response.success) {
      setSelectedRows(new Set());
      setSelectAll(false);
      setShowRestoreModal(false);
      setArchiveAction(!archiveAction);
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
    setSelectedRows(new Set());
  };

  // Save edited row
  const handleSaveEdit = async () => {
    console.log("editingDataeditingData", editingData);
    if (editingData) {
      const selectedStateObj = states.filter((s) => s.id === editingData.state);
      const selectedEnrollmentRange = enrollmentRanges.filter(
        (e) => e.id === editingData.enrollment_range
      );

      const requestPayload: districtPayload = {
        name: editingData.name,
        network_id: editingData.network,
        state: selectedStateObj[0].label,
        city: editingData.city,
        enrollment_range: selectedEnrollmentRange[0].label,
        admins: [],
      };

      const response = await updateDistrict(requestPayload, editingData.id);
      if (response.success) {
        console.log("district updated successfully");
        setEditingRowId(null);
        setEditingData(null);
        setSelectedRows(new Set());
        const payload: getDistrictsPayload = {
          is_archived: active,
          network_id: null,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
          page: 1,
          limit: rowsPerPage,
          search: search,
        };
        fetchAllDistrictsInfo(payload);
      } else {
        console.log("something went wrong");
      }
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }

    setSortConfig({ key, direction });

    const payload: getDistrictsPayload = {
      is_archived: active,
      network_id: null,
      sort_by: key,
      sort_order: direction,
      page: 1,
      limit: rowsPerPage,
      search: search,
    };
    fetchAllDistrictsInfo(payload);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload: getDistrictsPayload = {
      is_archived: active,
      network_id: null,
      sort_by: sortConfig.key,
      sort_order: sortConfig.direction,
      page: pageNumber,
      limit: rowsPerPage,
      search: search,
    };
    fetchAllDistrictsInfo(payload);
  };

  const handleEditChange = (key: string, value: string) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        [key]: value,
      });
    }
  };

  const renderCell = (d: District, key: string) => {
    if (key === "state") {
      const statObj: { id: string; label: string }[] = states.filter(
        (s) => s.id === d[key]
      );
      return statObj.length ? statObj[0].label : "";
    }
    if (key === "enrollment_range") {
      const enrollmentRangeObj: { id: string; label: string }[] =
        enrollmentRanges.filter((e) => e.id === d[key]);
      return enrollmentRangeObj.length ? enrollmentRangeObj[0].label : "";
    }
    console.log("rendering cell for key: ", key, " with value: ", d[key]);
    return d[key];
  };

  return (
    <>
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-[16px] text-black-400">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4 ">
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
                className={`rounded-[6px] bg-[#F4F6F8] py-2 px-4 mb-4 shadow-md ${
                  getSelectedItemsInfo().length > 2
                    ? "max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {getSelectedItemsInfo().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-1.5 min-h-16"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-[12px] text-black-400">{item}</p>
                    </div>
                    <div className="text-[12px] text-right">District</div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Box */}
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
                <div className="ml-3">
                  <p className="text-sm text-[#C23E19]">Warning</p>
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
                    } from active views and disable associated access. Any users, tools, or sessions linked to  ${
                      getSelectedItemsInfo().length === 1 ? "this " : "these"
                    } district will be hidden until it is restored. Please confirm before proceeding.`}
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
                } text-white rounded-[6px] transition-colors`}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <ClockClockwise className="text-blue-600" size={24} />
              <h2 className="text-[20px] font-normal text-black-400">
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
                className={`rounded-[6px] shadow-md bg-[#F4F6F8] py-2 px-4 mb-4 ${
                  getSelectedItemsInfo().length > 2
                    ? "max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 shadow-md"
                    : ""
                }`}
              >
                {getSelectedItemsInfo().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b-2 border-gray-200 last:border-0 py-1.5 min-h-16"
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-[12px] text-black-400">{item}</p>
                    </div>
                    <div className="text-[12px] text-right">District</div>
                  </div>
                ))}
              </div>
            )}

            {/* Note Box */}
            <div className="bg-blue-50 border-l-4 border-[#2264AC] p-4 mb-6 mt-[10px] text-[#2264AC]">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-[#2264AC]" />
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
                    } 
									   add its visibility and access across the platform. All users, tools, and sessions linked to  ${
                       getSelectedItemsInfo().length === 1 ? "this" : "these"
                     } district will become active and reappear in relevant views.`}
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
                } text-white rounded-[6px] transition-colors`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md */}
      <div className="container text-center mx-auto px-4 py-8 bg-white">
        <h1 className="text-2xl text-center mb-2">Districts</h1>
        <p className="text-center text-gray-600 mb-6">
          View and manage all districts in the system.
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 sm:w-2/3 w-full">
            {!editingRowId && (
              <div className="relative w-[50%]">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            {editingRowId && ( //selectionMode ||
              <button
                onClick={() => {
                  handleCancelEdit();
                }}
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

          <div className="flex items-center gap-2">
            {!active ? (
              <button
                className={`p-2 ${
                  selectedRows.size > 0
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={selectedRows.size === 0}
                onClick={() =>
                  selectedRows.size > 0 && setShowArchiveModal(true)
                }
                title={
                  selectedRows.size > 0
                    ? "Archive selected"
                    : "Select items to archive"
                }
              >
                <Archive size={20} className="text-black" />
              </button>
            ) : (
              <button
                className={`p-2 ${
                  selectedRows.size > 0
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={selectedRows.size === 0}
                onClick={() =>
                  selectedRows.size > 0 && setShowRestoreModal(true)
                }
                title={
                  selectedRows.size > 0
                    ? "Restore selected"
                    : "Select items to restore"
                }
              >
                <ClockClockwise size={20} className="text-black" />
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/districts/new")}
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-emerald-700`}
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

        <div className="rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr
                  style={{ backgroundColor: "#2264AC" }}
                  className="text-white"
                >
                  <th className="pl-6  py-3 w-8 min-w-[20px]">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === districts.length &&
                          districts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 appearance-none border border-white rounded-sm checked:bg-[color:var(--accent)] checked:border-white checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center"
                        style={{ accentColor: "#6C4996" }}
                      />
                    </div>
                  </th>
                  {/* )} */}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200"
                    >
                      <div
                        className={`flex items-center justify-between w-full text-[12px] font-normal text-[#F9F5FF] ${
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
                  ))}
                  <th
                    className="w-[100px] min-w-[100px] text-center text-[12px] font-normal text-[#F9F5FF] sticky right-0 z-20 border-l-2 border-gray-200 px-2 py-3"
                    style={{
                      backgroundColor: "#2264AC",
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
                      <span className="text-[12px]-400 text-white">Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {districts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      className="px-6 py-4 text-center"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  districts.map((district, index) => {
                    const rowId = district.id;
                    const isEditing = editingRowId === rowId;
                    return (
                      <tr
                        key={district.id}
                        style={{
                          backgroundColor: index % 2 === 1 ? "#E9F3FF" : "#fff",
                        }}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        //onClick={(e) => handleSelectRow(district.id, e)}
                      >
                        <td className="pl-6  py-3 w-8 min-w-[20px]">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(district.id)}
                              onChange={(e) => handleSelectRow(district.id, e)}
                              className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] bg-white cursor-pointer "
                            />
                          </div>
                        </td>
                        {columns.map((column) => (
                          <td
                            key={`${rowId || index}-${column.key}`}
                            className="px-3 py-4 whitespace-nowrap border-r-2 border-[#D4D4D4] text-left bg-transparent"
                          >
                            {isEditing && column.editable ? (
                              column.options ? (
                                <div className="relative text-left">
                                  {
                                    <CustomDropdown
                                      value={editingData[column.key]}
                                      options={column.options}
                                      onChange={(val: any) =>
                                        handleEditChange(column.key, val)
                                      }
                                    />
                                  }
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={editingData[column.key]}
                                  onChange={(e) =>
                                    handleEditChange(column.key, e.target.value)
                                  }
                                  className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-left"
                                />
                              )
                            ) : (
                              <div className="text-left">
                                {renderCell(district, column.key)}
                              </div>
                            )}
                          </td>
                        ))}
                        <td
                          className="w-[100px] min-w-[100px] text-center sticky right-0 border-l-2 border-gray-400 px-2 py-4"
                          style={{
                            backgroundColor: "#ffffff",
                            boxShadow: "inset 2px 0 0 #D4D4D4",
                          }}
                        >
                          <button
                            className="text-emerald-700"
                            onClick={() => handleStartEdit(district)}
                          >
                            <PencilSimpleLine size={16} color="#2264AC" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
            <div>
              {totalRecords > 0 && (
                <p className="text-sm text-gray-500">
                  {indexOfFirstRow}-
                  {Math.min(indexOfFirstRow + rowsPerPage - 1, totalRecords)} of{" "}
                  {totalRecords}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    handleRowsPerPageChange(Number(e.target.value));
                  }}
                  className="text-sm border rounded px-2 py-1"
                  disabled={loading}
                >
                  {[5, 10, 25, 50, 100].map((option) => (
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
    </>
  );
};

export default DistrictsPage;
