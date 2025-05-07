"use client";
import React, { useState, useEffect } from "react";
import { School, FileText, BookOpen, Zap } from "lucide-react"; // Using Lucide icons
import Table, { Column } from "@/components/ui/table";

export default function SchoolsPage() {
  const [schoolsData, setSchoolsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const gradeOptions = [
    "Kindergarten",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const curriculaOptions = [
    "None",
    "Illustrative Math",
    "Eureka Math",
    "Bridges Math",
    "EngageNY",
  ];

  const interventionOptions = [
    "None",
    "Coaching",
    "Professional Development",
    "Tutoring",
    "Jane Doe",
    "John Doe",
  ];

  const columns: Column[] = [
    {
      key: "firstname",
      label: "First Name",
      sortable: true,
      icon: <School size={16} />,
      editable: true,
    },
    {
      key: "lastname",
      label: "Last Name",
      sortable: true,
      icon: <FileText size={16} />,
      editable: true,
      options: gradeOptions,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      icon: <BookOpen size={16} />,
      editable: true,
      options: curriculaOptions,
    },
    {
      key: "network",
      label: "Network",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: interventionOptions,
    },
    {
      key: "district",
      label: "District",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: interventionOptions,
    },
    {
      key: "school",
      label: "School",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: interventionOptions,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: interventionOptions,
    },
    {
      key: "usertype",
      label: "User Type",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: interventionOptions,
    },
  ];

  // Handle edit action
  const handleEdit = (row: any) => {
    console.log("Edit clicked for:", row);
  };

  // Handle save action
  const handleSave = (updatedRow: any) => {
    console.log("Save changes for:", updatedRow);

    // Update the data in state
    const updatedData = schoolsData.map((row) =>
      row.id === updatedRow.id || row.school === updatedRow.school
        ? updatedRow
        : row
    );

    setSchoolsData(updatedData);
  };

  const handleDelete = (selectedIds: string[]) => {
    console.log("Delete selected rows:", selectedIds);

    const filteredData = schoolsData.filter(
      (row) => !selectedIds.includes(row.id || row.school)
    );

    setSchoolsData(filteredData);
    setTotalCount((prev) => prev - selectedIds.length);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page, rowsPerPage, sortField, sortDirection);
  };

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
    fetchData(1, limit, sortField, sortDirection);
  };

  const handleSortChange = (key: string, direction: "asc" | "desc" | null) => {
    setSortField(key);
    setSortDirection(direction);
    fetchData(currentPage, rowsPerPage, key, direction);
  };

  const fetchData = async (
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc" | null
  ) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            firstname: "Jane",
            lastname: "Doe",
            email: "jne@example.com",
            network: "Charter Network",
            district: "New York City",
            school: "Elmwood Elementary School",
            role: "Central Office / District",
            usertype: "Network Admin",
          },
          {
            id: 2,
            firstname: "Jane",
            lastname: "Doe",
            email: "jane@example.com",
            network: "None",
            district: "Los Angeles Unified",
            school: "Jefferson Middle School",
            role: "Instructional Coach",
            usertype: "Observer",
          },
        ];

        let sortedData = [...mockData];
        if (sortBy && sortOrder) {
          sortedData.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
            return 0;
          });
        }

        const startIndex = (page - 1) * limit;
        const paginatedData = sortedData.slice(startIndex, startIndex + limit);

        setSchoolsData(paginatedData);
        setTotalCount(mockData.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Table
        columns={columns}
        data={schoolsData}
        totalCount={totalCount}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        initialRowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        loading={loading}
        staticbg={"#6C4996"}
        dynamicbg={"#F9F5FF"}
      />
    </div>
  );
}
