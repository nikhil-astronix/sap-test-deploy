export interface CurriculumCardProps {
  title: string;
  description: string;
  type: "Default" | "Custom";
  isArchived: boolean;
  onEdit: (updatedConfg: CurriculumnUpdatedConfigProps) => void;
  onArchive: () => void;
}

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  type: "Default" | "Custom";
  is_archived: boolean;
}

export interface CurriculumnUpdatedConfigProps {
  title: string;
  description: string;
  type: "Default" | "Custom";
  isArchived: boolean;
}

export interface fetchCurriculumsRequestPayload {
  is_archived: boolean | null;
  type: string | string[] | null;
  sort_by: string | null;
  sort_order: string | null;
  page: number;
  limit: number;
  search: string | null;
  district_id?: string | null;
}

export interface createCurriculumPayload {
  title: string;
  description: string;
  type: string;
  district_id?: string | null;
}
