import { TableRow } from "@/components/system-dashboard/DashboardTable";

// Sample data for Districts tab
const districtsData: TableRow[] = [
  {
    id: "1",
    network: "Blue Ridge Charter Collaborative",
    district: "New York City Department of Education",
    admins: [
      { first_name: "Jane", last_name: "Doe" },
      { first_name: "John", last_name: "Doe" }
    ],
    users: 0,
    lastSession: null,
    sessionStatus: "No Session",
    setupStatus: "Incomplete",
  },
  {
    id: "2",
    network: "Cedar Grove Charter Network",
    district: "Los Angeles Unified School District",
    admins: [
      { first_name: "John", last_name: "Doe" }
    ],
    users: 0,
    lastSession: null,
    sessionStatus: "No Session",
    setupStatus: "Incomplete",
  },
  {
    id: "3",
    network: "Charter Network",
    district: "Chicago Public Schools",
    admins: [
      { first_name: "Jane", last_name: "Doe" }
    ],
    users: 5,
    lastSession: null,
    sessionStatus: "No Session",
    setupStatus: "Partial",
  },
  {
    id: "4",
    network: "Charter Network",
    district: "Clark County School District",
    admins: [
      { first_name: "John", last_name: "Doe" }
    ],
    users: 20,
    lastSession: "April 2, 2025",
    sessionStatus: "Inactive",
    setupStatus: "Complete",
  },
  {
    id: "5",
    network: "None",
    district: "Broward County Public Schools",
    admins: [
      { first_name: "Jane", last_name: "Doe" },
      { first_name: "John", last_name: "Doe" }
    ],
    users: 5,
    lastSession: "April 6, 2025",
    sessionStatus: "Inactive",
    setupStatus: "Complete",
  },
  {
    id: "6",
    network: "None",
    district: "Houston Independent School District",
    admins: [
      { first_name: "Jane", last_name: "Doe" }
    ],
    users: 20,
    lastSession: "April 6, 2025",
    sessionStatus: "Active",
    setupStatus: "Complete",
  },
  {
    id: "7",
    network: "Foundations Education Collaborative",
    district: "Hawaii Department of Education",
    admins: [
      { first_name: "John", last_name: "Doe" }
    ],
    users: 9,
    lastSession: "February 25, 2025",
    sessionStatus: "Active",
    setupStatus: "Complete",
  },
  {
    id: "8",
    network: "None",
    district: "Orange County Public Schools",
    admins: [
      { first_name: "Jane", last_name: "Doe" }
    ],
    users: 4,
    lastSession: "December 10, 2025",
    sessionStatus: "Active",
    setupStatus: "Complete",
  },
  {
    id: "9",
    network: "Pinnacle Charter Network",
    district: "School District of Palm Beach County",
    admins: [
      { first_name: "Jane", last_name: "Doe" },
      { first_name: "John", last_name: "Doe" },
      { first_name: "Extra", last_name: "Admin" }
    ],
    users: 17,
    lastSession: "October 27, 2025",
    sessionStatus: "Active",
    setupStatus: "Complete",
  },
];
