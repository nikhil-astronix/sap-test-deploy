"use client";
import React, { useState, useEffect } from "react";
import { School, FileText, BookOpen, Zap } from "lucide-react"; // Using Lucide icons
import Table, { Column } from "@/components/ui/table";
import {
  getUser,
  editUser,
  archiveUser,
  restoreUser,
} from "@/services/userService";
import { AxiosError } from "axios";
import { fetchUsersRequestPayload } from "@/types/userData";

export default function SchoolsPage() {
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const interventionOptions = [
    "None",
    "Coaching",
    "Professional Development",
    "Tutoring",
    "Jane Doe",
    "John Doe",
  ];

  const userTypes = [
    "Admin",
    "District Viewer",
    "Observer",
    "State Admin",
    "Super Admin",
    "Network Admin",
  ];

  const roles = [
    "Central Office / District",
    "Instructional Coach",
    "Professional Learning Partner",
    "School Leader",
    "State",
    "Teacher",
    "Other",
  ];

  const columns: Column[] = [
    {
      key: "first_name",
      label: "First Name",
      sortable: true,
      icon: <School size={16} />,
      editable: true,
    },
    {
      key: "last_name",
      label: "Last Name",
      sortable: true,
      icon: <FileText size={16} />,
      editable: true,
      // options: gradeOptions,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      icon: <BookOpen size={16} />,
      editable: true,
      // options: curriculaOptions,
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
      options: roles,
    },
    {
      key: "user_type",
      label: "User Type",
      sortable: true,
      icon: <Zap size={16} />,
      editable: true,
      options: userTypes,
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
        first_name: updatedRow.first_name,
        last_name: updatedRow.last_name,
        email: updatedRow.email,
        // state: "",
        // district: formData.district,
        // school: formData.school,
        state: "661943fd4ccf5f44a9a1a001",
        district: "661943fd4ccf5f44a9a1a002",
        school: "661943fd4ccf5f44a9a1a003",
        network: "661943fd4ccf5f44a9a1a001",
        user_role: updatedRow.role,
        user_type: updatedRow.user_type,
      };
      const response = await editUser(updatedRow.id, data);

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
      setIsLoading(false);
    }
  };

  const handleDelete = async (selectedIds: string[]) => {
    console.log("Delete selected rows:", selectedIds);

    try {
      const response = await archiveUser({ ids: selectedIds });
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
      setIsLoading(false);
    }
  };

  const handleArchive = async (selectedIds: string[]) => {
    try {
      const response = await restoreUser({ ids: selectedIds });
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
      setIsLoading(false);
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

  const handleRowsPerPageChange = (limit: number) => {
    setRowsPerPage(limit);
    setCurrentPage(1);
    fetchData(1, limit, sortField, sortDirection, isArchived, searchQuery);
  };

  const handleSortChange = (
    key: string | null,
    direction: "asc" | "desc" | null
  ) => {
    setSortField(key);
    setSortDirection(direction);
    fetchData(
      currentPage,
      rowsPerPage,
      key,
      direction,
      isArchived,
      searchQuery
    );
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
      const requesPayload: fetchUsersRequestPayload = {
        is_archived: isArchived,
        sort_by: sortBy,
        sort_order: sortOrder,
        curr_page: page,
        per_page: limit,
        search: search,
      };
      const response = await getUser(requesPayload);
      // let sortedData = [...response.data.users];
      // if (sortBy && sortOrder) {
      //   sortedData.sort((a, b) => {
      //     if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      //     if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      //     return 0;
      //   });
      // }

      // const startIndex = (page - 1) * limit;
      // const paginatedData = sortedData.slice(startIndex, startIndex + limit);
      const paginatedData = [...response.data.users];
      setUsersData(paginatedData);
      setTotalCount(response.data.total_users);
      setLoading(false);
      // }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      currentPage,
      rowsPerPage,
      sortField,
      sortDirection,
      isArchived,
      searchQuery
    );
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Table
        columns={columns}
        data={usersData}
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
        staticbg={"#6C4996"}
        dynamicbg={"#F9F5FF"}
        onCreate={"/users/new"}
      />
    </div>
  );
}
