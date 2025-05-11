"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Archive,
  School,
  User,
  BarChart2,
  BookOpen,
  Tag,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import { useRouter } from "next/navigation";

const mockActiveSchools = [
  {
    id: "1",
    name: "Elmwood Elementary School",
    classrooms: [
      {
        id: "1",
        course: "Course 1",
        teacher: "Teacher 1",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math"],
        tags: ["Coaching"],
      },
      {
        id: "2",
        course: "Course 2",
        teacher: "Teacher 2",
        grades: ["1", "2", "3"],
        instructionalMaterials: [],
        tags: ["Coaching", "Coaching"],
      },
      {
        id: "3",
        course: "Course 3",
        teacher: "Teacher 3",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math", "Amplify"],
        tags: [],
      },
      {
        id: "4",
        course: "Course 4",
        teacher: "Teacher 4",
        grades: ["1", "2", "3"],
        instructionalMaterials: ["Illustrative Math", "Amplify", "Wonders"],
        tags: ["Coaching", "Tag2", "Tag3"],
      },
    ],
  },
  {
    id: "2",
    name: "Jefferson Middle School",
    classrooms: [
      {
        id: "1",
        course: "Math 6",
        teacher: "Ms. Carter",
        grades: ["6"],
        instructionalMaterials: ["Eureka Math"],
        tags: ["Coaching"],
      },
      {
        id: "2",
        course: "Science 6",
        teacher: "Mr. Lee",
        grades: ["6"],
        instructionalMaterials: ["Amplify"],
        tags: ["Tag2"],
      },
    ],
  },
  {
    id: "3",
    name: "Lincoln Middle School",
    classrooms: [
      {
        id: "1",
        course: "English 7",
        teacher: "Mrs. Smith",
        grades: ["7"],
        instructionalMaterials: ["Wonders"],
        tags: [],
      },
      {
        id: "2",
        course: "History 8",
        teacher: "Mr. Brown",
        grades: ["8"],
        instructionalMaterials: ["Illustrative Math"],
        tags: ["Tag3"],
      },
    ],
  },
];

const mockArchivedSchools = [
  {
    id: "4",
    name: "Washington High School",
    classrooms: [
      {
        id: "1",
        course: "AP Biology",
        teacher: "Dr. Johnson",
        grades: ["11", "12"],
        instructionalMaterials: ["OpenStax"],
        tags: ["Archive 2023"],
      },
      {
        id: "2",
        course: "Chemistry",
        teacher: "Ms. White",
        grades: ["10"],
        instructionalMaterials: ["Pearson"],
        tags: ["Archive 2023", "Lab Required"],
      },
    ],
  },
  {
    id: "5",
    name: "Roosevelt Elementary",
    classrooms: [
      {
        id: "1",
        course: "4th Grade Math",
        teacher: "Mr. Davis",
        grades: ["4"],
        instructionalMaterials: ["Eureka Math"],
        tags: ["Archive 2022"],
      },
    ],
  },
];

const gradeOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
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
  const [active, setActive] = useState(true);
  const [editData, setEditData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<{
    schools: Set<string>;
    classrooms: Set<string>;
  }>({
    schools: new Set<string>(),
    classrooms: new Set<string>(),
  });
  const [selectAll, setSelectAll] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const rowsPerPage = 5;
  const router = useRouter();

  const schools = active ? mockActiveSchools : mockArchivedSchools;
  const paginatedSchools = schools.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(schools.length / rowsPerPage);

  // Helper function to check if all classrooms of a school are selected
  const areAllClassroomsSelected = (schoolId: string, classrooms: any[]) => {
    return classrooms.every((classroom) =>
      selectedRows.classrooms.has(`${schoolId}-${classroom.id}`)
    );
  };

  // Helper function to check if any classroom of a school is selected
  const isAnyClassroomSelected = (schoolId: string, classrooms: any[]) => {
    return classrooms.some((classroom) =>
      selectedRows.classrooms.has(`${schoolId}-${classroom.id}`)
    );
  };

  const handleExpand = (schoolId: string) => {
    setExpanded(expanded === schoolId ? null : schoolId);
    setEditing(null);
  };

  const handleEdit = (schoolId: string, classroom: any) => {
    setEditing({ schoolId, classroomId: classroom.id });
    setEditData({ ...classroom });
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
    schoolId: string,
    classroomId: string | "all",
    event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event) {
      event.stopPropagation();
    }

    const newSelected = {
      schools: new Set(selectedRows.schools),
      classrooms: new Set(selectedRows.classrooms),
    };

    const school = schools.find((s) => s.id === schoolId);
    if (!school) return;

    if (classroomId === "all") {
      const shouldSelect = !selectedRows.schools.has(schoolId);

      if (shouldSelect) {
        // Select school and all its classrooms
        newSelected.schools.add(schoolId);
        school.classrooms.forEach((classroom) => {
          newSelected.classrooms.add(`${schoolId}-${classroom.id}`);
        });
      } else {
        // Deselect school and all its classrooms
        newSelected.schools.delete(schoolId);
        school.classrooms.forEach((classroom) => {
          newSelected.classrooms.delete(`${schoolId}-${classroom.id}`);
        });
      }
    } else {
      const rowId = `${schoolId}-${classroomId}`;
      const shouldSelect = !selectedRows.classrooms.has(rowId);

      if (shouldSelect) {
        newSelected.classrooms.add(rowId);
        // Check if all classrooms are now selected
        const allClassroomsSelected = school.classrooms.every((classroom) =>
          newSelected.classrooms.has(`${schoolId}-${classroom.id}`)
        );
        if (allClassroomsSelected) {
          newSelected.schools.add(schoolId);
        }
      } else {
        newSelected.classrooms.delete(rowId);
        newSelected.schools.delete(schoolId);
      }
    }

    setSelectedRows(newSelected);
    updateSelectAllState(newSelected);
  };

  const handleSelectAll = () => {
    const newSelected = {
      schools: new Set<string>(),
      classrooms: new Set<string>(),
    };

    if (!selectAll) {
      // Select all schools and their classrooms
      schools.forEach((school) => {
        newSelected.schools.add(school.id);
        school.classrooms.forEach((classroom) => {
          newSelected.classrooms.add(`${school.id}-${classroom.id}`);
        });
      });
    }

    setSelectedRows(newSelected);
    setSelectAll(!selectAll);
  };

  const updateSelectAllState = (selected: typeof selectedRows) => {
    let totalClassrooms = 0;
    let selectedClassrooms = 0;

    schools.forEach((school) => {
      totalClassrooms += school.classrooms.length;
      selectedClassrooms += school.classrooms.filter((classroom) =>
        selected.classrooms.has(`${school.id}-${classroom.id}`)
      ).length;
    });

    setSelectAll(totalClassrooms > 0 && selectedClassrooms === totalClassrooms);
  };

  // Add this helper function to check if any items are selected
  const hasSelectedItems = () => {
    return selectedRows.schools.size > 0 || selectedRows.classrooms.size > 0;
  };

  // Helper function to get selected items info
  const getSelectedItemsInfo = () => {
    const selectedSchools = Array.from(selectedRows.schools);
    const selectedClassrooms = Array.from(selectedRows.classrooms);
    const items: string[] = [];

    selectedSchools.forEach((schoolId) => {
      const school = schools.find((s) => s.id === schoolId);
      if (school) {
        items.push(`${school.name}`);
      }
    });

    selectedClassrooms.forEach((classroomId) => {
      const [schoolId, roomId] = classroomId.split("-");
      const school = schools.find((s) => s.id === schoolId);
      const classroom = school?.classrooms.find((c) => c.id === roomId);
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

  const handleRestore = () => {
    // Move selected items to active schools
    const newActiveSchools = [...mockActiveSchools];
    const newArchivedSchools = [...mockArchivedSchools];
    const processedSchools = new Set<string>();

    // First, process any selected schools
    selectedRows.schools.forEach((schoolId) => {
      const schoolIndex = newArchivedSchools.findIndex(
        (s) => s.id === schoolId
      );
      if (schoolIndex !== -1) {
        const [school] = newArchivedSchools.splice(schoolIndex, 1);
        newActiveSchools.push(school);
        processedSchools.add(schoolId);
      }
    });

    // Then process selected classrooms and their parent schools if needed
    selectedRows.classrooms.forEach((classroomId) => {
      const [schoolId, roomId] = classroomId.split("-");

      // Skip if we already processed this school
      if (processedSchools.has(schoolId)) return;

      const archivedSchool = newArchivedSchools.find((s) => s.id === schoolId);
      if (!archivedSchool) return;

      // Find or create the active school
      let activeSchool = newActiveSchools.find((s) => s.id === schoolId);
      if (!activeSchool) {
        activeSchool = {
          id: schoolId,
          name: archivedSchool.name,
          classrooms: [],
        };
        newActiveSchools.push(activeSchool);
      }

      // Find all selected classrooms from this school
      const selectedClassroomsFromSchool = Array.from(selectedRows.classrooms)
        .filter((id) => id.startsWith(schoolId))
        .map((id) => id.split("-")[1]);

      // Move selected classrooms to active school
      selectedClassroomsFromSchool.forEach((classroomId) => {
        const classroomIndex = archivedSchool.classrooms.findIndex(
          (c) => c.id === classroomId
        );
        if (classroomIndex !== -1) {
          const [classroom] = archivedSchool.classrooms.splice(
            classroomIndex,
            1
          );
          activeSchool.classrooms.push(classroom);
        }
      });

      // Remove archived school if it's empty
      if (archivedSchool.classrooms.length === 0) {
        const index = newArchivedSchools.findIndex((s) => s.id === schoolId);
        if (index !== -1) {
          newArchivedSchools.splice(index, 1);
        }
      }
    });

    // Update the mock data
    mockActiveSchools.splice(0, mockActiveSchools.length, ...newActiveSchools);
    mockArchivedSchools.splice(
      0,
      mockArchivedSchools.length,
      ...newArchivedSchools
    );

    // Clear selections and close modal
    setSelectedRows({ schools: new Set(), classrooms: new Set() });
    setShowRestoreModal(false);
  };

  const handleArchive = () => {
    // Move selected items to archived schools
    const newActiveSchools = [...mockActiveSchools];
    const newArchivedSchools = [...mockArchivedSchools];

    // Handle full school archival
    selectedRows.schools.forEach((schoolId) => {
      const schoolIndex = newActiveSchools.findIndex((s) => s.id === schoolId);
      if (schoolIndex !== -1) {
        const [school] = newActiveSchools.splice(schoolIndex, 1);
        newArchivedSchools.push(school);
      }
    });

    // Handle individual classroom archival
    selectedRows.classrooms.forEach((classroomId) => {
      const [schoolId, roomId] = classroomId.split("-");
      if (!selectedRows.schools.has(schoolId)) {
        const activeSchool = newActiveSchools.find((s) => s.id === schoolId);
        const archivedSchool = newArchivedSchools.find(
          (s) => s.id === schoolId
        ) || {
          ...activeSchool,
          classrooms: [],
          id: schoolId,
          name: activeSchool?.name || "",
        };

        if (activeSchool) {
          const classroomIndex = activeSchool.classrooms.findIndex(
            (c) => c.id === roomId
          );
          if (classroomIndex !== -1) {
            const [classroom] = activeSchool.classrooms.splice(
              classroomIndex,
              1
            );

            // If archived school doesn't exist, add it
            if (!newArchivedSchools.find((s) => s.id === schoolId)) {
              newArchivedSchools.push(archivedSchool);
            }

            // Add classroom to archived school
            archivedSchool.classrooms.push(classroom);
          }
        }
      }
    });

    // Update the mock data
    mockActiveSchools.splice(0, mockActiveSchools.length, ...newActiveSchools);
    mockArchivedSchools.splice(
      0,
      mockArchivedSchools.length,
      ...newArchivedSchools
    );

    // Clear selections and close modal
    setSelectedRows({ schools: new Set(), classrooms: new Set() });
    setShowArchiveModal(false);
  };

  const handleDelete = () => {
    // Implementation of delete functionality
    // Similar structure to handleArchive but removes items completely
    setShowDeleteModal(false);
    setSelectedRows({ schools: new Set(), classrooms: new Set() });
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full bg-white rounded-lg shadow-md overflow-y-auto">
      {/* Archive Confirmation Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="text-gray-600" size={24} />
              <h2 className="text-xl font-semibold">Archive</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to archive this Classroom?
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {getSelectedItemsInfo().map((item, index) => (
                    <div key={index} className="text-gray-600 py-1">
                      {item}
                    </div>
                  ))}
                </span>
                <span>Classroom</span>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <p className="text-sm text-red-600">
                    Archiving this classroom will remove it from active views.
                    Please confirm before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
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

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Restore</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to restore this Classroom?
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {getSelectedItemsInfo().map((item, index) => (
                    <div key={index} className="text-gray-600 py-1">
                      {item}
                    </div>
                  ))}
                </span>
                <span>Classroom</span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-600">
                    Restoring this classroom will make it active again. Please
                    confirm before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="text-gray-600" size={24} />
              <h2 className="text-xl font-semibold">Delete</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this Classroom?
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {" "}
                  {getSelectedItemsInfo().map((item, index) => (
                    <div key={index} className="text-gray-600 py-1">
                      {item}
                    </div>
                  ))}
                </span>
                <span>Classroom</span>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <p className="text-sm text-red-600">
                    Deleting this classroom will remove it from the scheduled
                    observation sessions. Please confirm before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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

      <h1 className="text-2xl font-bold text-center mb-2">Classrooms</h1>
      <p className="text-center text-gray-600 mb-6">
        Easily access and manage all your classrooms from one place.
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
          <input
            className="border rounded-lg px-3 py-2 w-1/3 text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-2">
            {active ? (
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
                    ? "Archive selected"
                    : "Select items to archive"
                }
              >
                <RotateCcw size={20} />
              </button>
            ) : (
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
                    ? "Restore selected"
                    : "Select items to restore"
                }
              >
                <Archive size={20} />
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
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => router.push("/classrooms/new")}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2 text-sm"
            >
              + Add
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 mt-4">
        <span className="mr-2 text-sm">Active</span>
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            active ? "bg-emerald-600" : "bg-gray-200"
          }`}
          onClick={() => setActive((a) => !a)}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="ml-2 text-sm">Archived</span>
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
                  <School size={16} />
                  Course
                </div>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  Teacher
                </span>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <BarChart2 size={16} />
                  Grades
                </span>
              </th>
              <th className="w-[20%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <BookOpen size={16} />
                  Instructional Materials
                </span>
              </th>
              <th className="w-[15%] px-4 py-3 text-left font-semibold border-r border-gray-300">
                <span className="inline-flex items-center gap-2">
                  <Tag size={16} />
                  Tags & Attribute(s)
                </span>
              </th>
              <th className="w-[5%] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedSchools.map((school) => (
              <React.Fragment key={school.id}>
                <tr
                  className="bg-[#F3F8FF] hover:bg-[#E5F0FF] cursor-pointer border-y border-gray-300"
                  onClick={(e) => {
                    handleSelectRow(school.id, "all", e);
                  }}
                >
                  <td
                    className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.schools.has(school.id)}
                        onChange={(e) => handleSelectRow(school.id, "all", e)}
                        className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                      />
                    </div>
                  </td>
                  <td
                    colSpan={6}
                    className="px-4 py-3 border-b border-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(school.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {school.name}
                      </span>
                      <span>
                        {expanded === school.id ? (
                          <ChevronUp className="text-gray-600" />
                        ) : (
                          <ChevronDown className="text-gray-600" />
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
                {expanded === school.id &&
                  school.classrooms.length > 0 &&
                  school.classrooms.map((classroom) => (
                    <tr
                      key={classroom.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={(e) =>
                        handleSelectRow(school.id, classroom.id, e)
                      }
                    >
                      <td
                        className="px-4 py-3 border-r border-gray-200 bg-[#F8FAFC]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.classrooms.has(
                              `${school.id}-${classroom.id}`
                            )}
                            onChange={(e) =>
                              handleSelectRow(school.id, classroom.id, e)
                            }
                            className="w-4 h-4 rounded-md border-2 border-gray-300 text-[#2264AC] focus:ring-[#2264AC] focus:ring-2 bg-white cursor-pointer"
                          />
                        </div>
                      </td>
                      {editing &&
                      editing.schoolId === school.id &&
                      editing.classroomId === classroom.id ? (
                        <>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.course}
                              onChange={(e) =>
                                handleEditChange("course", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <input
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={editData.teacher}
                              onChange={(e) =>
                                handleEditChange("teacher", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={gradeOptions}
                              values={editData.grades}
                              onChange={(vals) =>
                                handleEditChange("grades", vals)
                              }
                              placeholder="Select grades"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={instructionalOptions}
                              values={editData.instructionalMaterials}
                              onChange={(vals) =>
                                handleEditChange("instructionalMaterials", vals)
                              }
                              placeholder="Select materials"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            <MultiSelect
                              options={tagOptions}
                              values={editData.tags}
                              onChange={(vals) =>
                                handleEditChange("tags", vals)
                              }
                              placeholder="Select tags"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* No edit icon in edit mode */}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.course}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.teacher}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.grades.join(", ")}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.instructionalMaterials.length > 0
                              ? classroom.instructionalMaterials.join(", ")
                              : "None"}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {classroom.tags.length > 0
                              ? classroom.tags[0] +
                                (classroom.tags.length > 1
                                  ? ` + ${classroom.tags.length - 1} more`
                                  : "")
                              : "None"}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              className="text-emerald-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(school.id, classroom);
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
              {Math.min(currentPage * rowsPerPage, schools.length)} of{" "}
              {schools.length}
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
