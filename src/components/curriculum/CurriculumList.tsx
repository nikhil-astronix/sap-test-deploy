"use client";

import { useState, useRef, useEffect } from "react";
import { Menu } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Curriculum,
  CurriculumnUpdatedConfigProps,
  fetchCurriculumsRequestPayload,
} from "@/models/curriculum";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  archiveCurriculumById,
  fetchAllCurriculums,
  unArchiveCurriculumById,
  updateCurriculumById,
} from "../../services/curriculumsService";
import CurriculumCard from "./CurriculumCard";
import Header from "../Header";
import { useDistrict } from "@/context/DistrictContext";
import { Plus } from "@phosphor-icons/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CurriculumList() {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { globalDistrict, setGlobalDistrict } = useDistrict();

  const [filterType, setFilterType] = useState<"Default" | "Custom" | "Both">(
    "Both"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">(
    "newest"
  );
  const filterRef = useRef<HTMLDivElement>(null);

  //  created seperate statevariable
  // if we use above directly in api calls , it will make api call immediatly but we need to call when we click on apply button
  const [finalFilterType, setfinalFilterType] = useState<
    "Default" | "Custom" | "Both"
  >("Both");
  const [finalSortBy, setfinalSortBy] = useState<
    "newest" | "oldest" | "az" | "za"
  >("newest");

  const router = useRouter();
  const [curriculums, setCurriculums] = useState([] as Curriculum[]);

  //feth curriculums list
  useEffect(() => {
    fetchCurriculums();
  }, [search, showArchived, showFilters, globalDistrict]);

  const fetchCurriculums = async () => {
    try {
      const districtId = localStorage.getItem("globalDistrict");
      const requesPayload: fetchCurriculumsRequestPayload = {
        is_archived: showArchived,
        type:
          finalFilterType === "Both"
            ? ["Default", "Custom"].join(",")
            : finalFilterType,
        sort_by: finalSortBy === "oldest" ? "title" : "created_at",
        sort_order:
          finalSortBy === "az"
            ? "asc"
            : finalSortBy === "za"
            ? "desc"
            : finalSortBy,
        //  finalSortBy === "newest" || finalSortBy === "az" ? "desc" : "asc",
        search: search,
        page: 1,
        limit: 100,
        district_id: districtId || null,
      };
      const data = await fetchAllCurriculums(requesPayload);
      if (data.success) {
        setCurriculums(data.data.curriculums);
      } else {
        setCurriculums([] as Curriculum[]);
      }
    } catch (error) {
      console.error("Failed to load curriculums:", error);
    }
  };

  const handleArchive = async (curriculumId: string, is_archived: boolean) => {
    is_archived ? callUnArchive(curriculumId) : callArchive(curriculumId);
  };

  const callArchive = async (curriculumId: string) => {
    try {
      const response = await archiveCurriculumById(curriculumId);
      if (response.success) {
        console.log("Curriculum archived successfully!", response.data);
        fetchCurriculums();
      } else {
        console.error("Failed to archive curriculum:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const callUnArchive = async (curriculumId: string) => {
    try {
      const response = await unArchiveCurriculumById(curriculumId);
      if (response.success) {
        console.log("Curriculum archived successfully!", response.data);
        fetchCurriculums();
      } else {
        console.error("Failed to archive curriculum:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleApplyFilters = () => {
    setfinalFilterType(filterType);
    setfinalSortBy(sortBy);
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    setSearch("");
    setShowArchived(false);
    setFilterType("Both");
    setSortBy("newest");
  };

  const handleEditCurriculum = async (
    id: string,
    curriculum: CurriculumnUpdatedConfigProps
  ) => {
    try {
      const response = await updateCurriculumById(id, curriculum);
      if (response.success) {
        console.log("Curriculum updated successfully!", response.data);
        //window.history.back();
        //router.push
        fetchCurriculums();
      } else {
        console.error("Failed to edit curriculum:", response.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="px-6 py-2 w-full flex flex-col h-full">
      <div className="flex-none space-y-5 mb-8">
        {/* <div>
          <h1 className="text-[24px] mb-2 text-center text-black font-medium">
            Instructional Materials
          </h1>
          <p className="text-[#454F5B] text-center text-[16px]">
            View and manage instructional materials in one place.
          </p>
        </div> */}
        <Header
          title="Instructional Materials"
          description="View and manage instructional materials in one place."
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex justify-between items-center"
        >
          <div className="relative w-96" ref={filterRef}>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Search"
              className="w-full h-10 px-4 py-2 border rounded-[6px] pr-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center ">
              <div className="h-10 w-px bg-gray-300"></div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-r-[6px] h-10 flex items-center justify-center ${
                  showFilters ? "bg-[#2A7251] text-white" : ""
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
                    className="text-[#2A7251] hover:text-emerald-800 text-sm"
                  >
                    Reset
                  </button>
                </div>

                {/* Filter Type Buttons */}

                <div className="flex mb-6 text-sm w-full">
                  {(["Default", "Custom", "Both"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFilterType(type as "Default" | "Custom" | "Both")
                      }
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        filterType === type
                          ? "bg-[#2A7251] text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {type}(
                      {
                        curriculums.filter((c) =>
                          type === "Both" ? true : c.type === type
                        ).length
                      }
                      )
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
                            className="sr-only"
                            checked={sortBy === option.value}
                            onChange={(e) =>
                              setSortBy(
                                e.target.value as
                                  | "newest"
                                  | "oldest"
                                  | "az"
                                  | "za"
                              )
                            }
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
                  onClick={() => handleApplyFilters()}
                  className="w-full bg-[#2A7251] text-white py-2 rounded-[6px] hover:bg-emerald-800 transition-colors mt-4"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/curriculums/new")}
            className="flex gap-2 items-center bg-[#2A7251] text-white px-6 py-2 rounded-[6px] hover:bg-[#2A7251] transition-colors"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </motion.div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-16px ${
                showArchived ? "text-[#494B56]" : "text-[#000] font-medium"
              }`}
            >
              Active
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowArchived(!showArchived)}
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
      </div>

      <div className="flex-1 ">
        <div className="max-h-96 overflow-y-auto ">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2"
          >
            {curriculums.length > 0 &&
              curriculums.map((curriculum) => (
                <motion.div key={curriculum.id} variants={item}>
                  <CurriculumCard
                    title={curriculum.title}
                    description={curriculum.description}
                    type={curriculum.type}
                    isArchived={curriculum.is_archived}
                    onEdit={(
                      updatedCurriculumConfig: CurriculumnUpdatedConfigProps
                    ) => {
                      handleEditCurriculum(
                        curriculum.id,
                        updatedCurriculumConfig
                      );
                    }}
                    onArchive={() =>
                      handleArchive(curriculum.id, curriculum.is_archived)
                    }
                  />
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
