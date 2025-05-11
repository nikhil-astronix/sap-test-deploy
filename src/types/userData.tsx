export interface userData {
  first_name: string;
  last_name: string;
  email: string;
  state: string;
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
