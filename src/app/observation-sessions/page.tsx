"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { transformSessionDataForAPI } from "@/utils/sessionDataTransformers";

export default function ObservationSessionsPage() {
  // Add this near the top with your other state declarations
  const latestEditingDataRef = useRef<any>(null);

  // Example data following the API structure
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);

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
  // Add these state variables to your ObservationSessionsPage component
  const [pagination, setPagination] = useState({
    Today: { page: 1, perPage: 10 },
    Upcoming: { page: 1, perPage: 10 },
    Past: { page: 1, perPage: 10 },
  });
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
          .map((classroom: { course: any }) => classroom.course)
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

    // Only check availability on first load (no dependencies)
    if (!sessionAvailabilityChecked.current) {
      checkSessionAvailability();
      sessionAvailabilityChecked.current = true;
    }
  }, [active, search]);

  // Update the useEffect to respect pagination
  useEffect(() => {
    const currentTab = activeTab;
    const { page, perPage } = pagination[currentTab];
    fetchSessions(currentTab, page, perPage);
  }, [active, search]); // Remove activeTab from dependencies since it's handled in onTabChange

  // Add this ref at the component level
  const sessionAvailabilityChecked = useRef(false);

  // Modified fetchSessions function to accept pagination parameters
  const fetchSessions = async (
    tab = activeTab,
    page = pagination[activeTab].page,
    perPage = pagination[activeTab].perPage
  ) => {
    setIsLoading(true);

    try {
      // Fetch sessions based on the active tab, archived state, and pagination
      const requestPayload = {
        is_archived: active,
        sort_by: "date",
        sort_order: "asc",
        curr_page: page,
        per_page: perPage,
        search: search || null,
        time: tab,
      };

      const response = await getSessions(requestPayload);
      console.log("API Response:", response);

      if (response.success && response.data) {
        const sessionData = response.data.observation_sessions || [];
        console.log(`Fetched ${tab} sessions:`, sessionData);

        // Update only the appropriate array based on tab
        switch (tab) {
          case "Today":
            setTodaySessions(sessionData);
            break;
          case "Upcoming":
            setUpcomingSessions(sessionData);
            break;
          case "Past":
            setPastSessions(sessionData);
            break;
        }
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to check session availability across all states
  const checkSessionAvailability = async () => {
    try {
      // Check for any sessions in archived state
      const archivedResponse = await getSessions({
        is_archived: true,
        sort_by: "date",
        sort_order: "asc",
        curr_page: 1,
        per_page: 1, // Just need to know if any exist
        search: null,
        time: null,
      });

      // Check for any sessions in non-archived state
      const activeResponse = await getSessions({
        is_archived: false,
        sort_by: "date",
        sort_order: "asc",
        curr_page: 1,
        per_page: 1, // Just need to know if any exist
        search: null,
        time: null,
      });

      // Sessions are available if there's data in either archived or active state
      const hasArchivedSessions =
        archivedResponse.success &&
        archivedResponse.data &&
        archivedResponse.data.observation_sessions &&
        archivedResponse.data.observation_sessions.length > 0;

      const hasActiveSessions =
        activeResponse.success &&
        activeResponse.data &&
        activeResponse.data.observation_sessions &&
        activeResponse.data.observation_sessions.length > 0;

      // Update sessionAvailable based on whether any sessions exist in either state
      setSessionAvailable(hasArchivedSessions || hasActiveSessions);
    } catch (error) {
      console.error("Error checking session availability:", error);
      // Default to assuming sessions are available if check fails
      setSessionAvailable(true);
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
  // const handleEditingChange = (
  // 	isEditing: boolean | ((prevState: boolean) => boolean),
  // 	sessionData = null
  // ) => {
  // 	setIsEditing(isEditing);
  // 	if (sessionData) {
  // 		setEditingData(sessionData);
  // 		// Also update the ref
  // 		latestEditingDataRef.current = sessionData;
  // 	}
  // };

  // Add this function to get latest data from TabComponents
  const updateLatestEditingData = (data: any) => {
    latestEditingDataRef.current = data;
  };

  // Modified save handler that works with both NetworkHeader and SessionTables
  const handleSaveEdit = async (data?: any) => {
    console.log("Save edit function called");

    // Check if data is a React event object and ignore it
    if (data && data._reactName && data.nativeEvent) {
      console.log("Ignoring React event object from NetworkHeader");
      data = null;
    }

    // Use data explicitly passed, OR the ref's latest data, OR fall back to state
    const originalData = latestEditingDataRef.current;

    console.log("Original data before transformation:", originalData);

    // Transform the data to API format
    const dataToSave = transformSessionDataForAPI(originalData);

    console.log("Data being saved (API format):", dataToSave);

    if (dataToSave) {
      try {
        const response = await editSession(dataToSave.id, dataToSave);
        if (response.success) {
          console.log("Session updated successfully:", response);
          // Reset editing state
          setIsEditing(false);
          setEditingData(null);
          latestEditingDataRef.current = null;
          // Refresh sessions
          fetchSessions();
        } else {
          console.error("Failed to update session:", response.error);
        }
      } catch (error) {
        console.error("Error updating session:", error);
      }
    } else {
      console.warn("No editing data available");
    }
  };

  // Updated handler for cancel button in NetworkHeader
  const handleCancelEdit = () => {
    console.log("Cancel edit");
    // Force the SessionTables component to exit edit mode
    setIsEditing(false);
    setEditingData(null);
  };

  // Add this effect to fetch data when tab changes
  useEffect(() => {
    fetchSessions();
  }, [activeTab]);

  // Add these handler functions to ObservationSessionsPage
  const handlePageChange = (
    tab: "Today" | "Upcoming" | "Past",
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], page },
    }));
    // Trigger fetch with new pagination values
    fetchSessions(tab, page, pagination[tab].perPage);
  };

  const handleRowsPerPageChange = (
    tab: "Today" | "Upcoming" | "Past",
    perPage: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      [tab]: { page: 1, perPage }, // Reset to page 1 when changing rows per page
    }));
    // Trigger fetch with new pagination values
    fetchSessions(tab, 1, perPage);
  };

  return (
    <div className="py-8 bg-white rounded-lg border p-6 shadow-md">
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
                <p className="text-left text-black-400 text-[14px] mb-4 font-medium">
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
                          <p className="text-[12px] text-black font-medium">
                            {item}
                          </p>
                        </div>
                        <div className="text-[12px] text-right font-medium">
                          Session
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
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
                    } text-white rounded-[6px] transition-colors font-medium`}
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
            closeButtonText="Close"
            activeTab={activeTab} // Pass the active tab to NetworkHeader
          />
          <SessionTables
            todaySessions={todaySessions}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            onSelectionChange={(ids) => setSelectedSessions(ids)}
            onTabChange={(tab) => {
              setActiveTab(tab);
              fetchSessions(tab, pagination[tab].page, pagination[tab].perPage);
            }}
            onEditingChange={(isEditing, data) => {
              setIsEditing(isEditing);
              if (data) setEditingData(data);
            }}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onUpdateEditingData={updateLatestEditingData} // Add this new prop
            isEditingExternal={isEditing}
            Loading={isLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
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
