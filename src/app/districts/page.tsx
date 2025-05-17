"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  City,
  Bank,
  Building,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import { Archive, RotateCcw, User, X } from "lucide-react";

interface District {
  id: string;
  name: string;
  state: string;
  city: string;
  network: string;
  enrollmentRange: string;
}

const DistrictsPage = () => {
  const router = useRouter();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [active, setActive] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Active districts
  const [activeDistricts, setActiveDistricts] = useState<District[]>([
    {
      id: "1",
      name: "Blue Ridge Charter Collaborative",
      state: "New York",
      city: "Los Angeles",
      network: "Northern Collaborative",
      enrollmentRange: "Greater than 400,000",
    },
    {
      id: "2",
      name: "Cedar Grove Charter Network",
      state: "California",
      city: "Birmingham",
      network: "Western Alliance",
      enrollmentRange: "Greater than 400,000",
    },
    {
      id: "3",
      name: "Metro Charter Network",
      state: "Illinois",
      city: "Bridgeport",
      network: "Midwestern Union",
      enrollmentRange: "200,000 - 400,000",
    },
    {
      id: "4",
      name: "Oakwood Public Schools",
      state: "Texas",
      city: "Austin",
      network: "Southern Collective",
      enrollmentRange: "100,000 - 200,000",
    },
    {
      id: "5",
      name: "Riverside Unified District",
      state: "Florida",
      city: "Miami",
      network: "East Coast Group",
      enrollmentRange: "200,000 - 400,000",
    },
    {
      id: "6",
      name: "Pinecrest School District",
      state: "Washington",
      city: "Seattle",
      network: "Pacific Network",
      enrollmentRange: "50,000 - 100,000",
    },
    {
      id: "7",
      name: "Mountainview Charter Schools",
      state: "Colorado",
      city: "Denver",
      network: "Mountain Alliance",
      enrollmentRange: "100,000 - 200,000",
    },
  ]);

  // Archived districts
  const [archivedDistricts, setArchivedDistricts] = useState<District[]>([
    {
      id: "8",
      name: "Lakeside Community Schools",
      state: "Michigan",
      city: "Detroit",
      network: "Great Lakes Network",
      enrollmentRange: "50,000 - 100,000",
    },
    {
      id: "9",
      name: "Valley View Educational District",
      state: "Arizona",
      city: "Phoenix",
      network: "Southwest Coalition",
      enrollmentRange: "25,000 - 50,000",
    },
  ]);

  // Get the appropriate district list based on active state
  const districts = !active ? activeDistricts : archivedDistricts;

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

  // Handler for archiving districts
  const handleArchive = () => {
    const newActiveDistricts = [...activeDistricts];
    const newArchivedDistricts = [...archivedDistricts];

    Array.from(selectedRows).forEach((districtId) => {
      const districtIndex = newActiveDistricts.findIndex(
        (d) => d.id === districtId
      );
      if (districtIndex !== -1) {
        const [district] = newActiveDistricts.splice(districtIndex, 1);
        newArchivedDistricts.push(district);
      }
    });

    setActiveDistricts(newActiveDistricts);
    setArchivedDistricts(newArchivedDistricts);
    setSelectedRows(new Set());
    setSelectAll(false);
    setShowArchiveModal(false);
  };

  // Handler for restoring districts
  const handleRestore = () => {
    const newActiveDistricts = [...activeDistricts];
    const newArchivedDistricts = [...archivedDistricts];

    Array.from(selectedRows).forEach((districtId) => {
      const districtIndex = newArchivedDistricts.findIndex(
        (d) => d.id === districtId
      );
      if (districtIndex !== -1) {
        const [district] = newArchivedDistricts.splice(districtIndex, 1);
        newActiveDistricts.push(district);
      }
    });

    setActiveDistricts(newActiveDistricts);
    setArchivedDistricts(newArchivedDistricts);
    setSelectedRows(new Set());
    setSelectAll(false);
    setShowRestoreModal(false);
  };

  return (
    <>
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-gray-800 mb-4">
              Are you sure you want to archive the selected district(s)?
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
                  Archived districts will be moved to the archive section. You
                  can restore them later if needed.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
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
              Are you sure you want to restore the selected district(s)?
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
                  Restoring these districts will make them active again. Please
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

      <div className="container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md">
        <h1 className="text-2xl text-center mb-2">Districts</h1>
        <p className="text-center text-gray-600 mb-6">
          View and manage all districts in the system.
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="relative w-[35%]">
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
                <RotateCcw size={20} className="text-black" />
              </button>
            )}
            {/* <button
            className={`p-2 ${selectedRows.size > 0 ? "text-gray-500 hover:text-gray-700" : "text-gray-300 cursor-not-allowed"}`}
            disabled={selectedRows.size === 0}
            title={selectedRows.size > 0 ? "Delete selected" : "Select items to delete"}
          >
            <Trash2 size={20} className="text-black" />
          </button> */}
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

        <div className="rounded-lg border border-gray-300 shadow-sm bg-white">
          <table className="w-full border-collapse text-sm rounded-lg">
            <thead>
              <tr className="bg-[#2264AC] text-white border-b border-gray-300">
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
                    Created by
                  </span>
                </th>
                <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                  Enrollment Range
                </th>
                <th className="w-[5%] px-4 py-3 rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                    </div>
                  </td>
                </tr>
              ) : districts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No districts found
                  </td>
                </tr>
              ) : (
                districts.map((district) => (
                  <tr
                    key={district.id}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => handleSelectRow(district.id, e)}
                  >
                    <td className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(district.id)}
                          onChange={(e) => handleSelectRow(district.id, e)}
                          className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] bg-white cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200">
                      {district.name}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200">
                      {district.state}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200">
                      {district.city}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200">
                      {district.network}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200">
                      {district.enrollmentRange}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-emerald-700">
                        <PencilSimpleLine size={16} color="#2264AC" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">
                {districts.length > 0
                  ? `1-${Math.min(rowsPerPage, districts.length)} of ${
                      districts.length
                    }`
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
                >
                  {[5, 10, 25, 50, 100].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DistrictsPage;
