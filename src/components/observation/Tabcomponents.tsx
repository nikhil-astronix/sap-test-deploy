"use client";

import { useState, useEffect } from "react";
import {
  ChalkboardTeacher,
  GraduationCap,
  CalendarDots,
  Users,
  UserGear,
  ChartBar,
  Clock,
  ArrowDownRight,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import { Check, X } from "lucide-react";
import { getSchools } from "@/services/schoolService";
import { getClassroom } from "@/services/classroomService";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";

// Update the Session interface to match the actual API response
interface Session {
  id: string;
  school: string;
  classrooms: {
    course: string;
    teacher_name: string;
    grades: string[];
  }[];
  date: string;
  start_time: string;
  end_time: string;
  observation_tool: string;
  observers: {
    first_name: string;
    last_name: string;
  }[];
  session_admin: string;
  status: string | undefined; //"scheduled" | "completed" | "cancelled" | undefined; // Optional as it might not be in the API
}

// Props for the SessionTables component
interface SessionTablesProps {
  todaySessions: Session[];
  upcomingSessions: Session[];
  pastSessions: Session[];
  onSelectionChange?: (selectedIds: string[]) => void; // Optional callback for selection changes
  onTabChange?: (tab: "Today" | "Upcoming" | "Past") => void;
  // Add editing related props
  onEditingChange?: (isEditing: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditingExternal?: boolean; // Add this prop
  Loading?: boolean;
}

// TabButton component for consistent styling
const TabButton = ({
  active,
  onClick,
  children,
  colorClass,
  className = "", // Add this prop with default empty string
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorClass: string;
  className?: string; // Add this to the type definition
}) => (
  <button
    className={`px-4 py-3 font-medium text-sm transition-colors relative ${
      active
        ? `bg-${colorClass} border-b-2 border-${colorClass} text-white`
        : "text-gray-500 hover:text-gray-800"
    } ${className}`} // Add the className prop here
    onClick={onClick}
  >
    {children}
  </button>
);

// Table component with matching styling from table.tsx
const SessionTable = ({
  sessions,
  searchTerm,
  activeTabColor,
  tabType, // Add this prop to know which tab we're in
  selectedIds,
  handleSelect,
  handleSelectAll,
  allSelected,
  editingRowId,
  editingData,
  handleStartEdit,
  handleCancelEdit,
  handleSaveEdit,
  handleEditChange,
  isEditingExternal, // Add this prop
  schoolsData,
  classroomsData,
  selectedSchool,
  selectedClassrooms,
  isLoading,
  handleSchoolChange,
  handleClassroomChange,
}: {
  sessions: Session[];
  searchTerm: string;
  activeTabColor: string;
  tabType: "Today" | "Upcoming" | "Past"; // Type for tab identification
  selectedIds: string[];
  handleSelect: (id: string, isSelected: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  editingRowId: string | null;
  editingData: Session | null;
  handleStartEdit: (session: Session) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  handleEditChange: (key: string, value: any) => void;
  isEditingExternal?: boolean;
  schoolsData: any[];
  classroomsData: any[];
  selectedSchool: string;
  selectedClassrooms: string[];
  isLoading: boolean;
  handleSchoolChange: (value: string) => void;
  handleClassroomChange: (values: string[]) => void;
}) => {
  // Filter sessions based on search term
  const filteredSessions = sessions.filter(
    (session) =>
      session.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.classrooms.some((classroom) =>
        classroom.course.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      session.observation_tool.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSessions.length === 0) {
    return <p className="text-gray-500 text-center py-6">No sessions found.</p>;
  }

  // Determine if we should show the action column based on tab type
  const showActions = tabType === "Today" || tabType === "Upcoming";

  // Instead of using var(--colorClass) in inline styles, use the actual color values
  const getHeaderBgColor = (colorClass: string) => {
    switch (colorClass) {
      case "[#007778]":
        return "#007778"; // Tailwind blue-700 color
      case "[#2264AC]":
        return "#2264AC"; // Tailwind emerald-600 color
      case "[#6C4996]":
        return "[#6C4996]"; // Tailwind purple-600 color
      default:
        return "#6C4996"; // Default to blue-700
    }
  };

  return (
    <div className="rounded-[6px] border border-gray-200 shadow-sm">
      <div className="overflow-x-auto rounded-[6px]">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: getHeaderBgColor(activeTabColor) }}>
              {/* Checkbox column */}
              <th className="w-[50px] px-4 py-3 text-center whitespace-nowrap border-r-2 border-gray-200">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>

              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[12px]  font-normal text-[#F9F5FF]">
                  <ChalkboardTeacher size={25} className="pr-1" />
                  <span>School</span>
                </div>
              </th>
              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[12px] font-normal text-[#F9F5FF]">
                  <GraduationCap size={25} className="pr-1" />
                  <span>Classroom</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[12px] font-normal text-[#F9F5FF]">
                  <CalendarDots size={25} className="pr-1" />
                  <span>Date</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[12px] font-normal text-[#F9F5FF]">
                  <Clock size={25} className="pr-1" />
                  <span>Start Time</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[12px] font-normal text-[#F9F5FF]">
                  <Clock size={25} className="pr-1" />
                  <span>End Time</span>
                </div>
              </th>
              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[12px] font-normal text-[#F9F5FF]">
                  <ChartBar size={25} className="pr-1" />
                  <span>Observation Tool</span>
                </div>
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[12px] font-normal text-[#F9F5FF]">
                  <Users size={25} className="pr-1" />
                  <span>Observers</span>
                </div>
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[12px] font-normal text-[#F9F5FF]">
                  <UserGear size={25} className="pr-1" />
                  <span>Session Admin</span>
                </div>
              </th>

              {/* Only show action column for Today and Upcoming tabs */}
              {showActions && (
                <th
                  className="w-[100px] min-w-[100px] text-center text-[12px] font-normal text-[#F9F5FF] sticky right-0 z-20 border-l-2 border-gray-200 px-2 py-3"
                  style={{
                    backgroundColor: getHeaderBgColor(activeTabColor),
                    boxShadow: "inset 1px 0 0 #E5E7EB",
                  }}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <ArrowDownRight size={20} />
                    <span className="text-[12px]-400 text-white">Action</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSessions.map((session, index) => {
              // Check both editingRowId and isEditingExternal
              const isEditing =
                session.id === editingRowId && isEditingExternal === true;

              console.log(
                "isEditing:",
                isEditing,
                "session.id:",
                session.id,
                "editingRowId:",
                editingRowId,
                "isEditingExternal:",
                isEditingExternal
              );

              return (
                <tr
                  key={session.id}
                  style={{
                    backgroundColor: index % 2 === 1 ? "#E9F3FF" : "#fff",
                  }}
                  className={`border-b border-gray-200 ${
                    isEditing
                      ? "shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative z-10"
                      : ""
                  }`}
                >
                  {/* Checkbox cell */}
                  <td className="w-[50px] px-4 py-4 text-center border-r-2 border-[#D4D4D4]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(session.id)}
                      onChange={(e) =>
                        handleSelect(session.id, e.target.checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isEditing}
                    />
                  </td>

                  {/* School */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <Dropdown
                        options={schoolsData}
                        value={selectedSchool}
                        onChange={(value) => handleSchoolChange(value)}
                        placeholder="Select a school"
                        className="w-40 bg-[#F4F6F8] focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
                      />
                    ) : (
                      session.school
                    )}
                  </td>

                  {/* Classroom Course */}
                  <td className="px-3 py-4 whitespace-nowrap border-r-2 border-[#D4D4D4]">
                    <div className="text-sm text-gray-900">
                      {session.classrooms.map((classroom, idx) => (
                        <div key={idx}>
                          {isEditing ? (
                            <MultiSelect
                              options={classroomsData}
                              values={selectedClassrooms}
                              onChange={handleClassroomChange}
                              placeholder={
                                isLoading
                                  ? "Loading classrooms..."
                                  : "Select classrooms"
                              }
                              className="w-48 bg-[#F4F6F8]"
                              showSelectedTags={false}
                              showSlectedOptions={false}
                            />
                          ) : (
                            classroom.course
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData?.date || ""}
                        onChange={(e) =>
                          handleEditChange("date", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      session.date
                    )}
                  </td>

                  {/* Start Time */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData?.start_time || ""}
                        onChange={(e) =>
                          handleEditChange("start_time", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      session.start_time
                    )}
                  </td>

                  {/* End Time */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData?.end_time || ""}
                        onChange={(e) =>
                          handleEditChange("end_time", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      session.end_time
                    )}
                  </td>

                  {/* Observation Tool */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData?.observation_tool || ""}
                        onChange={(e) =>
                          handleEditChange("observation_tool", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      session.observation_tool
                    )}
                  </td>

                  {/* Session Admin */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingData?.session_admin || ""}
                        onChange={(e) =>
                          handleEditChange("session_admin", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      session.session_admin
                    )}
                  </td>

                  {/* Observers */}
                  <td className="px-3 py-4 whitespace-nowrap border-r-2 border-[#D4D4D4]">
                    {isEditing
                      ? session.observers.map((observer, idx) => (
                          <div key={idx} className="mb-1 flex gap-1">
                            <input
                              type="text"
                              value={
                                editingData?.observers[idx]?.first_name || ""
                              }
                              onChange={(e) =>
                                handleEditChange(
                                  `observers.${idx}.first_name`,
                                  e.target.value
                                )
                              }
                              className="w-1/2 px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="First Name"
                            />
                            <input
                              type="text"
                              value={
                                editingData?.observers[idx]?.last_name || ""
                              }
                              onChange={(e) =>
                                handleEditChange(
                                  `observers.${idx}.last_name`,
                                  e.target.value
                                )
                              }
                              className="w-1/2 px-2 py-1 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Last Name"
                            />
                          </div>
                        ))
                      : session.observers.map((observer, idx) => (
                          <div key={idx} className="text-sm text-gray-900">
                            {observer.first_name} {observer.last_name}
                          </div>
                        ))}
                  </td>

                  {/* Action column */}
                  {showActions && (
                    <td
                      className="w-[100px] min-w-[100px] text-center sticky right-0 border-l-2 border-gray-400 px-2 py-4"
                      style={{
                        backgroundColor: index % 2 === 1 ? "#E9F3FF" : "#fff",
                        boxShadow: "inset 2px 0 0 #D4D4D4",
                      }}
                    >
                      <div className="flex justify-center items-center space-x-2">
                        {/* Only show the edit button, not the save/cancel buttons */}

                        <button
                          onClick={() => handleStartEdit(session)}
                          className="text-[#2A7251] hover:text-green-700"
                          title="Edit"
                        >
                          <PencilSimpleLine size={20} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main component to render the three session tables with tabs
export default function SessionTables({
  todaySessions,
  upcomingSessions,
  pastSessions,
  onSelectionChange,
  onTabChange,
  onEditingChange,
  onSave,
  onCancel,
  isEditingExternal,
  Loading,
}: SessionTablesProps) {
  const [activeTab, setActiveTab] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Session | null>(null);

  // Add inside the SessionTable component
  const [schoolsData, setSchoolsData] = useState<any[]>([]);
  const [classroomsData, setClassroomsData] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add useEffect hooks for fetching data
  useEffect(() => {
    fetchSchools();
  }, []);

  // Add effect to fetch classrooms when school changes
  useEffect(() => {
    if (selectedSchool) {
      fetchClassrooms(selectedSchool);
    }
  }, [selectedSchool]);

  // Add functions for fetching schools and classrooms
  const fetchSchools = async () => {
    try {
      const requestPayload = {
        is_archived: null,
        sort_by: null,
        sort_order: null,
        curr_page: 1,
        per_page: 100,
        search: null,
      };
      const response = await getSchools(requestPayload);
      const formattedSchools = response.data.schools.map((school: any) => ({
        value: school.id,
        label: school.name,
      }));
      setSchoolsData(formattedSchools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchClassrooms = async (schoolId?: string) => {
    setIsLoading(true);
    try {
      const requestPayload = {
        is_archived: false,
        sort_by: null,
        sort_order: null,
        curr_page: 1,
        per_page: 100,
        search: null,
        school_id: schoolId || null,
      };

      const response = await getClassroom(requestPayload);
      if (response.success && response.data) {
        const formattedClassrooms = response.data.schools.flatMap(
          (school: any) => {
            return (school.classes || []).map((classItem: any) => ({
              value: classItem.id,
              label: `${classItem.course} (${school.school})`,
              schoolId: school.schoolId,
              teacher: classItem.teacher,
            }));
          }
        );

        const filteredClassrooms = schoolId
          ? formattedClassrooms.filter(
              (classroom: any) => classroom.schoolId === schoolId
            )
          : formattedClassrooms;

        setClassroomsData(filteredClassrooms);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add handlers for selection changes
  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setSelectedClassrooms([]);

    // Get the current sessions based on active tab
    const currentSessions = getCurrentSessions();

    // Filter sessions based on selected school
    const schoolSessions = currentSessions.filter(
      (session) =>
        session.school === schoolsData.find((s) => s.value === schoolId)?.label
    );

    if (schoolSessions.length > 0) {
      const schoolSessionIds = schoolSessions.map((session) => session.id);
      handleSelectAll(true, schoolSessionIds);
    } else {
      handleSelectAll(false);
    }
  };

  const handleClassroomChange = (classroomIds: string[]) => {
    setSelectedClassrooms(classroomIds);

    // Get the current sessions based on active tab
    const currentSessions = getCurrentSessions();

    // Filter sessions based on selected classrooms
    if (classroomIds.length > 0) {
      const selectedClassroomLabels = classroomsData
        .filter((c) => classroomIds.includes(c.value))
        .map((c) => c.label.split(" (")[0]); // Extract the course name

      const classroomSessions = currentSessions.filter((session) =>
        session.classrooms.some((classroom) =>
          selectedClassroomLabels.includes(classroom.course)
        )
      );

      const classroomSessionIds = classroomSessions.map(
        (session) => session.id
      );
      setSelectedIds(classroomSessionIds);
      if (onSelectionChange) onSelectionChange(classroomSessionIds);
    } else if (selectedSchool) {
      // If no classrooms selected but school is selected, fall back to school filter
      handleSchoolChange(selectedSchool);
    } else {
      // Clear selection if neither school nor classrooms are selected
      handleSelectAll(false);
    }
  };

  // Get currently displayed sessions based on tab
  const getCurrentSessions = () => {
    switch (activeTab) {
      case "Today":
        return todaySessions;
      case "Upcoming":
        return upcomingSessions;
      case "Past":
        return pastSessions;
      default:
        return [];
    }
  };

  // Handle checkbox selection
  const handleSelect = (id: string, isSelected: boolean) => {
    let newSelectedIds;
    if (isSelected) {
      newSelectedIds = [...selectedIds, id];
    } else {
      newSelectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    }

    setSelectedIds(newSelectedIds);

    // Call the parent callback if provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  // Handle "select all" checkbox
  const handleSelectAll = (checked: boolean, ids?: string[]) => {
    const currentSessions = getCurrentSessions();

    const newSelectedIds = checked
      ? ids || currentSessions.map((session) => session.id)
      : [];

    setSelectedIds(newSelectedIds);

    // Call the parent callback if provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  // Notify parent component about editing state changes
  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(editingRowId !== null);
    }
  }, [editingRowId, onEditingChange]);

  // Modified start editing function
  const handleStartEdit = (session: Session) => {
    setEditingRowId(session.id);
    setEditingData({ ...session });

    // Initialize school selection
    const schoolOption = schoolsData.find(
      (school) => school.label === session.school
    );
    if (schoolOption) {
      setSelectedSchool(schoolOption.value);
    }

    // Initialize classroom selections based on current classrooms
    const classroomIds = session.classrooms
      .map((classroom) => {
        const match = classroomsData.find(
          (c) => c.label.split(" (")[0] === classroom.course
        );
        return match ? match.value : null;
      })
      .filter((id) => id !== null) as string[];

    setSelectedClassrooms(classroomIds);
  };

  // Update save function to call parent's onSave
  const handleSaveEdit = () => {
    if (editingData) {
      // Local updates to sessions...
      let updatedSessions;

      switch (activeTab) {
        case "Today":
          updatedSessions = todaySessions.map((session) =>
            session.id === editingRowId ? editingData : session
          );
          // If parent component provides save handler, call it
          if (onSave) {
            onSave();
          }
          break;
        case "Upcoming":
          updatedSessions = upcomingSessions.map((session) =>
            session.id === editingRowId ? editingData : session
          );
          // setUpcomingSessions(updatedSessions);
          break;
        case "Past":
          updatedSessions = pastSessions.map((session) =>
            session.id === editingRowId ? editingData : session
          );
          // setPastSessions(updatedSessions);
          break;
      }

      // Reset editing state
      setEditingRowId(null);
      setEditingData(null);
    }
  };

  // Update cancel function to call parent's onCancel
  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingData(null);

    // If parent component provides cancel handler, call it
    if (onCancel) {
      onCancel();
    }
  };

  // Update the onClick for tab buttons to notify parent
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab as "Today" | "Upcoming" | "Past");
    }
  };

  // Reset selections when switching tabs
  useEffect(() => {
    setSelectedIds([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [activeTab]);

  // Get the active tab color
  const getActiveTabColor = () => {
    const index = ["Today", "Upcoming", "Past"].indexOf(activeTab);
    return index === 0 ? "[#007778]" : index === 1 ? "[#2264AC]" : "purple-600";
  };

  // Update the SessionTable component to include checkbox functionality
  const renderTabContent = () => {
    const activeTabColor = getActiveTabColor();

    switch (activeTab) {
      case "Today":
        return (
          <SessionTable
            sessions={todaySessions}
            searchTerm={searchTerm}
            activeTabColor={activeTabColor}
            tabType="Today"
            selectedIds={selectedIds}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            allSelected={
              todaySessions.length > 0 &&
              todaySessions.every((session) => selectedIds.includes(session.id))
            }
            editingRowId={editingRowId}
            editingData={editingData}
            handleStartEdit={handleStartEdit}
            handleCancelEdit={handleCancelEdit}
            handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            // Add these missing props:
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
          />
        );
      case "Upcoming":
        return (
          <SessionTable
            sessions={upcomingSessions}
            searchTerm={searchTerm}
            activeTabColor={activeTabColor}
            tabType="Upcoming"
            selectedIds={selectedIds}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            allSelected={
              upcomingSessions.length > 0 &&
              upcomingSessions.every((session) =>
                selectedIds.includes(session.id)
              )
            }
            editingRowId={editingRowId}
            editingData={editingData}
            handleStartEdit={handleStartEdit}
            handleCancelEdit={handleCancelEdit}
            handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            // Add these missing props:
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
          />
        );
      case "Past":
        return (
          <SessionTable
            sessions={pastSessions}
            searchTerm={searchTerm}
            activeTabColor={activeTabColor}
            tabType="Past"
            selectedIds={selectedIds}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            allSelected={
              pastSessions.length > 0 &&
              pastSessions.every((session) => selectedIds.includes(session.id))
            }
            editingRowId={editingRowId}
            editingData={editingData}
            handleStartEdit={handleStartEdit}
            handleCancelEdit={handleCancelEdit}
            handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            // Add these missing props:
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
          />
        );
      default:
        return null;
    }
  };

  // Add this function - it's missing in your code
  const handleEditChange = (key: string, value: any) => {
    if (editingData) {
      if (key.includes(".")) {
        // Handle nested properties like 'classrooms.0.course'
        const parts = key.split(".");
        const updatedData = { ...editingData };

        if (parts.length === 3) {
          // For deep nested objects like observers.0.first_name
          const [parent, indexStr, child] = parts;
          const index = parseInt(indexStr, 10);

          if (
            parent in updatedData &&
            Array.isArray((updatedData as any)[parent]) &&
            (updatedData as any)[parent][index]
          ) {
            // Use 'as any' to bypass strict typing for dynamic access
            ((updatedData as any)[parent][index] as any)[child] = value;
          }
        }

        setEditingData(updatedData);
      } else {
        // Handle simple properties
        setEditingData({
          ...editingData,
          [key as keyof typeof editingData]: value,
        });
      }
    }
  };

  // Add this effect to reset local editing state when external state changes to false
  useEffect(() => {
    if (isEditingExternal === false && editingRowId !== null) {
      // External state was set to false, so we should exit edit mode
      setEditingRowId(null);
      setEditingData(null);
    }
  }, [isEditingExternal]);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex w-full">
          {["Today", "Upcoming", "Past"].map((tab, index) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => handleTabChange(tab)} // Updated to use new handler
              colorClass={
                activeTab === tab
                  ? tab === "Today"
                    ? "[#007778]"
                    : tab === "Upcoming"
                    ? "[#2264AC]"
                    : "[#6C4996]"
                  : "gray-200"
              }
              className="flex-1"
            >
              {tab === "Today"
                ? "Today's Sessions"
                : tab === "Upcoming"
                ? "Upcoming Sessions"
                : "Past Sessions"}
            </TabButton>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}
