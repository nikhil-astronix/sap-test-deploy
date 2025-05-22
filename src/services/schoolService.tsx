import apiClient from "@/api/axiosInterceptor";
import { schoolData } from "@/types/userData";

export const getSchools = async (obj: any) => {
  try {
    const response = await apiClient.get("/v1/school/schools", { params: obj });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("intervention service error:", error);
    return { success: false, error };
  }
};

export const archiveSchool = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/school/schools/archive`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const restoreSchool = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/school/schools/restore`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const editSchool = async (school_id: string, data: schoolData) => {
  try {
    const response = await apiClient.put(
      `/v1/school/schools/${school_id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("school service error:", error);
    return { success: false, error };
  }
};

export const deleteSchool = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.delete(`/v1/school/schools/delete`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};
