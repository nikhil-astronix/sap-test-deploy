"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import AdminTabComponent from "@/components/admin-dashboard/AdminTabComponent";
import TodaysSessions from "../../components/admin-dashboard/sessions/TodaySession/TodaysSessions";
import UpcomingSessions from "../../components/admin-dashboard/sessions/UpcomingSession/UpcomingSessions";
import PastSessions from "../../components/admin-dashboard/sessions/PastSession/PastSessions";
import ObservationTools from "@/components/admin-dashboard/ObservationTools";
import RecentLogins from "@/components/admin-dashboard/RecentLogins";
import Schools from "@/components/admin-dashboard/Schools";
import TodaySessionViewClassroom from "@/components/admin-dashboard/sessions/TodaySession/TodaySessionViewClassroom";
import PastSessionViewClassroom from "@/components/admin-dashboard/sessions/PastSession/PastSessionViewClassroom";
import UpcomingSessionViewClassroom from "@/components/admin-dashboard/sessions/UpcomingSession/UpcomingSessionViewClassroom";
import { date } from "zod";
import { GoArrowLeft } from "react-icons/go";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Todays Sessions");
  const colorClasses = ["[#007778]", "[#2264AC]", "[#6C4996]", "[#2A7251]"];
  const tabs = [
    "Todays Sessions",
    "Schools",
    "Observation Tools",
    "Recent Logins",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sessionViewType, setSessionViewType] = useState("today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add a key to force re-render of components
  const [refreshKey, setRefreshKey] = useState(0);

  // Single state for the currently viewed classroom session
  const [viewingClassrooms, setViewingClassrooms] = useState<any>(null);
  const [newName, setNewName] = useState<string | null>(null);

  useEffect(() => {
    // Check if window is defined (we're in the browser)
    if (typeof window !== "undefined") {
      setNewName(localStorage.getItem("name"));
    }
  }, []);

  // Custom tab change handler to reset views
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset classroom view when switching tabs
    if (tab !== "Todays Sessions") {
      setViewingClassrooms(null);
    }
  };

  // Custom session type change handler
  const handleSessionTypeChange = (type: string) => {
    setSessionViewType(type);
    // Reset classroom view when switching session types
    setViewingClassrooms(null);
  };

  // Listen for messages from child components
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "VIEW_CLASSROOMS") {
        // Store the classroom data
        setViewingClassrooms(event.data.session);
      } else if (event.data && event.data.type === "CLOSE_CLASSROOMS") {
        // Clear the classroom data
        setViewingClassrooms(null);
        // Force re-render by incrementing the refresh key
        setRefreshKey((prev) => prev + 1);
      } else if (event.data && event.data.type === "REFRESH_SESSIONS") {
        // Force refresh of the sessions view
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // No dependencies needed

  const renderSessionComponent = () => {
    // If viewing classrooms, show the appropriate ViewClassroom component based on session type
    if (viewingClassrooms && activeTab === "Todays Sessions") {
      // Select the appropriate ViewClassroom component based on session type
      switch (sessionViewType) {
        case "today":
          return (
            <TodaySessionViewClassroom
              key={`classroom-view-${refreshKey}`}
              schoolId={viewingClassrooms.id} // Use session ID instead of school ID
              onBack={() => {
                // Clear the classroom view but maintain the session type
                setViewingClassrooms(null);
                // Force re-render
                setRefreshKey((prev) => prev + 1);
              }}
            />
          );
        case "past":
          return (
            <PastSessionViewClassroom
              key={`classroom-view-${refreshKey}`}
              schoolId={viewingClassrooms.id}
              onBack={() => {
                setViewingClassrooms(null);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          );
        case "upcoming":
          return (
            <UpcomingSessionViewClassroom
              key={`classroom-view-${refreshKey}`}
              schoolId={viewingClassrooms.id}
              onBack={() => {
                setViewingClassrooms(null);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          );
        default:
          return (
            <TodaySessionViewClassroom
              key={`classroom-view-${refreshKey}`}
              schoolId={viewingClassrooms.id}
              onBack={() => {
                setViewingClassrooms(null);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          );
      }
    }

    // Otherwise show the regular session components with a key to force re-render
    switch (sessionViewType) {
      case "today":
        return (
          <TodaysSessions key={`today-${refreshKey}`} searchTerm={searchTerm} />
        );
      case "upcoming":
        return (
          <UpcomingSessions
            key={`upcoming-${refreshKey}`}
            searchTerm={searchTerm}
          />
        );
      case "past":
        return (
          <PastSessions key={`past-${refreshKey}`} searchTerm={searchTerm} />
        );
      default:
        return (
          <TodaysSessions
            key={`today-default-${refreshKey}`}
            searchTerm={searchTerm}
          />
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Todays Sessions":
        return renderSessionComponent();
      case "Schools":
        return <Schools searchTerm={searchTerm} />;
      case "Observation Tools":
        return <ObservationTools searchTerm={searchTerm} />;
      case "Recent Logins":
        return <RecentLogins searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  // Determine if we should show session details or welcome message
  const showSessionDetails =
    viewingClassrooms !== null && activeTab === "Todays Sessions";

  // Force re-render of session components when viewingClassrooms changes
  useEffect(() => {
    // This will trigger a re-render of the session components
    if (viewingClassrooms === null) {
      // Small delay to ensure state updates properly
      const timer = setTimeout(() => {
        // Force re-render by toggling a state
        setSearchTerm((searchTerm) => searchTerm + "");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewingClassrooms]);

  const CalendarDate = ({ date }: { date: any }) => {
    const dateObj = new Date(date);

    // Get month name
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[dateObj.getMonth()];

    // Get day of month
    const dayOfMonth = dateObj.getDate();

    return (
      <div className="inline-block">
        {/* Calendar container */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden w-[40px] h-[40px]">
          {/* Month header */}
          <div className="bg-gradient-to-b from-[#10472E] to-[#2A7251] text-white flex items-top text-center justify-center h-[16px]">
            <span className="text-xs h-[16px]">{monthName}</span>
          </div>
          {/* Day number */}
          <div className="flex items-center text-center justify-center flex-1 h-[24px]">
            <span className="text-md font-bold bg-gradient-to-b from-[#10472E] to-[#2A7251] bg-clip-text text-transparent">
              {dayOfMonth}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pl-12 pr-12 w-full shadow-lg rounded-lg bg-white border border-gray-200">
      {showSessionDetails && (
        <div className="mb-4">
          <button
            onClick={() => setViewingClassrooms(null)}
            className="flex gap-1 rounded-xl text-sm items-center bg-gray-100 rounded-md p-1 pl-2 pr-4 pt-1 pb-1 hover:bg-gray-200"
          >
            <GoArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>
      )}

      {showSessionDetails ? (
        <div className="mb-6">
          <div className="flex items-center mb-2 bg-gray-100 p-2 rounded-xl">
            <div className="flex items-center gap-3">
              <CalendarDate date={viewingClassrooms?.date || new Date()} />
              <h1 className="text-base font-semibold">
                {viewingClassrooms?.school} Observation Session
              </h1>
            </div>
            <div className="ml-auto right-0 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {viewingClassrooms?.observation_tool}
            </div>
          </div>
          <div className="mt-[20px] mb-[-10px] font-semibold text-lg">
            Observation Classrooms
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome, {newName}</h1>
          <p className="text-gray-600">
            This dashboard provides a quick overview of platform usage within
            your system. You can also view scheduled observation sessions and
            participate as needed.
          </p>
        </div>
      )}

      <div className="rounded-md shadow-sm overflow-hidden">
        <AdminTabComponent
          tabs={tabs}
          colorClasses={colorClasses}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sessionViewType={sessionViewType}
          setSessionViewType={handleSessionTypeChange}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        <div>
          <div className="relative w-full md:w-64 mb-3 mt-3">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
