import apiClient from "@/api/axiosInterceptor";

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
