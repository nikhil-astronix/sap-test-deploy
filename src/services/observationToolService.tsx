import apiClient from "@/api/axiosInterceptor";
import { getObservationTools as getObservationToolsApi } from "@/api/observation-tool/observationToolsApi";

export const createObservationTool = async (data: any) => {
  try {
    const response = await apiClient.post(
      "/v1/observation_tool/create_observation_tool",
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

export const getObservationTools = async (params: any = {}) => {
  try {
    // Get the userIdToken from localStorage
    const bearerToken = typeof window !== 'undefined' ? localStorage.getItem('userIdToken') : null;
    if (!bearerToken) {
      throw new Error('User ID token not found in localStorage');
    }

    // Map params to match the API function's expected keys
    const apiParams = {
      bearerToken,
      currPage: params.curr_page || 1,
      perPage: params.per_page || 10,
      isArchived: typeof params.is_archived === 'boolean' ? params.is_archived : null,
      search: params.search || null,
      sortBy: params.sort_by || 'name',
      sortOrder: params.sort_order || 'asc',
    };

    const response = await getObservationToolsApi(apiParams);
    return { success: true, data: response };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};
