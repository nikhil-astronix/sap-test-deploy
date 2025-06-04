"use client";
import React, { useState, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ClockClockwise,
  User,
  ChalkboardTeacher,
  Book,
  ChartBar,
  Tag,
  Trash,
  Archive,
} from "@phosphor-icons/react";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import NetworkHeader from "@/components/network/NetworkHeader";
import {
  PencilSimpleLine,
  CaretCircleDown,
  CaretCircleUp,
  Info,
} from "@phosphor-icons/react";
import {
  deleteClassroom,
  editClassroom,
  getClassroom,
  archiveClassroom,
  restoreClassroom,
} from "@/services/classroomService";
import { getInterventions } from "@/services/interventionService";
import { fetchAllCurriculums } from "@/services/curriculumsService";
import {
  fetchCurriculumsRequestPayload,
  Curriculum,
} from "@/models/curriculum";
import { Intervention } from "@/types/interventionData";
import { AxiosError } from "axios";
import Tooltip from "@/components/Tooltip";
import { useDistrict } from "@/context/DistrictContext";

// Add type definitions
interface Classroom {
  id: string;
  course: string;
  teacher: string;
  grades: string[];
  curriculums: string[];
  interventions: string[];
}

interface School {
  id: string;
  name: string;
  classes: Classroom[];
}

const gradeOptions = [
  { label: "Kindergarten", value: "Kindergarten" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
];

const instructionalOptions = [
  { label: "Illustrative Math", value: "Illustrative Math" },
  { label: "Amplify", value: "Amplify" },
  { label: "Wonders", value: "Wonders" },
];

const tagOptions = [
  { label: "Coaching", value: "Coaching" },
  { label: "Tag2", value: "Tag2" },
  { label: "Tag3", value: "Tag3" },
];

export default function ClassroomsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    schoolId: string;
    classroomId: string;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [editData, setEditData] = useState<Classroom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<{
    schools: Set<string>;
    classes: Set<string>;
  }>({
    schools: new Set<string>(),
    classes: new Set<string>(),
  });
  const [selectAll, setSelectAll] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const [activeClassrooms, setActiveClassrooms] = useState<any[]>([]);
  const [archivedClassrooms, setArchivedClassrooms] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const { globalDistrict, setGlobalDistrict } = useDistrict();

  const allClassrooms = active ? activeClassrooms : archivedClassrooms;

  const paginatedSchools = allClassrooms;

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, null, null, active, search);
  }, [currentPage, rowsPerPage, search, active, globalDistrict]);

  useEffect(() => {
    fetchCurriculums();
    fetchInterventions();
  }, []);

  const fetchCurriculums = async () => {
    try {
      const requesPayload: fetchCurriculumsRequestPayload = {
        is_archived: false,
        type: ["Default", "Custom"].join(","),
        sort_by: null,
        sort_order: null,
        search: null,
        page: 1,
        limit: 100,
      };
      const data = await fetchAllCurriculums(requesPayload);

      if (data.success) {
        const formattedCurriculums = data.data.curriculums.map(
          (curriculum: Curriculum) => ({
            value: curriculum.id,
            label: curriculum.title,
          })
        );

        setCurriculums(formattedCurriculums);
      }
    } catch (error) {
      console.error("Failed to load curriculums:", error);
    }
  };

  const fetchInterventions = async () => {
    try {
      const requesPayload = {
        is_archived: false,
        filter: null,
        sort_by: null,
        sort_order: null,
        search: null,
        curr_page: 1,
        per_page: 100,
      };
      const data = await getInterventions(requesPayload);
      if (data.success) {
        const formattedInterventions = data.data.interventions.map(
          (intervention: Intervention) => ({
            value: intervention.id,
            label: intervention.name,
          })
        );
        setInterventions(formattedInterventions);
      }
    } catch (error) {
      console.error("Failed to load curriculums:", error);
    }
  };

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
    fetchData(1, limit, null, null, active, search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, rowsPerPage, null, null, active, search);
  };

  const handleExpand = (schoolId: string, event?: React.MouseEvent): void => {
    // Ensure we stop propagation
    if (event) {
      event.stopPropagation();
    }

    // Only toggle this specific school's expansion state
    setExpanded((current) => (current === schoolId ? null : schoolId));

    // Always close editing when expansion changes
    setEditing(null);
  };

  const handleEdit = (schoolId: string, classroom: Classroom): void => {
    classroom.curriculums = classroom.curriculums.map((curriculum) => {
      const found = curriculums.find((item) => item.label === curriculum);
      return found ? found.value : curriculum;
    });
    classroom.interventions = classroom.interventions.map((intervention) => {
      const found = interventions.find((item) => item.label === intervention);
      return found ? found.value : intervention;
    });
    setEditing({ schoolId, classroomId: classroom.id });
    setEditData({ ...classroom });
  };

  const handleEditChange = (field: keyof Classroom, value: any): void => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const fetchData = async (
    page: number,
    limit: number,
    sortBy: string | null,
    sortOrder: "asc" | "desc" | null,
    isArchived: boolean = false,
    search: string | null
  ) => {
    setIsLoading(true);
    try {
      const districtId = localStorage.getItem("globalDistrict");
      const requestPayload = {
        is_archived: active,
        district_id: districtId || "",
        sort_by: null,
        sort_order: null,
        curr_page: page,
        per_page: limit,
        search: search, // Don't send empty strings
      };

      const response = await getClassroom(requestPayload);
      console.log("API Response:", response);

      if (response.success && response.data) {
        // Transform API data with safe access patterns
        const transformedClassrooms = response.data.schools || [];

        // Update with proper state management
        if (active) {
          setActiveClassrooms(transformedClassrooms);
        } else {
          setArchivedClassrooms(transformedClassrooms);
        }

        // Update pagination with null checks
        setTotalCount(response.data.total_classrooms || 0);
        setTotalPages(response.data.total_pages || 1);
      } else {
        console.error("API returned unsuccessful response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, null, null, active, search);
  }, [currentPage, rowsPerPage, search, active]);

  const handleSave = async () => {
    if (!editing || !editData) {
      console.error("Editing or editData missing");
      return;
    }
    // Helper to get school name by ID
    const getSchoolNameById = (schoolId: string): string => {
      const school = allClassrooms.find(
        (s: any) => s.schoolId === schoolId || s.id === schoolId
      );
      return school?.school || school?.name || "";
    };
    try {
      const districtId = localStorage.getItem("globalDistrict");
      let data = {
        school_name: getSchoolNameById(editing.schoolId),
        district_id: districtId || "",
        school_id: editing.schoolId,
        course: editData.course,
        teacher_name: editData.teacher,
        grades: editData.grades,
        class_section: "empty", // editData.classPeriod,
        interventions: Array.isArray(editData.interventions)
          ? editData.interventions
          : [],
        curriculums: Array.isArray(editData.curriculums)
          ? editData.curriculums
          : [],
      };

      const response = await editClassroom(editing?.classroomId, data);

      if (response.success) {
        setEditing(null);
        fetchData(currentPage, rowsPerPage, null, null, active, search);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      let errorMessage = "Failed to edit classroom. Please try again.";
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

  const handleCloseEdit = (): void => {
    setEditing(null);
  };

  const handleSelectRow = (
    schoolId: string,
    classroomId: string | "all",
    event?:
      | React.MouseEvent<Element, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event) {
      event.stopPropagation();
    }

    // Create a new reference for state to ensure React recognizes the change
    const newSelected = {
      schools: new Set<string>(selectedRows.schools),
      classes: new Set<string>(selectedRows.classes),
    };

    const school = allClassrooms.find((s) => s.schoolId === schoolId);
    if (!school) return;

    if (classroomId === "all") {
      // Toggle selection for this specific school only
      const shouldSelect = !selectedRows.schools.has(schoolId);

      if (shouldSelect) {
        // Add just this school and its classrooms
        newSelected.schools.add(schoolId);
        school.classes.forEach((classroom: Classroom) => {
          newSelected.classes.add(`${schoolId}-${classroom.id}`);
        });
      } else {
        // Remove just this school and its classrooms
        newSelected.schools.delete(schoolId);
        school.classes.forEach((classroom: Classroom) => {
          newSelected.classes.delete(`${schoolId}-${classroom.id}`);
        });
      }
    } else {
      // Handle individual classroom selection/deselection
      const rowId = `${schoolId}-${classroomId}`;
      const shouldSelect = !selectedRows.classes.has(rowId);

      if (shouldSelect) {
        // Add just this specific classroom
        newSelected.classes.add(rowId);

        // Check if this completes the school selection
        const allClassroomsSelected = school.classes.every(
          (classroom: Classroom) =>
            newSelected.classes.has(`${schoolId}-${classroom.id}`)
        );

        if (allClassroomsSelected) {
          newSelected.schools.add(schoolId);
        }
      } else {
        // Remove just this classroom
        newSelected.classes.delete(rowId);
        newSelected.schools.delete(schoolId); // Always remove school selection when any classroom is deselected
      }
    }

    // Force a proper state update by creating new reference
    setSelectedRows(newSelected);
    updateSelectAllState(newSelected);
  };

  const handleSelectAll = (): void => {
    const newSelected = {
      schools: new Set<string>(),
      classes: new Set<string>(),
    };

    if (!selectAll) {
      // Select all schools and their classrooms
      allClassrooms.forEach((school) => {
        // Fixed: Use schoolId consistently (lowercase 's')
        newSelected.schools.add(school.schoolId);
        school.classes.forEach((classroom: Classroom) => {
          newSelected.classes.add(`${school.schoolId}-${classroom.id}`);
        });
      });
    }

    // Update state with the new selected items
    setSelectedRows(newSelected);
    setSelectAll(!selectAll);
  };

  const updateSelectAllState = (selected: typeof selectedRows): void => {
    let totalClassrooms = 0;
    let selectedClassrooms = 0;

    allClassrooms.forEach((school) => {
      totalClassrooms += school.classes.length;
      selectedClassrooms += school.classes.filter((classroom: Classroom) =>
        selected.classes.has(`${school.schoolId}-${classroom.id}`)
      ).length;
    });

    setSelectAll(totalClassrooms > 0 && selectedClassrooms === totalClassrooms);
  };

  // Add this helper function to check if any items are selected
  const hasSelectedItems = (): boolean => {
    return selectedRows.schools.size > 0 || selectedRows.classes.size > 0;
  };

  // Helper function to get selected items info
  const getSelectedItemsInfo = (): string[] => {
    const selectedSchools = Array.from(selectedRows.schools);
    const selectedClassrooms = Array.from(selectedRows.classes);
    const items: string[] = [];

    selectedSchools.forEach((schoolId) => {
      const school = allClassrooms.find((s) => s.schoolId === schoolId);
      if (school) {
        items.push(`${school.school}`);
      }
    });

    selectedClassrooms.forEach((classroomId) => {
      const [schoolId, roomId] = classroomId.split("-");
      const school = allClassrooms.find((s) => s.schoolId === schoolId);
      const classroom = school?.classes.find((c: Classroom) => c.id === roomId);
      if (classroom && !selectedRows.schools.has(schoolId)) {
        items.push(
          `${classroom.teacher} - ${
            classroom.course
          } - Grade ${classroom.grades.join(", ")}`
        );
      }
    });

    return items;
  };

  const handleRestore = async (): Promise<void> => {
    // Extract selected school IDs
    const selectedSchoolIds = Array.from(selectedRows.schools);

    // Extract selected classroom IDs, but only for classrooms whose schools aren't already selected
    const selectedClassroomIds = Array.from(selectedRows.classes).filter(
      (id) => {
        const [schoolId] = id.split("-");
        return !selectedRows.schools.has(schoolId); // Only keep if school not selected
      }
    );

    // Get all classroom IDs from selected schools
    const classroomsFromSelectedSchools = selectedSchoolIds.flatMap(
      (schoolId) => {
        const school = allClassrooms.find((s) => s.schoolId === schoolId);
        return (
          school?.classes.map((classroom: Classroom) => classroom.id) || []
        );
      }
    );

    // Prepare final ID list to send to backend - ONLY classroom IDs, no school IDs
    const idsToRestore = [
      ...classroomsFromSelectedSchools, // Classroom IDs from selected schools
      ...selectedClassroomIds.map((id) => id.split("-")[1]), // Classroom IDs from individually selected classrooms
    ];

    console.log("IDs to Restore:", idsToRestore);

    try {
      // Call the classroom restore API
      const response = await restoreClassroom({ ids: idsToRestore });

      console.log("Restore API Response:", response);

      if (response.success) {
        // Refresh the data
        fetchData(currentPage, rowsPerPage, null, null, active, search);

        // Show success notification if you have a toast system
        // toast.success('Classroom(s) restored successfully');
      } else {
        // Handle error
        console.error("Failed to restore classrooms:", response.error);
      }
    } catch (error) {
      console.error("Error restoring classrooms:", error);
    } finally {
      // Reset selections and close modal
      setSelectedRows({ schools: new Set(), classes: new Set() });
      setShowRestoreModal(false);
    }
  };

  const handleArchive = async (): Promise<void> => {
    // Extract selected school IDs
    const selectedSchoolIds = Array.from(selectedRows.schools);

    // Extract selected classroom IDs, but only for classrooms whose schools aren't already selected
    const selectedClassroomIds = Array.from(selectedRows.classes).filter(
      (id) => {
        const [schoolId] = id.split("-");
        return !selectedRows.schools.has(schoolId); // Only keep if school not selected
      }
    );

    // Get all classroom IDs from selected schools
    const classroomsFromSelectedSchools = selectedSchoolIds.flatMap(
      (schoolId) => {
        const school = allClassrooms.find((s) => s.schoolId === schoolId);
        return (
          school?.classes.map((classroom: Classroom) => classroom.id) || []
        );
      }
    );

    // Prepare final ID list to send to backend - ONLY classroom IDs, no school IDs
    const idsToArchive = [
      ...classroomsFromSelectedSchools, // Classroom IDs from selected schools
      ...selectedClassroomIds.map((id) => id.split("-")[1]), // Classroom IDs from individually selected classrooms
    ];

    console.log("IDs to Archive:", idsToArchive);

    try {
      // Call the classroom archive API
      const response = await archiveClassroom({ ids: idsToArchive });

      console.log("Archive API Response:", response);

      if (response.success) {
        // Refresh the data
        fetchData(currentPage, rowsPerPage, null, null, active, search);

        // Show success notification
      } else {
      }
    } catch (error) {
      console.error("Error archiving classrooms:", error);
    } finally {
      // Reset selections and close modal
      setSelectedRows({ schools: new Set(), classes: new Set() });
      setShowArchiveModal(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    // Extract selected school IDs
    const selectedSchoolIds = Array.from(selectedRows.schools);

    // Extract selected classroom IDs, but only for classrooms whose schools aren't already selected
    const selectedClassroomIds = Array.from(selectedRows.classes).filter(
      (id) => {
        const [schoolId] = id.split("-");
        return !selectedRows.schools.has(schoolId); // Only keep if school not selected
      }
    );

    // Get all classroom IDs from selected schools
    const classroomsFromSelectedSchools = selectedSchoolIds.flatMap(
      (schoolId) => {
        const school = allClassrooms.find((s) => s.schoolId === schoolId);
        return (
          school?.classes.map((classroom: Classroom) => classroom.id) || []
        );
      }
    );

    // Prepare final ID list to send to backend - ONLY classroom IDs, no school IDs
    const idsToDelete = [
      ...classroomsFromSelectedSchools, // Classroom IDs from selected schools
      ...selectedClassroomIds.map((id) => id.split("-")[1]), // Classroom IDs from individually selected classrooms
    ];

    console.log("IDs to Delete:", idsToDelete);

    try {
      // Call the classroom delete API
      const response = await deleteClassroom({ ids: idsToDelete });

      console.log("Delete API Response:", response);

      if (response.success) {
        // Refresh the data
        fetchData(currentPage, rowsPerPage, null, null, active, search);

        // Show success notification if you have a toast system
        // toast.success('Classroom(s) deleted successfully');
      } else {
        // Handle error
        console.error("Failed to delete classrooms:", response.error);
      }
    } catch (error) {
      console.error("Error deleting classrooms:", error);
    } finally {
      // Reset selections and close modal
      setSelectedRows({ schools: new Set(), classes: new Set() });
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-full bg-white rounded-lg shadow-md">
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-[16px] text-black font-medium">Archive</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {getSelectedItemsInfo().length === 0
                ? "Please select classrooms to archive."
                : `Are you sure you want to archive ${
                    getSelectedItemsInfo().length === 1
                      ? "this Classroom?"
                      : "these Classrooms?"
                  }`}
            </p>

            {/* Selected Classrooms Display */}
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
                      <p className="text-[14px] text-black-400 font-medium">
                        {item}
                      </p>
                    </div>
                    <div className="text-[14px]  text-right font-medium">
                      Classroom
                    </div>
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
                  <p className="text-sm text-[#C23E19]"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19] mt-2 font-medium">
                {getSelectedItemsInfo().length === 0
                  ? "No classrooms selected. Please select at least one classroom to archive."
                  : `Archiving ${
                      getSelectedItemsInfo().length === 1
                        ? "this classroom"
                        : "these classrooms"
                    } will remove ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } from active views. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
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
                } text-white font-medium rounded-[6px] transition-colors`}
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
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <ClockClockwise className="text-blue-600" size={24} />
              <h2 className="text-[16px] font-medium text-black">Restore</h2>
            </div>

            {/* Description */}
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {getSelectedItemsInfo().length === 0
                ? "Please select classrooms to restore."
                : `Are you sure you want to restore ${
                    getSelectedItemsInfo().length === 1
                      ? "this Classroom?"
                      : "these Classrooms?"
                  }`}
            </p>

            {/* Selected Classrooms Display */}
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
                      <p className="text-[14px] text-black-400 font-medium">
                        {item}
                      </p>
                    </div>
                    <div className="text-[14px]  text-right font-medium">
                      Classroom
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
                  <p className="text-sm font-medium">Note</p>
                </div>
              </div>
              <p className="text-left text-sm mt-2 font-medium">
                {getSelectedItemsInfo().length === 0
                  ? "No classrooms selected. Please select at least one classroom to restore."
                  : `Restoring ${
                      getSelectedItemsInfo().length === 1
                        ? "this classroom"
                        : "these classrooms"
                    } will make ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } active again. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
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
                } text-white font-medium rounded-[6px] transition-colors`}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Trash className="text-gray-700" size={24} />
              <h2 className="text-[16px] font-medium text-black">Delete</h2>
            </div>

            {/* Prompt */}
            <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
              {getSelectedItemsInfo().length === 0
                ? "Please select classrooms to delete."
                : `Are you sure you want to delete ${
                    getSelectedItemsInfo().length === 1
                      ? "this Classroom?"
                      : "these Classrooms?"
                  }`}
            </p>

            {/* Classroom Info Card */}
            {getSelectedItemsInfo().length > 0 && (
              <div
                className={`rounded-[6px] bg-[#F4F6F8] px-4 py-2 shadow-md mb-4 ${
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
                      <p className="text-[14px] text-black-400 font-medium">
                        {item}
                      </p>
                    </div>
                    <div className="text-[14px] text-right font-medium">
                      Classroom
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Box */}
            <div className="bg-red-50 border-l-4 border-[#c23e19] p-4 mb-6 mt-[10px]">
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
                  <p className="text-sm text-[#C23E19] font-medium"> Warning</p>
                </div>
              </div>
              <p className="text-left text-sm text-[#C23E19] mt-2 font-medium">
                {getSelectedItemsInfo().length === 0
                  ? "No classrooms selected. Please select at least one classroom to delete."
                  : `Deleting ${
                      getSelectedItemsInfo().length === 1
                        ? "this classroom"
                        : "these classrooms"
                    } will remove ${
                      getSelectedItemsInfo().length === 1 ? "it" : "them"
                    } from the scheduled observation sessions. Please confirm before proceeding.`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={getSelectedItemsInfo().length === 0}
                className={`px-4 py-2 ${
                  getSelectedItemsInfo().length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B4351C] hover:bg-[#943015]"
                } text-white font-medium rounded-[6px] transition-colors`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <NetworkHeader
        title="Classrooms"
        description="Easily access and manage all your classrooms from one place."
        search={search}
        setSearch={setSearch}
        active={active}
        setActive={setActive}
        hasSelectedItems={hasSelectedItems}
        setShowArchiveModal={setShowArchiveModal}
        setShowRestoreModal={setShowRestoreModal}
        setShowDeleteModal={setShowDeleteModal}
        addButtonLink="/classrooms/new"
        addButtonText="Add"
        isEditing={editing !== null}
        onSave={handleSave}
        onClose={handleCloseEdit}
        activeLabel="Active"
        archivedLabel="Archived"
        isActiveArchived={false} // Classrooms page has reversed active/archived logic
      />
      <div className="overflow-x-auto rounded-xl border border-gray-300  bg-white overflow-visible">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#2264AC] text-white border-b border-gray-300">
              <th className=" px-4 py-3 text-left border-gray-300">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 appearance-none text-[#2264AC] border border-white rounded-sm checked:bg-[color:var(--accent)] checked:border-white checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center"
                  />
                </div>
              </th>
              <th className="w-[25%]  py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center space-x-2">
                  <ChalkboardTeacher size={20} />
                  <span>Course</span>
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Teacher</span>
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center space-x-2">
                  <ChartBar size={20} />
                  <span>Grades</span>
                </div>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <div className="flex items-center space-x-2">
                  <Book size={20} />
                  <span>Instructional Materials</span>
                </div>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold ">
                <div className="flex items-center space-x-2">
                  <Tag size={20} />
                  <span>Tags & Attribute(s)</span>
                </div>
              </th>
              <th className="w-[5%] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedSchools.map((school) => (
              <React.Fragment key={school.schoolId}>
                <tr
                  className="bg-[#F3F8FF] hover:bg-[#E5F0FF] cursor-pointer border-y border-gray-300"
                  onClick={(e) => {
                    // School row should ONLY handle expansion on click
                    e.stopPropagation();
                    handleExpand(school.schoolId);
                  }}
                >
                  <td
                    className="px-4 py-3 border-gray-200 bg-[#F8FAFC]"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.schools.has(school.schoolId)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectRow(school.schoolId, "all", e);
                        }}
                        // className="w-4 h-4 rounded-md border-2 border-white text-[#2264AC] cursor-pointer"
                        className="h-4 w-4 cursor-pointer"
                        style={{ accentColor: "#2264AC" }}
                      />
                    </div>
                  </td>
                  <td
                    colSpan={6}
                    className="pr-4 py-3 border-b border-gray-300"
                  >
                    <div className="flex items-center justify-between mr-2.5">
                      <span className="font-semibold text-sm">
                        {school.school}
                      </span>
                      <button
                        onClick={(e) => {
                          // Make expansion explicitly tied to the caret icon
                          e.stopPropagation();
                          handleExpand(school.schoolId);
                        }}
                        className="bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {expanded === school.schoolId ? (
                          <CaretCircleUp className="text-gray-600" size={16} />
                        ) : (
                          <CaretCircleDown
                            className="text-gray-600"
                            size={16}
                          />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded === school.schoolId &&
                  school.classes.length > 0 &&
                  school.classes.map((classroom: Classroom) => (
                    <tr
                      key={classroom.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      // Don't automatically select on row click
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <td
                        className="px-4 py-3 "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.classes.has(
                              `${school.schoolId}-${classroom.id}`
                            )}
                            onChange={(e) => {
                              e.stopPropagation();

                              handleSelectRow(school.schoolId, classroom.id, e);
                            }}
                            // className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] bg-white cursor-pointer"
                            className="h-4 w-4 cursor-pointer"
                            style={{ accentColor: "#2264AC" }}
                          />
                        </div>
                      </td>
                      {editing &&
                      editing.schoolId === school.schoolId &&
                      editing.classroomId === classroom.id ? (
                        <>
                          <td className="pr-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2264AC] text-sm"
                              value={editData?.course || ""}
                              onChange={(e) =>
                                handleEditChange("course", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData?.teacher || ""}
                              onChange={(e) =>
                                handleEditChange("teacher", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={gradeOptions}
                              values={editData?.grades || []}
                              onChange={(vals) =>
                                handleEditChange("grades", vals)
                              }
                              isGrade={true}
                              placeholder="Select grades"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={curriculums}
                              values={editData?.curriculums || []}
                              onChange={(vals) =>
                                handleEditChange("curriculums", vals)
                              }
                              placeholder="Select materials"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={interventions}
                              values={editData?.interventions || []}
                              onChange={(vals) =>
                                handleEditChange("interventions", vals)
                              }
                              placeholder="Select tags"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* No edit icon in edit mode */}

                            <button
                              className="text-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(school.schoolId, classroom);
                              }}
                            >
                              <PencilSimpleLine size={16} color="#2264AC" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className=" py-2 border-r border-gray-200">
                            {classroom.course}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.teacher}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200 relative group">
                            {classroom.grades.length > 0 ? (
                              <Tooltip
                                content={
                                  <div className="flex flex-col space-y-1">
                                    {classroom.grades.map((grade, idx) => (
                                      <div key={idx}>{grade}</div>
                                    ))}
                                  </div>
                                }
                              >
                                <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                  <span className="truncate max-w-[150px]">
                                    {classroom.grades[0]}
                                  </span>
                                  {classroom.grades.length > 1 && (
                                    <span className="text-blue-700 ml-1 cursor-pointer">
                                      +{classroom.grades.length - 1} more
                                    </span>
                                  )}
                                </div>
                              </Tooltip>
                            ) : (
                              "None"
                            )}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200 relative group">
                            {classroom.curriculums.length > 0 ? (
                              <Tooltip
                                content={
                                  <div className="flex flex-col space-y-1">
                                    {classroom.curriculums.map(
                                      (curriculum, idx) => (
                                        <div key={idx}>{curriculum}</div>
                                      )
                                    )}
                                  </div>
                                }
                              >
                                <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                  <span className="truncate max-w-[150px]">
                                    {classroom?.curriculums[0]}
                                  </span>
                                  {classroom.curriculums.length > 1 && (
                                    <span className="text-blue-700 ml-1 cursor-pointer">
                                      +{classroom?.curriculums?.length - 1} more
                                    </span>
                                  )}
                                </div>
                              </Tooltip>
                            ) : (
                              "None"
                            )}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200 relative group">
                            {classroom.interventions.length > 0 ? (
                              <Tooltip
                                content={
                                  <div className="flex flex-col space-y-1">
                                    {classroom.interventions.map(
                                      (intv, idx) => (
                                        <div key={idx}>{intv}</div>
                                      )
                                    )}
                                  </div>
                                }
                              >
                                <div className="flex flex-col w-full truncate max-w-[150px]">
                                  <span className="truncate">
                                    {classroom.interventions[0]}
                                  </span>
                                  {classroom?.interventions?.length > 1 && (
                                    <span className="text-blue-700 cursor-pointer">
                                      +{classroom.interventions.length - 1} more
                                    </span>
                                  )}
                                </div>
                              </Tooltip>
                            ) : (
                              "None"
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              className="text-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(school.schoolId, classroom);
                              }}
                            >
                              <PencilSimpleLine size={16} color="#2264AC" />
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
        <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">
              {allClassrooms.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    totalCount
                  )} of ${totalCount}`
                : "0 results"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray ">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
                className="text-sm  px-1 py-1"
                disabled={isLoading}
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
                disabled={currentPage === 1 || isLoading}
                className={`p-1 border rounded ${
                  currentPage === 1 || isLoading
                    ? "text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-500 px-1">
                {currentPage}/{totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || totalPages === 0 || isLoading
                }
                className={`p-1 border rounded ${
                  currentPage === totalPages || totalPages === 0 || isLoading
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
{
  /* Rest of your classroom row cells with stopPropagation added to each */
}
