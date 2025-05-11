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
      key: "school",
      label: "School",
      sortable: true,
      icon: <School size={16} />,
      editable: true,
    },
    {
      key: "grades",
      label: "Grade(s)",
      sortable: true,
      icon: <FileText size={16} />,
      editable: true,
      options: gradeOptions,
    },
    {
      key: "curricula",
      label: "Curricula",
      sortable: true,
      icon: <BookOpen size={16} />,
      editable: true,
      options: curriculaOptions,
    },
    {
      key: "interventions",
      label: "Intervention(s)",
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
            school: "Elmwood Elementary School",
            grades: "1, 2, 3",
            curricula: "Illustrative Math",
            interventions: "Coaching",
          },
          {
            id: 2,
            school: "Jefferson Middle School",
            grades: "1, 2, 3, 4, 5",
            curricula: "None",
            interventions: "Coaching +2 more",
          },
          {
            id: 3,
            school: "Eastwood High School",
            grades: "Kindergarten, 2, 3",
            curricula: "Illustrative Math",
            interventions: "None",
          },
          {
            id: 4,
            school: "Lincoln Middle School",
            grades: "Kindergarten, 1, 2, 3",
            curricula: "None",
            interventions: "Coaching",
          },
          {
            id: 5,
            school: "Riverside Elementary School",
            grades: "1, 2, 3",
            curricula: "Illustrative Math + 2 more",
            interventions: "Coaching +2 more",
          },
          {
            id: 6,
            school: "Westview High School",
            grades: "Kindergarten, 1, 2 + 2 more",
            curricula: "Illustrative Math + 2 more",
            interventions: "Coaching",
          },
          {
            id: 7,
            school: "Northgate Middle School",
            grades: "1, 2, 3",
            curricula: "Illustrative Math",
            interventions: "Coaching",
          },
          {
            id: 8,
            school: "Pinecrest High School",
            grades: "1, 2, 3",
            curricula: "None",
            interventions: "None",
          },
          {
            id: 9,
            school: "George High School",
            grades: "1, 2, 3",
            curricula: "Illustrative Math + 2 more",
            interventions: "Jane Doe, John Doe +2 more",
          },
          {
            id: 10,
            school: "Pinecrest High School",
            grades: "1, 2, 3",
            curricula: "Illustrative Math",
            interventions: "None",
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
      <h1 className="text-2xl font-bold mb-6">Schools</h1>
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
        staticbg={"#2264AC"}
        dynamicbg={"#F3F8FF"}
        onCreate={"/schools/new"}
      />
    </div>
  );
}
