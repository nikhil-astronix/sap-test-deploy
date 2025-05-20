export interface Intervention {
  id: string;
  type: InterventionType;
  name: string;
  description: string;
  isArchived: boolean;
  district_id: string;
}

export enum InterventionType {
  Custom = "Custom",
  Default = "Default",
}

export interface CreateIntervention {
  type: InterventionType;
  name: string;
  description: string;
  district_id: string;
}
