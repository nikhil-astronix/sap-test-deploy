import { TableRow } from "@/components/admin-dashboard/AdminDashboardTable";

const schoolsData: TableRow[] = [
  {
    id: "1",
    name: "Elmwood Elementary School",
    classrooms: 0,
    observationTools: [],
    lastSession: null,
    setupStatus: "Incomplete",
    setupStatusData: {
      classrooms: 0,
      tools: 0,
    },
  },
  {
    id: "2",
    name: "Jefferson Middle School",
    classrooms: 0,
    observationTools: [],
    lastSession: null,
    setupStatus: "Incomplete",
    setupStatusData: {
      classrooms: 0,
      tools: 0,
    },
  },
  {
    id: "3",
    name: "Lincoln Middle School",
    classrooms: 5,
    observationTools: [],
    lastSession: null,
    setupStatus: "Partial",
    setupStatusData: {
      classrooms: 20,
      tools: 0,
    },
  },
  {
    id: "4",
    name: "Eastwood High School",
    classrooms: 20,
    observationTools: [],
    lastSession: null,
    setupStatus: "Partial",
    setupStatusData: {
      classrooms: 20,
      tools: 0,
    },
  },
  {
    id: "5",
    name: "Riverside Elementary School",
    classrooms: 10,
    observationTools: ["e³ Math"],
    lastSession: "April 6, 2025",
    setupStatus: "Complete",
    setupStatusData: {
      classrooms: 10,
      tools: 1,
    },
  },
  {
    id: "6",
    name: "Westview High School",
    classrooms: 20,
    observationTools: ["IPG Literacy"],
    lastSession: "March 17, 2025",
    setupStatus: "Complete",
    setupStatusData: {
      classrooms: 20,
      tools: 1,
    },
  },
  {
    id: "7",
    name: "Northgate Middle School",
    classrooms: 9,
    observationTools: ["IPG Literacy", "e³ Literacy FS"],
    lastSession: "February 25, 2025",
    setupStatus: "Complete",
    setupStatusData: {
      classrooms: 4,
      tools: 2,
    },
  },
  {
    id: "8",
    name: "Pinecrest High School",
    classrooms: 4,
    observationTools: ["e³ Literacy FS", "IPG Literacy"],
    lastSession: "December 10, 2025",
    setupStatus: "Complete",
    setupStatusData: {
      classrooms: 4,
      tools: 2,
    },
  },
  {
    id: "9",
    name: "George High School",
    classrooms: 17,
    observationTools: ["e³ Literacy FS"],
    lastSession: "October 27, 2025",
    setupStatus: "Complete",
    setupStatusData: {
      classrooms: 17,
      tools: 1,
    },
  },
];
