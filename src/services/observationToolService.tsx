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

export const getObservationTools = async (params: any = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add parameters to query string
    if (params.curr_page) queryParams.append("curr_page", params.curr_page);
    if (params.per_page) queryParams.append("per_page", params.per_page);
    if (params.is_archived)
      queryParams.append("is_archived", params.is_archived);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    const url = `/v1/observation_tool${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await apiClient.get(url);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};
