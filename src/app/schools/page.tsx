"use client";
import React, { useState, useEffect } from "react";
import { School, FileText, BookOpen, Zap } from "lucide-react"; // Using Lucide icons
import Table, { Column } from "@/components/ui/table";
import {
  archiveSchool,
  getSchools,
  restoreSchool,
} from "@/services/schoolService";
import { AxiosError } from "axios";

export default function SchoolsPage() {
  const [schoolsData, setSchoolsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isArchived, setIsArchived] = useState(false);

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
      key: "name",
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
      key: "curriculums",
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

  const handleArchive = async (selectedIds: string[]) => {
    try {
      const response = await restoreSchool({ ids: selectedIds });
      console.log("responseresponseresponse", response);
      if (response.success) {
        fetchData(currentPage, rowsPerPage);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(
      page,
      rowsPerPage,
      sortField,
      sortDirection,
      isArchived,
      searchQuery
    );
  };

  const handleDelete = async (selectedIds: string[]) => {
    console.log("Delete selected rows:", selectedIds);

    try {
      const response = await archiveSchool({ ids: selectedIds });
      if (response.success) {
        fetchData(currentPage, rowsPerPage);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
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
    sortBy: string | null = null,
    sortOrder: "asc" | "desc" | null = null,
    isArchived: boolean = false,
    search: string | null = null
  ) => {
    setLoading(true);
    try {
      const requesPayload = {
        is_archived: isArchived,
        sort_by: sortBy,
        sort_order: sortOrder,
        curr_page: page,
        per_page: limit,
        search: search,
      };
      const response = await getSchools(requesPayload);
      console.log("response", response);
      setSchoolsData(response.data.schools);
      setTotalCount(response.data.total_schools);
      setLoading(false);
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
        onArchive={handleArchive}
        onSearchChange={setSearchQuery}
        onToggleArchived={(archived) => {
          setIsArchived(archived);
          fetchData(
            currentPage,
            rowsPerPage,
            sortField,
            sortDirection,
            archived,
            searchQuery
          );
        }}
        loading={loading}
        staticbg={"#2264AC"}
        dynamicbg={"#F3F8FF"}
        onCreate={"/schools/new"}
      />
    </div>
  );
}
