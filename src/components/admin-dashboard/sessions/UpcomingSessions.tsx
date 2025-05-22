"use client";

import { Calendar, Clock, School, User, Activity, Play } from "lucide-react";
import AdminDashboardTable, {
  TableRow,
  Column,
  StatusType,
} from "../AdminDashboardTable";
import { useEffect, useState } from "react";
import ViewClass from "./actions/ViewClass";
import EditSession from "./actions/EditSession";
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

  const fetchSessionData = async () => {
    const requestPayload: observationSessionPayload = {
      search: searchTerm,
      sort_by: selectedFilters.sort_by,
      sort_order: selectedFilters.sort_order,
      page: selectedFilters.page,
      limit: selectedFilters.limit,
      filter_type: "upcoming",
    };
    const response = await districtAdminObservationSessions(requestPayload);
    if (response.success) {
      setSessionData(response.data.sessions);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
      setPageNumber(response.data.page);
      setPageSize(response.data.limit);
      console.log("sessions data fetch successfully");
    } else {
      setSessionData([]);
      console.log("Error while fetching sessions data");
    }
  };

  // Column definitions for Sessions tab
  const sessionsColumns: Column[] = [
    {
      key: "school",
      label: "School",
      icon: <School size={16} />,
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      icon: <Calendar size={16} />,
      sortable: true,
    },
    {
      key: "start_time",
      label: "Start Time",
      icon: <Clock size={16} />,
      sortable: true,
    },
    {
      key: "end_time",
      label: "End Time",
      icon: <Clock size={16} />,
      sortable: true,
    },
    {
      key: "session_admin",
      label: "Session Admin",
      icon: <User size={16} />,
      sortable: true,
    },
    {
      key: "observers",
      label: "Observer(s)",
      icon: <User size={16} />,
      sortable: true,
    },
    {
      key: "observation_tool",
      label: "Observation Tool(s)",
      icon: <Activity size={16} />,
      sortable: true,
    },
    {
      key: "action",
      label: "Action",
      icon: <Activity size={16} />,
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
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSession(row)}
            className="text-teal-600 hover:text-teal-800 flex items-center"
          >
            <span className="mr-1">Edit Session</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          {row.viewClassrooms && (
            <button
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => handleViewClassrooms(row)}
            >
              <span className="mr-1">View Classrooms</span>
              <Play size={16} />
            </button>
          )}
        </div>
      );
    }

    if (column === "observation_tool") {
      const tool = row[column] as string;
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            tool.includes("IPG")
              ? "bg-green-100 text-green-800"
              : tool.includes("Math")
              ? "bg-purple-100 text-purple-800"
              : tool.includes("AAPS")
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
          {row[column].name}
        </span>
      );
    }

    if (column === "date") {
      if (row[column]) {
        return (
          <span className="text-xs text-black font-normal">
            {format(new Date(row[column]), "MMMM d, yyyy")}
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
            {format(new Date(row[column]), "h:mm a")}
          </span>
        );
      } else {
        return "-";
      }
    }
    if (column === "observers") {
      const observers = row[column] as any;
      return (
        <div className="text-sm">
          {Array.isArray(observers) && observers.length > 0 ? (
            <>
              <span className="text-sm">
                {observers.slice(0, 2).join(", ")}
              </span>
              {observers.length > 2 && (
                <span
                  style={{ color: "#007778" }}
                  className="ml-1 text-sm font-medium"
                >
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
        headerColor="teal-600"
        rowColor="teal-100"
        renderCell={renderCell}
        searchTerm={searchTerm}
        onFiltersChange={handleFiltersChange}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageNumber={pageNumber}
        pageSize={pageSize}
      />

      {/* Edit Session Modal */}
      {isEditModalOpen && selectedSession && (
        <EditSession
          session={selectedSession}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveSession}
        />
      )}

      {/* View Classrooms Modal removed - now handled by parent component */}
    </div>
  );
};

export default UpcomingSessions;
