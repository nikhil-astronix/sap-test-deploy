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

export interface observationSessionPayload {
  filter_type: string;
  search: string;
  sort_by: string | null;
  sort_order: "asc" | "desc" | null;
  page: number;
  limit: number;
}

export interface editObservationSessionPayload {
  id: any;
  date: string;
  start_time: string;
  end_time: string;
  district: string;
  school: string;
  classrooms: string[];
  observation_tool: string;
  users: string[];
  session_admin: string;
}