import apiClient from "@/api/axiosInterceptor";
import { CreateIntervention, Intervention } from "@/types/intervationData";

export const createInterventions = async (data: CreateIntervention) => {
  try {
    const response = await apiClient.post(
      "/v1/intervention/create_intervention",
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("intervention service error:", error);
    return { success: false, error };
  }
};

export const getInterventions = async (obj: any) => {
  try {
    const response = await apiClient.get("/v1/intervention", { params: obj });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Intervention service error:", error);
    return { success: false, error };
  }
};

export const editInterventions = async (
  intervention_id: string,
  data: CreateIntervention
) => {
  console.log("intervention_id", intervention_id, data);
  try {
    const response = await apiClient.post(
      `/v1/intervention/edit_intervention/${intervention_id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Intervention service error:", error);
    return { success: false, error };
  }
};

export const archiveIntervention = async (intervention_id: string) => {
  try {
    const response = await apiClient.patch(
      `/v1/intervention/archive_intervention/${intervention_id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("intervention service error:", error);
    return { success: false, error };
  }
};

export const restoreIntervention = async (intervention_id: string) => {
  try {
    const response = await apiClient.patch(
      `/v1/intervention/restore_intervention/${intervention_id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("restore intervention service error:", error);
    return { success: false, error };
  }
};
