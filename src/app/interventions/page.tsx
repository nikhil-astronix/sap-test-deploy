"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import InterventionCard from "../../components/intervention/InterventionCard";
import EditInterventionModal from "../../components/intervention/EditInterventionModal";
import ArchiveInterventionModal from "../../components/intervention/ArchiveInterventionModal";
import RestoreInterventionModal from "../../components/intervention/RestoreInterventionModal";
import {
  archiveIntervention,
  editInterventions,
  getInterventions,
  restoreIntervention,
} from "@/services/interventionService";
import { Intervention, InterventionType } from "@/types/interventionData";
import { Plus } from "@phosphor-icons/react";

type InterventionWithCreatedAt = Intervention & {
  createdAt: Date;
  title?: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function InterventionsPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingIntervention, setEditingIntervention] =
    useState<InterventionWithCreatedAt | null>(null);
  const [archivingIntervention, setArchivingIntervention] =
    useState<Intervention | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<"Default" | "Custom" | "Both">(
    "Both"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">(
    "newest"
  );
  const filterRef = useRef<HTMLDivElement>(null);

  // Initialize with mock data - replace with actual data fetching
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (intervention: Intervention) => {
    setEditingIntervention({
      ...intervention,
      createdAt: (intervention as any).createdAt || new Date(),
    });
  };

  const handleArchive = (intervention: Intervention) => {
    setArchivingIntervention(intervention);
  };

  const getData = async () => {
    const obj = {
      is_archived: isActive,
      filter: filterType,
      search: searchQuery,
      per_page: 100,
      sort_order: sortBy === "az" ? "asc" : sortBy === "za" ? "desc" : sortBy,
      sort_by:
        sortBy === "newest" || sortBy === "oldest" ? "cretedBy" : "title",
    };
    const response = await getInterventions(obj);

    setInterventions(response.data.interventions);
  };
  useEffect(() => {
    getData();
  }, [isActive, filterType, searchQuery, sortBy]);

  const handleArchiveConfirm = async () => {
    if (archivingIntervention) {
      // Toggle the archived state
      const updatedIntervention = {
        ...archivingIntervention,
        isArchived: !archivingIntervention.isArchived,
      };
      if (updatedIntervention.isArchived) {
        const response = await archiveIntervention(archivingIntervention.id);
      } else {
        const response = await restoreIntervention(archivingIntervention.id);
      }
      const obj = { is_archived: isActive, type: filterType };
      const response = await getInterventions(obj);
      setInterventions(response.data.interventions);
      setArchivingIntervention(null);
    }
  };

  const handleRestoreConfirm = async () => {
    if (archivingIntervention) {
      // Toggle the archived state
      const updatedIntervention = {
        ...archivingIntervention,
        isArchived: !archivingIntervention.isArchived,
      };
      // if (updatedIntervention.isArchived) {
      //   const response = await archiveIntervention(archivingIntervention.id);
      // } else {
      const response1 = await restoreIntervention(archivingIntervention.id);
      //}
      const obj = { is_archived: isActive, type: filterType };
      const response = await getInterventions(obj);
      setInterventions(response.data.interventions);
      setArchivingIntervention(null);
    }
  };

  const handleSave = async (updatedIntervention: Intervention) => {
    // Here you would typically make an API call to update the intervention
    const response = await editInterventions(updatedIntervention.id, {
      type: updatedIntervention.type,
      description: updatedIntervention.description,
      name: updatedIntervention.name,
      district_id: updatedIntervention.district_id,
    });
    // editInterventions;
    getData();
    setEditingIntervention(null);
  };

  const handleFilterReset = () => {
    setFilterType("Both");
    setSortBy("newest");
    setSearchQuery("");
    setIsActive(false);
  };

  // Filter and sort the interventions

  // Calculate filter counts based on the current data and archive status
  const filterCounts = {
    Default: 1,
    Custom: 1,
    Both: 1,
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8  bg-white rounded-lg shadow-md min-h-full"
    >
      <div className="flex flex-col min-h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-none mb-8 items-center justify-center"
        >
          <div className="text-[24px] mb-2 text-center text-black-400">
            Tags & Attributes
          </div>
          <p className="text-[#454F5B] text-center text-[16px]">
            Helping educators and students succeed together.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-none flex justify-between items-center mb-6"
        >
          <div className="relative w-96" ref={filterRef}>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-[6px] pr-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-r-[6px] h-10 flex items-center justify-center ${
                  showFilters
                    ? "bg-emerald-700 text-white"
                    : "border border-gray-300 bg-gray-100"
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold">Filter By</h3>
                  <button
                    onClick={handleFilterReset}
                    className="text-emerald-700 hover:text-emerald-800 text-sm"
                  >
                    Reset
                  </button>
                </div>

                {/* Filter Type Buttons */}
                <div className="flex  mb-6 text-sm w-full">
                  {(["Default", "Custom", "Both"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        filterType === type
                          ? "bg-emerald-700 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {type}({filterCounts[type]})
                    </button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2">Sort By</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { value: "newest", label: "Newest first" },
                      { value: "oldest", label: "Oldest first" },
                      { value: "az", label: "Alphabetical (A-Z)" },
                      { value: "za", label: "Alphabetical (Z-A)" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) =>
                              setSortBy(e.target.value as typeof sortBy)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              sortBy === option.value
                                ? "border-emerald-700"
                                : "border-gray-300"
                            }`}
                          >
                            {sortBy === option.value && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-emerald-700 text-white py-2 rounded-[6px] hover:bg-emerald-800 transition-colors mt-4"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/interventions/new")}
            className="flex gap-2 items-center bg-[#2A7251] text-white px-6 py-2 rounded-lg hover:bg-[#2A7251] transition-colors"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex-none flex items-center gap-2 mb-6"
        >
          <span
            className={`text-12px ${
              isActive ? "text-[#494B56]" : "text-[#000] font-medium"
            }`}
          >
            Active
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsActive(!isActive);
              console.log("button clicked", isActive);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-[#2A7251]" : "bg-[#2A7251]" //'bg-gray-200'
            }`}
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
        </motion.div>

        <div className="flex-1 max-h-96 overflow-y-auto ">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2"
          >
            {interventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                type={intervention.type}
                title={intervention.name}
                description={intervention.description}
                isArchived={intervention.isArchived}
                viewMode={isActive ? "archived" : "active"} // Pass the current view mode
                onEdit={() => handleEdit(intervention)}
                onArchive={() => handleArchive(intervention)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {editingIntervention && (
        <EditInterventionModal
          isOpen={true}
          onClose={() => setEditingIntervention(null)}
          intervention={editingIntervention}
          onSave={handleSave}
        />
      )}

      {archivingIntervention && isActive ? (
        <RestoreInterventionModal
          isOpen={true}
          onClose={() => setArchivingIntervention(null)}
          item={{
            type: archivingIntervention.type,
            title: archivingIntervention.name,
            itemType: "Intervention",
            isArchived: archivingIntervention.isArchived,
          }}
          onRestore={handleRestoreConfirm}
        />
      ) : archivingIntervention ? (
        <ArchiveInterventionModal
          isOpen={true}
          onClose={() => setArchivingIntervention(null)}
          item={{
            type: archivingIntervention.type,
            title: archivingIntervention.name,
            itemType: "Intervention",
            isArchived: archivingIntervention.isArchived,
          }}
          onArchive={handleArchiveConfirm}
        />
      ) : null}
    </motion.div>
  );
}
