import apiClient from "@/api/axiosInterceptor";
import {
  fetchDistrictsPayload,
  fetchObservationToolsPayload,
  fetchUsersPayload,
} from "@/models/dashboard";

export const fetchDistricts = async (requestPayload: fetchDistrictsPayload) => {
  try {
    const response = await apiClient.get(
      "/v1/dashboard/system-admin-districts",
      {
        params: requestPayload,
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching districts:", error);
    return { success: false, error };
  }
};

export const fetchUsers = async (requestPayload: fetchUsersPayload) => {
  try {
    const response = await apiClient.get("/v1/dashboard/system-admin-users", {
      params: requestPayload,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching users:", error);
    return { success: false, error };
  }
};

export const fetchObservationTools = async (
  requestPayload: fetchObservationToolsPayload
) => {
  try {
    const response = await apiClient.get("/v1/dashboard/system-admin-tools", {
      params: requestPayload,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching Observation tools:", error);
    return { success: false, error };
  }
};
