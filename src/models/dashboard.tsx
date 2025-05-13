export interface fetchDistrictsPayload {
  search: string;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
  session_status: string;
  setup_status: string;
  page: number;
  limit: number;
}

export interface fetchUsersPayload {
  search: string;
  user_type: string;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
  page: number;
  limit: number;
}

export interface fetchObservationToolsPayload {
  search: string;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
  page: number;
  limit: number;
}
