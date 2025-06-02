"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NetworkHeader from "@/components/network/NetworkHeader";
import SessionTables from "@/components/observation/Tabcomponents";
import { Trash2 } from "lucide-react";
import { ClockClockwise, Info, Archive } from "@phosphor-icons/react/dist/ssr";
import {
  getSessions,
  archiveSessions,
  restoreSessions,
  deleteSessions,
  editSession,
} from "@/services/obersvation-sessionservice";

export default function ObservationSessionsPage() {
  // Example data following the API structure
  const [todaySessions, setTodaySessions] = useState([
    {
      id: "1",
      school: "Lincoln High School",
      classrooms: [
        {
          course: "Math 101",
          teacher_name: "Mr. Johnson",
          grades: ["9", "10"],
        },
      ],
      date: "May 28, 2025",
      start_time: "9:00 AM",
      end_time: "10:30 AM",
      observation_tool: "Classroom Assessment Tool",
      observers: [
        {
          first_name: "John",
          last_name: "Doe",
        },
        {
          first_name: "Jane",
          last_name: "Smith",
        },
      ],
      session_admin: "Principal Johnson",
      status: "scheduled",
    },
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: "1",
      school: "Lincoln School",
      classrooms: [
        {
          course: "Math 101",
          teacher_name: "Mr. Johnson",
          grades: ["9", "10"],
        },
      ],
      date: "May 28, 2025",
      start_time: "9:00 AM",
      end_time: "10:30 AM",
      observation_tool: "Classroom Assessment Tool",
      observers: [
        {
          first_name: "John",
          last_name: "Doe",
        },
        {
          first_name: "Jane",
          last_name: "Smith",
        },
      ],
      session_admin: "Principal Johnson",
      status: "scheduled",
    },
  ]);

  const [pastSessions, setPastSessions] = useState([
    {
      id: "1",
      school: "Lincoln High",
      classrooms: [
        {
          course: "Math 101",
          teacher_name: "Mr. Johnson",
          grades: ["9", "10"],
        },
      ],
      date: "May 28, 2025",
      start_time: "9:00 AM",
      end_time: "10:30 AM",
      observation_tool: "Classroom Assessment Tool",
      observers: [
        {
          first_name: "John",
          last_name: "Doe",
        },
        {
          first_name: "Jane",
          last_name: "Smith",
        },
      ],
      session_admin: "Principal Johnson",
      status: "scheduled",
    },
  ]);

  // State management
  const [sessionAvailable, setSessionAvailable] = useState(true); // Simulating session availability
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Past">(
    "Today"
  );
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Function to check if any items are selected
  const hasSelectedItems = () => {
    return selectedSessions.length > 0;
  };

  const getSelectedItemsInfo = (): string[] => {
    // Get sessions from the current active tab
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

    const allSessions = [
      ...todaySessions,
      ...upcomingSessions,
      ...pastSessions,
    ];
    const items: string[] = [];

    // For each selected ID, find the corresponding session and format its info
    selectedSessions.forEach((sessionId) => {
      const session = allSessions.find((s) => s.id === sessionId);

      if (session) {
        // Get all classroom courses concatenated
        const courses = session.classrooms
          .map((classroom) => classroom.course)
          .join(", ");

        // Format: "School - Classroom Courses - Admin"
        items.push(`${session.school} - ${courses} - ${session.session_admin}`);
      }
    });

    return items;
  };

  // Fetch sessions on component mount and when active/search changes
  useEffect(() => {
    fetchSessions();
  }, [active, search]);

  const fetchSessions = async () => {
    setIsLoading(true);

    try {
      // Fetch sessions based on the 'active' state (archived or not)
      const requestPayload = {
        is_archived: active,
        sort_by: "date",
        sort_order: "asc",
        curr_page: 1,
        per_page: 100,
        search: search || null,
        time: null, // We'll get all and distribute by time category
      };

      const response = await getSessions(requestPayload);

      if (response.success && response.data) {
        // Process sessions by category - exact implementation depends on API response structure
        const sessionData = response.data.sessions || [];
        setSessionAvailable(sessionData.length > 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySessions = sessionData.filter((session: any) => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === today.getTime();
        });

        const upcomingSessions = sessionData.filter((session: any) => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate > today;
        });

        const pastSessions = sessionData.filter((session: any) => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate < today;
        });

        // Update state
        setTodaySessions(todaySessions);
        setUpcomingSessions(upcomingSessions);
        setPastSessions(pastSessions);
      } else {
        console.error("Failed to fetch sessions:", response.error);
        // toast.error("Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      // toast.error("Failed to fetch sessions");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for archiving sessions
  const handleArchive = async () => {
    if (selectedSessions.length === 0) return;

    try {
      // Show loading state
      setIsLoading(true);

      // Make API call to archive sessions
      const response = await archiveSessions({ ids: selectedSessions });

      if (response.success) {
        // Update local state - remove archived sessions from the visible list
        let updatedSessions;
        switch (activeTab) {
          case "Today":
            updatedSessions = todaySessions.filter(
              (session) => !selectedSessions.includes(session.id)
            );
            setTodaySessions(updatedSessions);
            break;
          case "Upcoming":
            updatedSessions = upcomingSessions.filter(
              (session) => !selectedSessions.includes(session.id)
            );
            setUpcomingSessions(updatedSessions);
            break;
          default:
            break;
        }

        // Show success message
        console.log("Sessions archived successfully");
        // toast.success("Sessions archived successfully");
      } else {
        // Handle API error response
        console.error("Failed to archive sessions:", response.error);
        // toast.error("Failed to archive sessions");
      }

      // Reset selection and close modal
      setSelectedSessions([]);
      setShowArchiveModal(false);
    } catch (error) {
      console.error("Error archiving sessions:", error);
      // Show error message
      // toast.error("Failed to archive sessions");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for restoring sessions
  const handleRestore = async () => {
    if (selectedSessions.length === 0) return;

    try {
      // Show loading state
      setIsLoading(true);

      // Make API call to restore sessions
      const response = await restoreSessions({ ids: selectedSessions });

      if (response.success) {
        // After successful restore, fetch updated sessions
        await fetchSessions();

        // Show success message
        console.log("Sessions restored successfully");
        // toast.success("Sessions restored successfully");
      } else {
        // Handle API error response
        console.error("Failed to restore sessions:", response.error);
        // toast.error("Failed to restore sessions");
      }

      // Reset selection and close modal
      setSelectedSessions([]);
      setShowRestoreModal(false);
    } catch (error) {
      console.error("Error restoring sessions:", error);
      // Show error message
      // toast.error("Failed to restore sessions");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting sessions
  const handleDelete = async () => {
    if (selectedSessions.length === 0) return;

    try {
      // Show loading state
      setIsLoading(true);

      // Make API call to delete sessions
      const response = await deleteSessions({ ids: selectedSessions });

      if (response.success) {
        // Update local state - remove deleted sessions from all lists
        let updatedSessions;
        switch (activeTab) {
          case "Today":
            updatedSessions = todaySessions.filter(
              (session) => !selectedSessions.includes(session.id)
            );
            setTodaySessions(updatedSessions);
            break;
          case "Upcoming":
            updatedSessions = upcomingSessions.filter(
              (session) => !selectedSessions.includes(session.id)
            );
            setUpcomingSessions(updatedSessions);
            break;
          case "Past":
            updatedSessions = pastSessions.filter(
              (session) => !selectedSessions.includes(session.id)
            );
            setPastSessions(updatedSessions);
            break;
          default:
            break;
        }

        // Show success message
        console.log("Sessions deleted successfully");
        // toast.success("Sessions deleted successfully");
      } else {
        // Handle API error response
        console.error("Failed to delete sessions:", response.error);
        // toast.error("Failed to delete sessions");
      }

      // Reset selection and close modal
      setSelectedSessions([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting sessions:", error);
      // Show error message
      // toast.error("Failed to delete sessions");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handler for editing state changes from SessionTables
  const handleEditingChange = (editing: boolean, data = null) => {
    setIsEditing(editing);
    if (data) {
      setEditingData(data);
    }
  };

  // Updated handler for save button in NetworkHeader
  const handleSaveEdit = async () => {
    if (!editingData) {
      console.log("No data to save");
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);

      // Call the edit session API
      const response = await editSession(editingData?.id, editingData);

      if (response.success) {
        console.log("Session updated successfully");
        // toast.success("Session updated successfully");

        // Refresh the sessions list
        await fetchSessions();
      } else {
        console.error("Failed to update session:", response.error);
        // toast.error("Failed to update session");
      }

      // Reset editing state
      setIsEditing(false);
      setEditingData(null);
    } catch (error) {
      console.error("Error updating session:", error);
      // toast.error("Failed to update session");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handler for cancel button in NetworkHeader
  const handleCancelEdit = () => {
    console.log("Cancel edit");
    // Force the SessionTables component to exit edit mode
    setIsEditing(false);
    setEditingData(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 bg-white rounded-lg border p-6 shadow-md">
      {sessionAvailable ? (
        // Active sessions when available
        <>
          {showArchiveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-[6px] p-6 max-w-xl w-full mx-4 transform transition-all duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Archive className="text-gray-600" size={24} />
                  <h2 className="text-[16px] text-black font-medium">
                    Archive
                  </h2>
                </div>

                {/* Description */}
                <p className="text-left text-black-400 text-[14px] mb-4 ">
                  {getSelectedItemsInfo().length === 0
                    ? "Please select sessions to archive."
                    : `Are you sure you want to archive ${
                        getSelectedItemsInfo().length === 1
                          ? "this Session?"
                          : "these Sessions?"
                      }`}
                </p>

                {/* Selected Sessions Display */}
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
                        <div className="text-[12px] text-right">Session</div>
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
                  <p className="text-left text-sm text-[#C23E19] mt-2">
                    {getSelectedItemsInfo().length === 0
                      ? "No sessions selected. Please select at least one session to archive."
                      : ` All users, tools or ${
                          getSelectedItemsInfo().length === 1
                            ? "session"
                            : "sessions"
                        } connected to ${
                          getSelectedItemsInfo().length === 1
                            ? "this session"
                            : "these sessions"
                        } will no longer be accessible.`}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowArchiveModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleArchive}
                    disabled={getSelectedItemsInfo().length === 0 || isLoading}
                    className={`px-4 py-2 ${
                      getSelectedItemsInfo().length === 0 || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#B4351C] hover:bg-[#943015]"
                    } text-white rounded-[6px] transition-colors`}
                  >
                    {isLoading ? "Processing..." : "Archive"}
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
                  <h2 className="text-[16px] text-black font-medium">
                    Restore
                  </h2>
                </div>

                {/* Description */}
                <p className="text-left text-black-400 text-[14px] mb-4">
                  {getSelectedItemsInfo().length === 0
                    ? "Please select sessions to restore."
                    : `Are you sure you want to restore ${
                        getSelectedItemsInfo().length === 1
                          ? "this Session?"
                          : "these Sessions?"
                      }`}
                </p>

                {/* Selected Sessions Display */}
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
                        <div className="text-[12px] text-right">Session</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Information Box */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 mt-[10px]">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" weight="fill" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">Note</p>
                    </div>
                  </div>
                  <p className="text-left text-sm mt-2">
                    {getSelectedItemsInfo().length === 0
                      ? "No sessions selected. Please select at least one session to restore."
                      : `Restoring ${
                          getSelectedItemsInfo().length === 1
                            ? "this session"
                            : "these sessions"
                        } will make ${
                          getSelectedItemsInfo().length === 1 ? "it" : "them"
                        } active again. ${
                          getSelectedItemsInfo().length === 1 ? "It" : "They"
                        } will become accessible for adding to classrooms or schools. Please confirm before proceeding.`}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestore}
                    disabled={getSelectedItemsInfo().length === 0 || isLoading}
                    className={`px-4 py-2 ${
                      getSelectedItemsInfo().length === 0 || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded-[6px] transition-colors`}
                  >
                    {isLoading ? "Processing..." : "Restore"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <NetworkHeader
            title="Observation Sessions"
            description="Schedule and manage your observation sessions"
            search={search}
            setSearch={setSearch}
            active={active}
            setActive={setActive}
            hasSelectedItems={hasSelectedItems}
            setShowArchiveModal={setShowArchiveModal}
            setShowRestoreModal={setShowRestoreModal}
            setShowDeleteModal={setShowDeleteModal}
            addButtonLink="/observation-sessions/schedule"
            addButtonText="Add"
            activeLabel="Active"
            archivedLabel="Archived"
            // Pass the isEditing state to NetworkHeader
            isEditing={isEditing}
            onSave={handleSaveEdit}
            onClose={handleCancelEdit}
            saveButtonText="Save Changes"
            closeButtonText="Cancel"
          />
          <SessionTables
            todaySessions={todaySessions}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            onSelectionChange={(ids) => setSelectedSessions(ids)}
            onTabChange={(tab) => setActiveTab(tab)}
            onEditingChange={handleEditingChange}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            // Pass the isEditing state to control SessionTables
            isEditingExternal={isEditing}
            Loading={isLoading}
          />
        </>
      ) : (
        // No active sessions
        <div className="max-w-6xl mx-auto py-8  bg-white rounded-lg border p-6 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Observation Sessions</h1>
            <Link
              href="/observation-sessions/schedule"
              className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
            >
              Schedule New Session
            </Link>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <p className="text-gray-500 text-center py-8">
              No sessions scheduled yet.
            </p>
          </div>
        </div>
      )}

      {/* Modal placeholders - implement as needed */}
    </div>
  );
}
