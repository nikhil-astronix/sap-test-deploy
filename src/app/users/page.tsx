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
import {
  IdentificationBadge,
  Envelope,
  IdentificationCard,
  GraduationCap,
  Network,
  City,
} from "@phosphor-icons/react";
import { getNetwork } from "@/services/networkService";
import { getSchools } from "@/services/schoolService";
import { fetchAllDistricts } from "@/services/districtService";
import { getDistrictsPayload } from "@/services/districtService";

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
  const [networks, setNetworks] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const userTypes = [
    { id: "Admin", label: "Admin" },
    { id: "District Viewer", label: "District Viewer" },
    { id: "Observer", label: "Observer" },
    { id: "State Admin", label: "State Admin" },
    { id: "Super Admin", label: "Super Admin" },
    { id: "Network Admin", label: "Network Admin" },
  ];

  const roles = [
    { id: "Central Office / District", label: "Central Office / District" },
    { id: "Instructional Coach", label: "Instructional Coach" },
    {
      id: "Professional Learning Partner",
      label: "Professional Learning Partner",
    },
    { id: "School Leader", label: "School Leader" },
    { id: "State", label: "State" },
    { id: "Teacher", label: "Teacher" },
    { id: "Other", label: "Other" },
  ];

  const districts1 = [
    { id: "District A", label: "District A" },
    { id: "District B", label: "District B" },
  ];
  const schools1 = [
    { id: "ABC School", label: "ABC School" },
    { id: "School B", label: "School B" },
  ];

  const networks1 = [
    { id: "Network 4", label: "Network 4" },
    { id: "Network 5", label: "Network 5" },
  ];

  const columns: Column[] = [
    {
      key: "first_name",
      label: "First Name",
      sortable: true,
      icon: <IdentificationBadge size={16} />,
      editable: true,
    },
    {
      key: "last_name",
      label: "Last Name",
      sortable: true,
      icon: <IdentificationBadge size={16} />,
      editable: true,
      // options: gradeOptions,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      icon: <Envelope size={18} />,
      editable: true,
      // options: curriculaOptions,
    },
    {
      key: "network",
      label: "Network",
      sortable: true,
      icon: <Network size={16} />,
      editable: true,
      options: networks,
    },
    {
      key: "district",
      label: "District",
      sortable: true,
      icon: <City size={16} />,
      editable: true,
      options: districts,
    },
    {
      key: "school",
      label: "School",
      sortable: true,
      icon: <GraduationCap size={16} />,
      editable: true,
      options: schools,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      icon: <IdentificationCard size={18} />,
      editable: true,
      options: roles,
    },
    {
      key: "user_type",
      label: "User Type",
      sortable: true,
      icon: <IdentificationCard size={18} />,
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
        district: updatedRow.district,
        school: updatedRow.school,
        network: updatedRow.network,
        user_role: updatedRow.role,
        user_type: updatedRow.user_type,
      };
      const response = await editUser(updatedRow.id, data);

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
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (selectedIds: string[]) => {
    try {
      const response = await archiveUser({ ids: selectedIds });

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
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (selectedIds: string[]) => {
    try {
      const response = await restoreUser({ ids: selectedIds });
      console.log("responseresponseresponse", response);
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
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
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
    if (key == "email") {
      key = "email_id";
    }
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
    getNetworks();
    getSchoolData();
    fetchAllDistrictsInfo();
    fetchData(
      currentPage,
      rowsPerPage,
      sortField,
      sortDirection,
      isArchived,
      searchQuery
    );
  }, [searchQuery]);

  const fetchAllDistrictsInfo = async () => {
    const payload: getDistrictsPayload = {
      is_archived: null,
      network_id: null,
      sort_by: null,
      sort_order: null,
      page: 1,
      limit: 100,
      search: null,
    };
    const response = await fetchAllDistricts(payload);
    if (response.success) {
      const formattedDistricts = response.data.districts.map((district: any) => ({
        id: district._id,
        label: district.name,
      }));
      setDistricts(formattedDistricts);
    } else {
      setDistricts([]);
    }
  };

  const getNetworks = async () => {
    const requestPayload = {
      is_archived: isArchived,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null, // Don't send empty strings
    };

    const response = await getNetwork(requestPayload);
    const formattedNetworks = response.data.networks.map((network: any) => ({
      id: network.id,
      label: network.name,
    }));

    setNetworks(formattedNetworks);
    console.log("responseresponseresponse", response);
  };

  const getSchoolData = async () => {
    const requestPayload = {
      is_archived: isArchived,
      sort_by: null,
      sort_order: null,
      curr_page: 1,
      per_page: 100,
      search: null,
    };

    const response = await getSchools(requestPayload);
    const formattedSchools = response.data.schools.map((school: any) => ({
      id: school.id,
      label: school.name,
    }));

    setSchools(formattedSchools);
  };

  return (
    <div className="container text-center mx-auto px-4 py-8 bg-white">
      <h1 className="text-2xl text-center text-black-400 mb-2">Users</h1>
      <div>
        <p className="text-center text-[16px] text-[#454F5B]-400 mb-2">
          Browse all users across districts. Add, update, or archive user
          accounts as needed.
        </p>
      </div>

      <Table
        columns={columns}
        data={usersData}
        totalCount={totalCount}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        initialRowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onEdit={handleEdit}
        onSave={handleSave}
        //onDelete={handleDelete}
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
        staticbg={"#6C4996"}
        dynamicbg={"#F9F5FF"}
        onCreate={"/users/new"}
      />
    </div>
  );
}
