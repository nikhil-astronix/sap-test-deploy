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
// import { Check, X } from "lucide-react";
import { getSchools } from "@/services/schoolService";
import { getClassroomsBySchool } from "@/services/classroomService";
import { getObservationTools } from "@/services/observationToolService";
import { getUser } from "@/services/userService";
import Dropdown from "@/components/ui/Dropdown";
import MultiSelect from "@/components/ui/MultiSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "../Tooltip";

// Update the Session interface to match the actual API response
interface Session {
  id: string;
  school: string;
  school_id?: string;
  classrooms: {
    id: string;
    course: string;
    teacher_name: string;
    grades: string[];
  }[];
  date: string;
  district?: string;
  start_time: string;
  end_time: string;
  observation_tool: string;
  observation_tool_id: string;
  observers: {
    id: string;
    first_name: string;
    last_name: string;
  }[];
  observer_ids: string[];
  session_admin: string;
  session_admin_id: string;
  status?: "scheduled" | "completed" | "cancelled"; // Optional as it might not be in the API
}

// interface SessionUpdatePayload {
// 	id: string;
// 	date: string;
// 	start_time: string;
// 	end_time: string;
// 	school: string;
// 	classrooms: string[];
// 	observation_tool: string;
// 	users: any[];
// 	session_admin: string;
// }

// Props for the SessionTables component
interface SessionTablesProps {
  todaySessions: Session[];
  upcomingSessions: Session[];
  pastSessions: Session[];
  onSelectionChange?: (selectedIds: string[]) => void; // Optional callback for selection changes
  onTabChange?: (tab: "Today" | "Upcoming" | "Past") => void;
  // Updated prop types for edit functions
  onEditingChange?: (isEditing: boolean, sessionData?: any) => void;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  isEditingExternal?: boolean; // Add this prop
  Loading?: boolean;
  pagination?: {
    Today: { page: number; perPage: number };
    Upcoming: { page: number; perPage: number };
    Past: { page: number; perPage: number };
  };
  onPageChange?: (tab: "Today" | "Upcoming" | "Past", page: number) => void;
  onRowsPerPageChange?: (
    tab: "Today" | "Upcoming" | "Past",
    perPage: number
  ) => void;
  onUpdateEditingData?: (data: any) => void; // Add this new prop
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
    className={`px-4 py-3 font-medium text-sm transition-colors relative rounded-[6px] ${
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
  // handleSaveEdit,
  handleEditChange,
  isEditingExternal,
  schoolsData,
  classroomsData,
  observationTools,
  usersData,
  selectedSchool,
  selectedClassrooms,
  isLoading,
  handleSchoolChange,
  handleClassroomChange,
  onPageChange,
  onRowsPerPageChange,
  currentPage: externalPage,
  rowsPerPage: externalRowsPerPage,
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
  // handleSaveEdit: () => void;
  handleEditChange: (key: string, value: any) => void;
  isEditingExternal?: boolean;
  schoolsData: any[];
  classroomsData: any[];
  observationTools: any[];
  usersData: any[];
  selectedSchool: string;
  selectedClassrooms: string[];
  isLoading: boolean;
  handleSchoolChange: (value: string) => void;
  handleClassroomChange: (values: string[]) => void;
  currentPage?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}) => {
  // Add the getLighterBgColor function here at the top of SessionTable component
  const getLighterBgColor = (colorClass: string) => {
    switch (colorClass) {
      case "[#007778]":
        return "#F0FFFF"; // Light teal for Today tab
      case "[#2264AC]":
        return "#F3F8FF"; // Light blue for Upcoming tab
      case "[#6C4996]":
        return "#F9F5FF"; // Light purple for Past tab
      default:
        return "#F5F5F5"; // Default light gray
    }
  };

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
        return "#6C4996"; // Fix: Remove brackets from the purple color
      default:
        return "#ffffff"; // Also fix typo in default color (had 6 Fs)
    }
  };

  // Add these state variables inside SessionTable function
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  // Add these handler functions inside SessionTable function
  const handlePageChange = (page: number) => {
    // You might want to notify the parent component to fetch data for this page
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);
    handlePageChange(1); // Reset to first page when changing rows per page

    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  // Add these calculations after state variables in SessionTable function
  useEffect(() => {
    // Update total count when sessions change
    setTotalCount(filteredSessions.length);
  }, [filteredSessions]);

  // Calculate pagination values
  const totalPages = Math.ceil(totalCount / (externalRowsPerPage ?? 10));
  const startIndex = ((externalPage ?? 1) - 1) * (externalRowsPerPage ?? 10);
  const endIndex = Math.min(
    startIndex + (externalRowsPerPage ?? 10),
    totalCount
  );
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  console.log("classroomdataaaaa", classroomsData);

  return (
    <div className="rounded-[6px] border border-gray-200 shadow-sm">
      <div className="overflow-x-auto rounded-[6px]">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: getHeaderBgColor(activeTabColor) }}>
              {/* Checkbox column - only show if not Today tab */}
              {tabType !== "Today" && (
                <th className="w-[50px] px-4 py-3 text-center whitespace-nowrap border-r-2 border-gray-200">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 appearance-none border border-white rounded-sm checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:items-center checked:after:justify-center"
                    style={{
                      backgroundColor: allSelected
                        ? activeTabColor === "[#007778]"
                          ? "#007778"
                          : activeTabColor === "[#2264AC]"
                          ? "#2264AC"
                          : "#6C4996"
                        : "transparent",
                    }}
                  />
                </th>
              )}

              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <GraduationCap size={25} className="pr-1" />
                  <span>School</span>
                </div>
              </th>
              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <ChalkboardTeacher size={25} className="pr-1" />
                  <span>Classroom</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <CalendarDots size={25} className="pr-1" />
                  <span>Date</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <Clock size={25} className="pr-1" />
                  <span>Start Time</span>
                </div>
              </th>
              <th className="min-w-[120px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center  w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <Clock size={25} className="pr-1" />
                  <span>End Time</span>
                </div>
              </th>
              <th className="min-w-[200px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <ChartBar size={25} className="pr-1" />
                  <span>Observation Tool</span>
                </div>
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <Users size={25} className="pr-1" />
                  <span>Observers</span>
                </div>
              </th>
              <th className="min-w-[150px] px-4 py-3 text-left whitespace-nowrap font-medium border-r-2 border-gray-200">
                <div className="flex items-center w-full text-[14px]  font-semibold text-[#F9F5FF]">
                  <UserGear size={25} className="pr-1" />
                  <span>Session Admin</span>
                </div>
              </th>

              {/* Only show action column for Today and Upcoming tabs */}
              {showActions && (
                <th
                  className="w-[100px] min-w-[100px] text-center text-[12px] font-normal text-[#F9F5FF] sticky right-0 z-30 border-l-2 border-gray-200 px-2 py-3"
                  style={{
                    backgroundColor: getHeaderBgColor(activeTabColor),
                    boxShadow: "inset 1px 0 0 #D4D4D4",
                  }}
                >
                  <div className="flex justify-center items-center space-x-2">
                    <ArrowDownRight size={20} />
                    <span className="text-[14px]  font-semibold text-white ">
                      Action
                    </span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedSessions.map((session, index) => {
              // Check both editingRowId and isEditingExternal
              const isEditing =
                session.id === editingRowId && isEditingExternal === true;
              const rowBgColor =
                index % 2 === 1 ? getLighterBgColor(activeTabColor) : "#fff";

              return (
                <tr
                  key={session.id}
                  style={{
                    backgroundColor: rowBgColor,
                  }}
                  className={`border-b border-gray-200 ${
                    isEditing
                      ? "shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative z-10"
                      : ""
                  }`}
                >
                  {/* Checkbox cell - only show if not Today tab */}
                  {tabType !== "Today" && (
                    <td className="w-[50px] px-4 py-4 text-center border-r-2 border-[#D4D4D4]">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(session.id)}
                        onChange={(e) =>
                          handleSelect(session.id, e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`w-4 h-4 rounded border-gray-300 border-2 ${
                          activeTabColor === "[#007778]"
                            ? "accent-[#007778]"
                            : activeTabColor === "[#2264AC]"
                            ? "accent-[#2264AC] bg-[#2264AC]"
                            : "accent-[#6C4996] bg-[#6C4996]"
                        }`}
                        disabled={isEditing}
                      />
                    </td>
                  )}

                  {/* School - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
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

                  {/* Classroom Course - always editable when in edit mode */}
                  <td className="px-3 py-3 whitespace-nowrap border-r-2 border-[#D4D4D4]">
                    <div className="text-sm text-gray-900">
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
                          showSlectedOptions={true}
                        />
                      ) : // Display all classroom courses when not editing
                      session.classrooms.length > 1 ? (
                        <Tooltip
                          content={
                            <div className="flex flex-col space-y-1">
                              {session.classrooms.map((classroom, idx) => (
                                <div key={idx}>
                                  {classroom.course ?? `Classroom ${idx + 1}`}
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                            <span className="truncate max-w-[150px]">
                              {session.classrooms[0].course}
                            </span>
                            {session.classrooms.length > 1 && (
                              <span className="text-blue-700 ml-1 cursor-pointer">
                                +{session.classrooms.length - 1} more
                              </span>
                            )}
                          </div>
                        </Tooltip>
                      ) : session.classrooms.length === 1 ? (
                        <div className="text-sm text-gray-900">
                          {session.classrooms[0].course}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </td>

                  {/* Date - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
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

                  {/* Start Time - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
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

                  {/* End Time - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
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

                  {/* Observation Tool - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
                      <Dropdown
                        options={observationTools.map((tool) => ({
                          value: tool.value,
                          label: tool.label,
                        }))}
                        value={editingData?.observation_tool_id || ""}
                        onChange={(value) => {
                          const selectedTool = observationTools.find(
                            (t) => t.value === value
                          );
                          handleEditChange("observation_tool_id", value);
                          handleEditChange(
                            "observation_tool",
                            selectedTool?.label || ""
                          );
                        }}
                        placeholder="Select observation tool"
                        className="w-full px-2 py-1 bg-[#F4F6F8] focus:bg-white"
                      />
                    ) : (
                      session.observation_tool
                    )}
                  </td>

                  {/* Observers - always editable when in edit mode */}
                  <td className="px-3 py-3 whitespace-nowrap border-r-2 border-[#D4D4D4]">
                    {isEditing ? (
                      <div className="text-sm text-gray-900">
                        <MultiSelect
                          options={usersData.map((user) => ({
                            value: user.value,
                            label: `${user.first_name} ${user.last_name}`,
                          }))}
                          values={editingData?.observer_ids || []}
                          onChange={(selectedUserIds) => {
                            const selectedObservers = selectedUserIds.map(
                              (id) => {
                                const user = usersData.find(
                                  (u) => u.value === id
                                );
                                return {
                                  id: id,
                                  first_name: user?.first_name || "",
                                  last_name: user?.last_name || "",
                                };
                              }
                            );

                            handleEditChange("observer_ids", selectedUserIds);
                            handleEditChange("observers", selectedObservers);
                          }}
                          placeholder="Select observers"
                          className="w-64 bg-[#F4F6F8]"
                          showSelectedTags={false}
                          showSlectedOptions={true}
                        />
                      </div>
                    ) : // When not editing, display the observers as before
                    session.observers.length > 1 ? (
                      <Tooltip
                        content={
                          <div className="flex flex-col space-y-1">
                            {session.observers.map((observer, idx) => (
                              <div key={idx}>
                                {observer.first_name} {observer.last_name}
                              </div>
                            ))}
                          </div>
                        }
                      >
                        <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                          <span className="truncate max-w-[150px]">
                            {session.observers[0].first_name}{" "}
                            {session.observers[0].last_name}
                          </span>
                          {session.observers.length > 1 && (
                            <span className="text-blue-700 ml-1 cursor-pointer">
                              +{session.observers.length - 1} more
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    ) : session.observers.length === 1 ? (
                      <div className="text-sm text-gray-900">
                        {session.observers[0].first_name}{" "}
                        {session.observers[0].last_name}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </td>

                  {/* Session Admin - read-only in Today tab when editing */}
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 border-r-2 border-[#D4D4D4]">
                    {isEditing && tabType !== "Today" ? (
                      <Dropdown
                        options={usersData
                          .filter((user) =>
                            editingData?.observer_ids?.includes(user.value)
                          )
                          .map((user) => ({
                            value: user.value,
                            label: `${user.first_name} ${user.last_name}`,
                          }))}
                        value={editingData?.session_admin_id || ""}
                        onChange={(value) => {
                          const selectedUser = usersData.find(
                            (u) => u.value === value
                          );
                          handleEditChange("session_admin_id", value);
                          handleEditChange(
                            "session_admin",
                            selectedUser
                              ? `${selectedUser.first_name} ${selectedUser.last_name}`
                              : ""
                          );
                        }}
                        placeholder={
                          (editingData?.observer_ids?.length || 0) > 0
                            ? "Select session admin"
                            : "Select observers first"
                        }
                        className="w-full px-2 py-1 bg-[#F4F6F8] focus:bg-white"
                        disabled={
                          (editingData?.observer_ids?.length || 0) === 0
                        }
                      />
                    ) : (
                      session.session_admin
                    )}
                  </td>

                  {/* Action column */}
                  {showActions && (
                    <td className="w-[100px] min-w-[100px] text-center sticky right-0 border-l-2 border-gray-400 px-2 py-3 z-30 bg-white">
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

      <div className="flex flex-wrap items-center justify-between py-2 px-4 gap-y-2 border-t border-gray-200">
        <div>
          {totalCount > 0 && (
            <p className="text-sm text-gray-500">
              {startIndex + 1}-
              {Math.min(startIndex + (externalRowsPerPage ?? 10), totalCount)}{" "}
              of {totalCount}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <select
              value={externalRowsPerPage}
              onChange={handleRowsPerPageChange}
              className="text-sm  px-2 py-1"
              disabled={false} // Set to your loading state if available
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
              onClick={() => handlePageChange((externalPage ?? 1) - 1)}
              disabled={externalPage === 1}
              className={`p-1 border rounded ${
                externalPage === 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-500 px-1">
              {externalPage}/{totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange((externalPage ?? 1) + 1)}
              disabled={externalPage === totalPages || totalPages === 0}
              className={`p-1 border rounded ${
                externalPage === totalPages || totalPages === 0
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
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onUpdateEditingData, // Add this prop
}: SessionTablesProps) {
  // Existing state variables...
  const [activeTab, setActiveTab] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Session | null>(null);

  // States for dropdown data
  const [schoolsData, setSchoolsData] = useState<any[]>([]);
  const [classroomsData, setClassroomsData] = useState<any[]>([]);
  const [observationTools, setObservationTools] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add loading and error states
  const [schoolsLoading, setSchoolsLoading] = useState<boolean>(false);
  const [classroomsLoading, setClassroomsLoading] = useState<boolean>(false);
  const [toolsLoading, setToolsLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  const [schoolsError, setSchoolsError] = useState<string | null>(null);
  const [classroomsError, setClassroomsError] = useState<string | null>(null);
  const [toolsError, setToolsError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Fetch schools data for dropdown
  const fetchSchools = async () => {
    setSchoolsLoading(true);
    setSchoolsError(null);

    try {
      const districtId = localStorage.getItem("globalDistrict");
      const requestPayload = {
        is_archived: false,
        district_id: districtId || "",
        sort_by: "name",
        sort_order: "asc",
        curr_page: 1,
        per_page: 100,
        search: null,
      };

      const response = await getSchools(requestPayload);

      if (response.data && response.data.schools) {
        // Transform the response to match dropdown format
        const formattedSchools = response.data.schools.map((school: any) => ({
          value: school.id,
          label: school.name,
        }));

        setSchoolsData(formattedSchools);
      } else {
        console.error("API returned unexpected response format:", response);
        setSchoolsData([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch schools";
      setSchoolsError(errorMessage);
      console.error("Error fetching schools:", error);
      setSchoolsData([]);
    } finally {
      setSchoolsLoading(false);
    }
  };

  // Fetch classrooms data when a school is selected
  const fetchClassroomsData = async (schoolId: string) => {
    if (!schoolId) {
      setClassroomsData([]);
      return;
    }

    setClassroomsLoading(true);
    setClassroomsError(null);

    try {
      const response = await getClassroomsBySchool(schoolId);

      if (response.success && response.data) {
        // Transform the response to match dropdown format
        const formattedClassrooms = response.data.map((classroom: any) => ({
          value: classroom.id,
          label: `${classroom.course} (${classroom.id})`,
        }));

        setClassroomsData(formattedClassrooms);
      } else {
        console.error("API returned unsuccessful response:", response);
        setClassroomsData([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch classrooms";
      setClassroomsError(errorMessage);
      console.error("Error fetching classrooms:", error);
      setClassroomsData([]);
    } finally {
      setClassroomsLoading(false);
    }
  };

  // Fetch observation tools data
  const fetchObservationTools = async () => {
    setToolsLoading(true);
    setToolsError(null);

    try {
      const response = await getObservationTools({
        is_archived: false,
        sort_by: "name",
        sort_order: "asc",
        curr_page: 1,
        per_page: 100,
        search: null,
      });

      if (response.data && response.data.observation_tools) {
        // Transform the response to match dropdown format
        const formattedTools = response.data.observation_tools.map(
          (tool: any) => ({
            value: tool.id,
            label: tool.name || "Untitled Observation Tool",
          })
        );

        setObservationTools(formattedTools);
      } else {
        console.error("API returned unexpected response format:", response);
        setObservationTools([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch observation tools";
      setToolsError(errorMessage);
      console.error("Error fetching observation tools:", error);
      setObservationTools([]);
    } finally {
      setToolsLoading(false);
    }
  };

  // Fetch users data for observers and admin dropdowns
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const requestPayload = {
        is_archived: false,
        sort_by: "first_name",
        sort_order: "asc",
        curr_page: 1,
        per_page: 100,
        search: null,
      };

      const response = await getUser(requestPayload);

      if (response.data && response.data.users) {
        // Transform the response to match dropdown format
        const formattedUsers = response.data.users.map((user: any) => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name} (${user.email})`,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }));

        setUsersData(formattedUsers);
      } else {
        console.error("API returned unexpected response format:", response);
        setUsersData([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      setUsersError(errorMessage);
      console.error("Error fetching users:", error);
      setUsersData([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Call fetch functions when component mounts
  useEffect(() => {
    fetchSchools();
    fetchObservationTools();
    fetchUsers();
  }, []);

  // Update the handleSchoolChange to fetch classrooms when a school is selected
  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setSelectedClassrooms([]);

    // Fetch classrooms for the selected school
    fetchClassroomsData(schoolId);

    // Update the editing data with the new school
    if (editingData) {
      const schoolName =
        schoolsData.find((school) => school.value === schoolId)?.label || "";
      setEditingData({
        ...editingData,
        school: schoolName,
      });
    }
  };

  // Modified start editing function to fetch necessary data and properly format classrooms
  const handleStartEdit = async (session: Session) => {
    // Set the ID of the row being edited
    setEditingRowId(session.id);
    console.log("session------", session);
    // Find school ID from name for dropdown selection
    // const schoolOption = schoolsData.find(
    //   (school) => school.label === session.school
    // );
    const schoolId = session.school_id ?? ""; //schoolOption ? schoolOption.value : "";

    // Set the selected school state
    setSelectedSchool(schoolId);

    try {
      setIsLoading(true);
      await fetchClassroomsData(schoolId);

      // Extract classroom IDs from the session's classrooms
      const classroomIds = session.classrooms
        .map((classroom: any) => (classroom.id ? classroom.id : ""))
        .filter((id: string) => id !== "");

      // Set the selectedClassrooms state for the dropdowns
      setSelectedClassrooms(classroomIds);

      // Map observers to IDs for dropdown selection
      const observerIds = session.observers
        .map((observer) => {
          const user = usersData.find(
            (u) =>
              u.first_name === observer.first_name &&
              u.last_name === observer.last_name
          );
          return user ? user.value : "";
        })
        .filter((id) => id !== "");

      // Ensure classrooms have the proper object structure
      const formattedClassrooms = session.classrooms.map((classroom) => {
        // Return existing classroom object if it has the required structure
        if (classroom.id && classroom.course) {
          return classroom;
        }

        // If not, create a properly structured classroom object
        return {
          id: classroom.id || "", // Use ID if available
          course:
            typeof classroom === "string" ? classroom : classroom.course || "",
          teacher_name: classroom.teacher_name || "Not specified",
          grades: classroom.grades || [],
        };
      });

      // Create a clean edit data object with all necessary IDs
      const editData = {
        ...session,
        observer_ids: observerIds,
        school_id: schoolId,
        classrooms: formattedClassrooms,
      };

      // Log the data before passing it to parent
      console.log("Edit data prepared:", editData);

      // Set the local editing data state
      setEditingData(editData);

      // Notify parent component about editing state change
      if (onEditingChange) {
        onEditingChange(true, editData);
      }
    } catch (error) {
      console.error("Error preparing edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle selecting/deselecting an individual session
  const handleSelect = (sessionId: string, isSelected: boolean) => {
    let newSelectedIds;

    if (isSelected) {
      // Add the ID if it's not already selected
      newSelectedIds = [...selectedIds, sessionId];
    } else {
      // Remove the ID if it's selected
      newSelectedIds = selectedIds.filter((id) => id !== sessionId);
    }

    setSelectedIds(newSelectedIds);

    // Notify parent component if callback provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  // Function to handle selecting/deselecting all sessions
  const handleSelectAll = (checked: boolean) => {
    let newSelectedIds: string[] = [];

    if (checked) {
      // Get the appropriate sessions based on active tab
      const currentSessions =
        activeTab === "Today"
          ? todaySessions
          : activeTab === "Upcoming"
          ? upcomingSessions
          : pastSessions;

      // Select all sessions in the current tab
      newSelectedIds = currentSessions.map((session) => session.id);
    }

    setSelectedIds(newSelectedIds);

    // Notify parent component if callback provided
    if (onSelectionChange) {
      onSelectionChange(newSelectedIds);
    }
  };

  // Update save function to call parent's onSave with the latest data
  // const handleSaveEdit = () => {
  // 	console.log(
  // 		"handleSaveEdit called with editingData in tabcomponents:",
  // 		editingData
  // 	);

  // 	if (editingData) {
  // 		// Create a properly structured object that matches what your API expects
  // 		const updateData = {
  // 			id: ,
  // 			date: editingData.date,
  // 			start_time: editingData.start_time,
  // 			end_time: editingData.end_time,
  // 			// Include both formats for flexibility
  // 			school: selectedSchool,
  // 			school_id: selectedSchool,
  // 			// Include both formats for classrooms
  // 			classrooms: selectedClassrooms,
  // 			classroom_ids: selectedClassrooms,
  // 			// Include all required fields with proper naming
  // 			observation_tool:
  // 				editingData.observation_tool || editingData.observation_tool_id || "",
  // 			users: editingData.observer_ids || [],
  // 			observer_ids: editingData.observer_ids || [],
  // 			session_admin:
  // 				editingData.session_admin || editingData.session_admin_id || "",
  // 			session_admin_id: editingData.session_admin_id || "",
  // 		};

  // 		// Add debugging to see what's being sent

  // 		// Call the parent's onSave function with the properly structured data
  // 		if (onSave) {
  // 			console.log("Child component sending data to parent:", updateData);
  // 			onSave(updateData);
  // 		}

  // 		// Reset local states
  // 		setEditingRowId(null);
  // 		setEditingData(null);
  // 		setSelectedSchool("");
  // 		setSelectedClassrooms([]);
  // 	}
  // };

  // Add this function after handleSchoolChange in your SessionTables component
  const handleClassroomChange = (classroomIds: string[]) => {
    // Update selected classrooms state
    setSelectedClassrooms(classroomIds);

    // Update editing data with new classrooms
    if (editingData) {
      // Get the selected classroom details from the classroomsData array
      const selectedClassroomEntries = classroomIds.map((classroomId) => {
        const classroomOption = classroomsData.find(
          (c) => c.value === classroomId
        );

        // Extract just the course name (removing the ID in parentheses)
        const courseName = classroomOption
          ? classroomOption.label.split(" (")[0]
          : "Unknown Course";

        return {
          id: classroomId, // Add the ID property
          course: courseName,
          teacher_name: "Not specified",
          grades: [], // Initialize with empty array
        };
      });

      // Update the editingData with complete classroom objects
      const updatedData = {
        ...editingData,
        classrooms: selectedClassroomEntries,
      };

      setEditingData(updatedData);

      // Also notify parent component
      if (onUpdateEditingData) {
        onUpdateEditingData(updatedData);
      }
    }
  };

  // Update cancel function to call parent's onCancel
  const handleCancelEdit = () => {
    // Reset local state
    setEditingRowId(null);
    setEditingData(null);
    setSelectedSchool("");
    setSelectedClassrooms([]);

    // Call parent's onCancel
    if (onCancel) {
      onCancel();
    }
  };

  // Update handleEditChange to also pass changes to parent if needed
  const handleEditChange = (key: string, value: any) => {
    if (editingData) {
      // Create a copy of the current data
      let updatedData = { ...editingData };

      // Handle different field updates
      if (key.includes(".")) {
        // Handle nested properties like 'classrooms.0.course'
        const parts = key.split(".");

        if (parts.length === 3) {
          // For deep nested objects like observers.0.first_name
          const [parent, index, child] = parts;
          (updatedData as any)[parent][parseInt(index)][child] = value;
        }
      } else if (key === "observer_ids") {
        // Special handling for observer_ids to keep observers array in sync
        const selectedObservers = value.map((id: string) => {
          // Find the matching user from usersData
          const user = usersData.find((u) => u.value === id);
          return {
            id: id,
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
          };
        });

        // Update both arrays to keep them in sync
        updatedData.observer_ids = value;
        updatedData.observers = selectedObservers;
      } else {
        // Handle simple properties
        updatedData = {
          ...editingData,
          [key]: value,
        };
      }

      // If updating observers directly, also update observer_ids
      if (key === "observers") {
        updatedData.observer_ids = value.map((observer: any) => observer.id);
      }

      // Transform the data to match API format (but preserve original structure)
      const formattedData = {
        ...updatedData,
        date: formatDateToAPIFormat(updatedData.date),
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
        district: updatedData.district || "",
        school: updatedData.school_id || updatedData.school,
        // Keep the full classroom objects
        classrooms: updatedData.classrooms || [],
        // Add a separate property for just the IDs when needed for API calls
        classroom_ids: updatedData.classrooms?.map((c: any) => c.id) || [],
        observation_tool:
          updatedData.observation_tool_id || updatedData.observation_tool,
        // Ensure observer_ids always matches observers
        observer_ids:
          updatedData.observers?.map((observer: any) => observer.id) || [],
        users: updatedData.observers?.map((observer: any) => observer.id) || [],
        session_admin:
          updatedData.session_admin_id || updatedData.session_admin,
      };

      setEditingData(formattedData);
      console.log("Updated editing data to match API format:", formattedData);
    }
  };

  // Helper function to format dates consistently for API - fixed for timezone issues
  const formatDateToAPIFormat = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        // Use direct year/month/day extraction instead of toISOString() to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      return dateString;
    } catch {
      return dateString;
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

  // Add this handleTabChange function to manage tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedIds([]); // Reset selections when changing tabs

    // Cancel any ongoing editing when switching tabs
    if (editingRowId) {
      handleCancelEdit();
    }

    // Notify parent component if callback provided
    if (onTabChange) {
      onTabChange(tab as "Today" | "Upcoming" | "Past");
    }
  };

  // Add the missing renderTabContent function
  const renderTabContent = () => {
    const activeTabColor =
      activeTab === "Today"
        ? "[#007778]"
        : activeTab === "Upcoming"
        ? "[#2264AC]"
        : "[#6C4996]";

    // Get current pagination values based on active tab
    const currentTab = activeTab as "Today" | "Upcoming" | "Past";
    const currentPage = pagination?.[currentTab]?.page || 1;
    const rowsPerPage = pagination?.[currentTab]?.perPage || 10;

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
            // handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            observationTools={observationTools}
            usersData={usersData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={Loading || isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={(page) => onPageChange?.(currentTab, page)}
            onRowsPerPageChange={(rows) =>
              onRowsPerPageChange?.(currentTab, rows)
            }
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
            // handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            observationTools={observationTools}
            usersData={usersData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={Loading || isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={(page) => onPageChange?.(currentTab, page)}
            onRowsPerPageChange={(rows) =>
              onRowsPerPageChange?.(currentTab, rows)
            }
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
            // handleSaveEdit={handleSaveEdit}
            handleEditChange={handleEditChange}
            isEditingExternal={isEditingExternal}
            schoolsData={schoolsData}
            classroomsData={classroomsData}
            observationTools={observationTools}
            usersData={usersData}
            selectedSchool={selectedSchool}
            selectedClassrooms={selectedClassrooms}
            isLoading={Loading || isLoading}
            handleSchoolChange={handleSchoolChange}
            handleClassroomChange={handleClassroomChange}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={(page) => onPageChange?.(currentTab, page)}
            onRowsPerPageChange={(rows) =>
              onRowsPerPageChange?.(currentTab, rows)
            }
          />
        );
      default:
        return null;
    }
  };

  // Add an effect to send editing data back to parent
  useEffect(() => {
    if (editingData && onUpdateEditingData) {
      onUpdateEditingData(editingData);
    }
  }, [editingData, onUpdateEditingData]);

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
