"use client";
import React, { useState, useEffect } from "react";
import { School, FileText, BookOpen, Zap } from "lucide-react"; // Using Lucide icons
import Table, { Column } from "@/components/ui/table";
import {
  archiveSchool,
  deleteSchool,
  editSchool,
  getSchools,
  restoreSchool,
} from "@/services/schoolService";
import { AxiosError } from "axios";
import {
  ChalkboardTeacher,
  ChartBar,
  Book,
  ChartLine,
} from "@phosphor-icons/react";
import { getInterventions } from "@/services/interventionService";
import { fetchAllCurriculums } from "@/services/curriculumsService";
import { fetchCurriculumsRequestPayload } from "@/models/curriculum";

export default function SchoolsPage() {
  const [schoolsData, setSchoolsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isArchived, setIsArchived] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);

  const gradeOptions = [
    { label: "Kindergarten", value: "Kindergarten" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
  ];

  useEffect(() => {
    fetchCurriculums();
    fetchInterventions();
  }, []);

  useEffect(() => {
    fetchData(
      currentPage,
      rowsPerPage,
      sortField,
      sortDirection,
      isArchived,
      searchQuery
    );
  }, [currentPage, rowsPerPage, isArchived, searchQuery]);

  const columns: Column[] = [
    {
      key: "name",
      label: "School",
      sortable: true,
      icon: <ChalkboardTeacher size={16} />,
      editable: true,
    },
    {
      key: "grades",
      label: "Grade(s)",
      sortable: true,
      icon: <ChartBar size={16} />,
      editable: true,
      options: gradeOptions,
    },
    {
      key: "curriculums",
      label: "Instructional Materials",
      sortable: true,
      icon: <Book size={16} />,
      editable: true,
      options: curriculums,
    },
    {
      key: "interventions",
      label: "Tags & Attributes",
      sortable: true,
      icon: <ChartLine size={16} />,
      editable: true,
      options: interventions,
    },
  ];

  // Handle edit action
  const handleEdit = (row: any) => {
    console.log("Edit clicked for:", row);
  };

  // Handle save action

  const handleSave = async (updatedRow: any) => {
    try {
      let data = {
        name: updatedRow.name,
        district: "661943fd4ccf5f44a9a1a002",
        grades: updatedRow.grades,
        curriculums: updatedRow.curriculums?.filter(
          (c: string) => c !== "None"
        ),
        interventions: updatedRow.interventions?.filter(
          (i: string) => i !== "None"
        ),
      };
      const response = await editSchool(updatedRow.id, data);

      if (response.success) {
        fetchData(
          currentPage,
          rowsPerPage,
          sortField,
          sortDirection,
          isArchived,
          searchQuery
        );
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (selectedIds: string[]) => {
    try {
      const response = await archiveSchool({ ids: selectedIds });
      console.log("responseresponseresponse", response);
      if (response.success) {
        fetchData(currentPage, rowsPerPage);
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (selectedIds: string[]) => {
    try {
      const response = await restoreSchool({ ids: selectedIds });
      if (response.success) {
        fetchData(currentPage, rowsPerPage);
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
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
      const response = await deleteSchool({ ids: selectedIds });
      if (response.success) {
        fetchData(currentPage, rowsPerPage);
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
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

  const fetchCurriculums = async () => {
    try {
      const requesPayload: fetchCurriculumsRequestPayload = {
        is_archived: false,
        type: ["Default", "Custom"].join(","),
        sort_by: null,
        sort_order: null,
        search: null,
        page: 1,
        limit: 100,
      };
      const data = await fetchAllCurriculums(requesPayload);

      if (data.success) {
        const formattedCurriculums = data.data.curriculums.map(
          (curriculum: any) => ({
            value: curriculum.id,
            label: curriculum.title,
          })
        );

        setCurriculums(formattedCurriculums);
      }
    } catch (error) {
      console.error("Failed to load curriculums:", error);
    }
  };

  const fetchInterventions = async () => {
    try {
      const requesPayload = {
        is_archived: false,
        filter: null,
        sort_by: null,
        sort_order: null,
        search: null,
        curr_page: 1,
        per_page: 100,
      };
      const data = await getInterventions(requesPayload);
      if (data.success) {
        const formattedInterventions = data.data.interventions.map(
          (intervention: any) => ({
            value: intervention.id,
            label: intervention.name,
          })
        );
        setInterventions(formattedInterventions);
      }
    } catch (error) {
      console.error("Failed to load curriculums:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-full bg-white rounded-lg shadow-md">
      <h1 className="text-2xl mb-3 text-center font-medium ">Schools</h1>
      <p className="text-center text-gray-600 mb-6">
        Manage all your schools in one place.
      </p>
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
        onRestore={handleRestore}
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
        pageType="schools" // Add this prop to identify the Schools page
      />
    </div>
  );
}
