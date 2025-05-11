import apiClient from "@/api/axiosInterceptor";
import { curriculumData, curriculumOptions } from "@/types/userData";

export const createCurriculum = async (data: curriculumData) => {
  try {
    const response = await apiClient.post("/v1/curriculum", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("curriculum service error:", error);
    return { success: false, error };
  }
};

export const getCurriculums = async (obj: curriculumOptions) => {
  try {
    const response = await apiClient.get("/v1/curriculum", { params: obj });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("curriculum service error:", error);
    return { success: false, error };
  }
};

export const editCurriculum = async (
  curriculum_id: string,
  data: curriculumData
) => {
  try {
    const response = await apiClient.put(
      `/v1/curriculum/${curriculum_id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("curriculum service error:", error);
    return { success: false, error };
  }
};

export const archiveUser = async (curriculum_id: string) => {
  try {
    const response = await apiClient.put(
      `/v1/curriculum/${curriculum_id}/archive`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("curriculum service error:", error);
    return { success: false, error };
  }
};
