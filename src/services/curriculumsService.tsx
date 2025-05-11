import apiClient from "@/api/axiosInterceptor";
import {
  createCurriculumPayload,
  fetchCurriculumsRequestPayload,
} from "@/models/curriculum";

export const fetchAllCurriculums = async (
  requestPayload: fetchCurriculumsRequestPayload
) => {
  try {
    const response = await apiClient.get("/v1/curriculum", {
      params: requestPayload,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching curriculums:", error);
    return { success: false, error };
  }
};

export const fetchCurriculumById = async (id: number) => {
  try {
    const response = await apiClient.get(`/v1/curriculum/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching curriculum by id:", error);
    return { success: false, error };
  }
};

export const createCurriculum = async (data: createCurriculumPayload) => {
  try {
    const response = await apiClient.post("/v1/curriculum", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while creating curriculum:", error);
    return { success: false, error };
  }
};

export const updateCurriculumById = async (
  id: string,
  requestBody: createCurriculumPayload
) => {
  try {
    const response = await apiClient.put(`/v1/curriculum/${id}`, requestBody);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching curriculum by id:", error);
    return { success: false, error };
  }
};

export const archiveCurriculumById = async (id: string) => {
  try {
    const response = await apiClient.put(`/v1/curriculum/${id}/archive`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while archiving curriculum by id:", error);
    return { success: false, error };
  }
};

export const unArchiveCurriculumById = async (id: string) => {
  try {
    const response = await apiClient.put(`/v1/curriculum/${id}/unarchive`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while unarchiving curriculum by id:", error);
    return { success: false, error };
  }
};
