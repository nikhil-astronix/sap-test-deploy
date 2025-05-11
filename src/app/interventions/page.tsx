"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import InterventionCard from "../../components/intervention/InterventionCard";
import EditInterventionModal from "../../components/intervention/EditInterventionModal";
import ArchiveInterventionModal from "../../components/intervention/ArchiveInterventionModal";

interface Intervention {
  id: string;
  type: "Custom" | "Default";
  title: string;
  description: string;
  isArchived: boolean;
  createdAt: Date;
}

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
    useState<Intervention | null>(null);
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
  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: "1",
      type: "Custom",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner.",
      isArchived: false,
      createdAt: new Date("2024-03-15"),
    },
    {
      id: "2",
      type: "Default",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner.",
      isArchived: true,
      createdAt: new Date("2024-03-14"),
    },
    {
      id: "3",
      type: "Custom",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner.",
      isArchived: false,
      createdAt: new Date("2024-03-13"),
    },
    {
      id: "4",
      type: "Custom",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner. The coaching includes classroom observations, feedback sessions, goal-setting meetings, and collaborative planning time. This structured support helps improve instructional practices and student outcomes through ongoing professional development.",
      isArchived: false,
      createdAt: new Date("2024-03-12"),
    },
    {
      id: "5",
      type: "Custom",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner.",
      isArchived: true,
      createdAt: new Date("2024-03-11"),
    },
    {
      id: "6",
      type: "Custom",
      title: "Coaching",
      description:
        "This teacher receives regular coaching from the school leadership team or an external partner.",
      isArchived: false,
      createdAt: new Date("2024-03-10"),
    },
  ]);

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
    setEditingIntervention(intervention);
  };

  const handleArchive = (intervention: Intervention) => {
    setArchivingIntervention(intervention);
  };

  const handleArchiveConfirm = () => {
    if (archivingIntervention) {
      // Toggle the archived state
      const updatedIntervention = {
        ...archivingIntervention,
        isArchived: !archivingIntervention.isArchived,
      };

      // Here you would typically make an API call to update the intervention
      console.log(
        "Toggling archive state for intervention:",
        updatedIntervention
      );

      // Update the interventions list with the new state
      setInterventions(
        interventions.map((i) =>
          i.id === archivingIntervention.id ? updatedIntervention : i
        )
      );

      setArchivingIntervention(null);
    }
  };

  const handleSave = (updatedIntervention: Omit<Intervention, "id">) => {
    // Here you would typically make an API call to update the intervention
    console.log("Saving intervention:", {
      ...updatedIntervention,
      id: editingIntervention?.id,
    });
    setEditingIntervention(null);
  };

  const handleFilterReset = () => {
    setFilterType("Both");
    setSortBy("newest");
    setSearchQuery("");
    setIsActive(false);
  };

  // Filter and sort the interventions
  const filteredInterventions = interventions
    .filter((intervention) => {
      const matchesSearch =
        intervention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intervention.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "Both" ? true : intervention.type === filterType;
      const matchesStatus = isActive === intervention.isArchived;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });

  // Calculate filter counts based on the current data and archive status
  const filterCounts = {
    Default: interventions.filter(
      (i) => i.type === "Default" && i.isArchived === isActive
    ).length,
    Custom: interventions.filter(
      (i) => i.type === "Custom" && i.isArchived === isActive
    ).length,
    Both: interventions.filter((i) => i.isArchived === isActive).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-8 w-full bg-white rounded-lg shadow-md h-full overflow-hidden"
    >
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-none mb-8 items-center justify-center"
        >
          <h1 className="text-2xl font-bold mb-2 text-center">
            Interventions & Professional Development
          </h1>
          <p className="text-gray-600 text-center">
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
              className="w-full px-4 py-2 border rounded-lg pr-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center pr-3">
              <div className="h-5 w-px bg-gray-300 mr-3"></div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1 rounded-lg ${
                  showFilters ? "bg-emerald-700 text-white" : ""
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
                <div className="flex gap-2 mb-6 text-sm">
                  {(["Default", "Custom", "Both"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg ${
                        filterType === type
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800 transition-colors mt-4"
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
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            + Add
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex-none flex items-center gap-2 mb-6"
        >
          <span>Active</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? "bg-emerald-600" : "bg-emerald-600" //'bg-gray-200'
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
          <span>Archived</span>
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2"
            >
              {filteredInterventions.map((intervention) => (
                <InterventionCard
                  key={intervention.id}
                  type={intervention.type}
                  title={intervention.title}
                  description={intervention.description}
                  isArchived={intervention.isArchived}
                  onEdit={() => handleEdit(intervention)}
                  onArchive={() => handleArchive(intervention)}
                />
              ))}
            </motion.div>
          </div>
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

      {archivingIntervention && (
        <ArchiveInterventionModal
          isOpen={true}
          onClose={() => setArchivingIntervention(null)}
          item={{
            type: archivingIntervention.type,
            title: archivingIntervention.title,
            itemType: "Intervention",
            isArchived: archivingIntervention.isArchived,
          }}
          onArchive={handleArchiveConfirm}
        />
      )}
    </motion.div>
  );
}
