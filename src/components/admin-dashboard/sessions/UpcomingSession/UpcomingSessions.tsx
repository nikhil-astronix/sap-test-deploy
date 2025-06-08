"use client";

import { Calendar, Clock, School, User, Activity, Play } from "lucide-react";
import { RiEdit2Line } from "react-icons/ri";
import AdminDashboardTable, { TableRow, Column } from "../../AdminDashboardTable";
import { useEffect, useState } from "react";
import ViewClass from "../actions/ViewClass";
import EditSession from "../actions/EditSession";
import { TableFilters } from "@/components/system-dashboard/DashboardTable";
import { observationSessionPayload } from "@/models/dashboard";
import { districtAdminObservationSessions } from "@/services/adminDashboardService";
import { format } from "date-fns";

interface UpcomingSessionsProps {
  searchTerm?: string;
  viewClassroomsSession?: any;
}

const UpcomingSessions = ({
  searchTerm = "",
  viewClassroomsSession,
}: UpcomingSessionsProps) => {
  const [sessionData, setSessionData] = useState<TableRow[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState<TableFilters>({
    page: 1,
    limit: 9,
    sort_by: "name",
    sort_order: "asc",
  });

  // Filter data when search term changes
  useEffect(() => {
    fetchSessionData();
  }, [searchTerm, selectedFilters]);

  // Sample dummy data for when API returns empty
  const dummyData: TableRow[] = [
    {
      id: "1",
      school: { id: "1", name: "Lincoln High School" },
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      start_time: "2025-06-10T10:00:00",
      end_time: "2025-06-10T12:00:00",
      session_admin: "John Smith",
      observers: ["Emily Johnson", "Michael Brown"],
      observation_tool: "IPG Core",
      viewClassrooms: true,
      status: "Scheduled"
    },
    {
      id: "2",
      school: { id: "2", name: "Washington Elementary" },
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      start_time: "2025-06-12T11:30:00",
      end_time: "2025-06-12T13:30:00",
      session_admin: "Sarah Wilson",
      observers: ["David Miller"],
      observation_tool: "Math IPG",
      viewClassrooms: true,
      status: "Scheduled"
    },
    {
      id: "3",
      school: { id: "3", name: "Roosevelt Middle School" },
      date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      start_time: "2025-06-14T09:15:00",
      end_time: "2025-06-14T11:15:00",
      session_admin: "Robert Taylor",
      observers: ["Jennifer Davis", "James Wilson", "Lisa Moore"],
      observation_tool: "AAPS",
      viewClassrooms: true,
      status: "Scheduled"
    },
    {
      id: "4",
      school: { id: "4", name: "Jefferson Academy" },
      date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      start_time: "2025-06-17T14:00:00",
      end_time: "2025-06-17T16:00:00",
      session_admin: "Amanda Lee",
      observers: ["Thomas Johnson"],
      observation_tool: "IPG Core",
      viewClassrooms: true,
      status: "Scheduled"
    }
  ];

      // Helper functions to format date and time
      const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };
      
      const formatTime = (timeStr: string) => {
        if (!timeStr) return 'N/A';
        const timePart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
        const time = timePart.split('+')[0]; // Remove timezone part if present
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };

  const fetchSessionData = async () => {
    setIsLoading(true);
    try {
      const requestPayload: observationSessionPayload = {
        search: searchTerm,
        sort_by: selectedFilters.sort_by,
        sort_order: selectedFilters.sort_order,
        page: selectedFilters.page,
        limit: selectedFilters.limit,
        filter_type: "upcoming",
      };
      const response = await districtAdminObservationSessions(requestPayload);
      if (response.success && response.data && response.data.sessions && response.data.sessions.length > 0) {
        setSessionData(response.data.sessions);
        setTotalPages(response.data.pages);
        setTotalRecords(response.data.total);
        setPageNumber(response.data.page);
        setPageSize(response.data.limit);
        console.log("sessions data fetch successfully");
      } else {
        // Use dummy data when API returns empty
        setSessionData(dummyData);
        setTotalPages(1);
        setTotalRecords(dummyData.length);
        setPageNumber(1);
        setPageSize(10);
        console.log("Using dummy data for empty API response");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
      // Use dummy data on error
      setSessionData(dummyData);
      setTotalPages(1);
      setTotalRecords(dummyData.length);
      setPageNumber(1);
      setPageSize(10);
    } finally {
      setIsLoading(false);
    }
  };

  // Column definitions for Sessions tab
  const sessionsColumns: Column[] = [
    {
      key: "school",
      label: "School",
      icon: <School size={20} />,
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      icon: <Calendar size={20} />,
      sortable: true,
    },
    {
      key: "start_time",
      label: "Start Time",
      icon: <Clock size={20} />,
      sortable: true,
    },
    {
      key: "end_time",
      label: "End Time",
      icon: <Clock size={20} />,
      sortable: true,
    },
    {
      key: "session_admin",
      label: "Session Admin",
      icon: <User size={20} />,
      sortable: true,
    },
    {
      key: "observers",
      label: "Observer(s)",
      icon: <User size={20} />,
      sortable: true,
    },
    {
      key: "observation_tool",
      label: "Observation Tool(s)",
      icon: <Activity size={20} />,
      sortable: true,
    },
    {
      key: "action",
      label: "Action",
      icon: <Activity size={20} />,
      sortable: false,
    },
  ];

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewClassroomsOpen, setIsViewClassroomsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TableRow | null>(null);

  // Custom render function for cells
  const renderCell = (row: TableRow, column: string) => {
    if (column === "action") {
      return (
        <div className="flex space-x-2 text-xs">
          <button
            onClick={() => handleEditSession(row)}
            className="text-[#007778] flex items-center"
          >
            <span className="mr-1">Edit Session</span>
            <RiEdit2Line size={18} />
          </button>
          <p className="text-[#007778] flex items-center ml-2 mr-2">|</p>
          {/* {row.viewClassrooms && ( */}
            <button
              className="text-[#007778] flex items-center"
              onClick={() => handleViewClassrooms(row)}
            >
              <span className="mr-1">View Classrooms</span>
              <Play size={20} />
            </button>
          {/* )} */}
        </div>
      );
    }

    if (column === "observation_tool") {
      const tool = row[column] as string;
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            typeof tool === "string" && tool.includes("IPG")
              ? "bg-green-100 text-green-800"
              : typeof tool === "string" && tool.includes("Math")
              ? "bg-purple-100 text-purple-800"
              : typeof tool === "string" && tool.includes("AAPS")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {tool}
        </span>
      );
    }

    if (column === "school") {
      return (
        <span className="text-xs text-black font-normal">
          {row[column]}
        </span>
      );
    }

    if (column === "date") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {/* {format(new Date(row[column]), "MMMM d, yyyy")} */}
            {formatDate(row[column])}
          </span>
        );
      } else {
        return "-";
      }
    }

    if (column === "start_time" || column === "end_time") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {/* {format(new Date(row[column]), "h:mm a")} */}
            {formatTime(row[column])}
          </span>
        );
      } else {
        return "-";
      }
    }
    if (column === "session_admin") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {row[column]}
          </span>
        );
      } else {
        return "-";
      }
    }
    if (column === "observers") {
      const observers = row[column] as any;
      return (
        <div className="text-xs">
          {Array.isArray(observers) && observers.length > 0 ? (
            <>
              <span className="text-xs">
                {observers.slice(0, 2).join(", ")}
              </span>
              {observers.length > 2 && (
                <span className="text-[#007778] ml-1 text-xs font-medium">
                  +{observers.length - 2} more
                </span>
              )}
            </>
          ) : (
            "-"
          )}
        </div>
      );
    }
  };

  // Handler functions
  const handleEditSession = (session: TableRow) => {
    setSelectedSession(session);
    setIsEditModalOpen(true);
  };

  const handleViewClassrooms = (session: TableRow) => {
    // Send message to parent component to show classrooms
    window.postMessage({ type: "VIEW_CLASSROOMS", session }, "*");
  };

  const handleSaveSession = () => {
    setIsEditModalOpen(false);
  };

  const handleFiltersChange = (newFilters: TableFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Sessions Table */}
      <AdminDashboardTable
        data={sessionData}
        columns={sessionsColumns}
        headerColor="bg-[#007778]"
        rowColor="bg-[#EDFFFF]"
        renderCell={renderCell}
        searchTerm={searchTerm}
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
        isLoading={isLoading}
      />

      {/* Edit Session Modal */}
      {isEditModalOpen && selectedSession && (
        <EditSession
          session={selectedSession}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveSession}
        />
      )}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007778]"></div>
        </div>
      )}

      {/* View Classrooms Modal removed - now handled by parent component */}
    </div>
  );
};

export default UpcomingSessions;
