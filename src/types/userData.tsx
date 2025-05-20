export interface userData {
  first_name: string;
  last_name: string;
  email: string;
  network: string;
  district: string;
  school: string;
  user_role: string;
  user_type: string;
}

export interface curriculumData {
  title: string;
  description: string;
  type: string;
}

export interface curriculumOptions {
  is_archived: boolean;
  type?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface fetchUsersRequestPayload {
  is_archived: boolean;
  sort_by: string | null;
  sort_order: string | null;
  curr_page: number;
  per_page: number;
  search: string | null;
}

export interface fetchNetworkRequestPayload {
  is_archived: boolean;
  sort_by: string | null;
  sort_order: string | null;
  curr_page: number;
  per_page: number;
  search: string | null;
}

export interface networkData {
  state: string;
  name: string;
}

export interface fetchClassroomRequestPayload {
  is_archived: boolean;
  sort_by: string | null;
  sort_order: string | null;
  curr_page: number;
  per_page: number;
  search: string | null;
}

export interface classroomData {
  school_name: "string";
  course: "string";
  teacher_name: "string";
  grades: ["string"];
  class_section: "string";
  interventions: ["string"];
  curriculums: ["string"];
}
