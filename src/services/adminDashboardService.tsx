import apiClient from "@/api/axiosInterceptor";
import {
  fetchDistrictsPayload,
  fetchObservationToolsPayload,
  fetchUsersPayload,
  observationSessionPayload,
  editObservationSessionPayload
} from "@/models/dashboard";

export const fetchSchools = async (requestPayload: fetchDistrictsPayload) => {
  try {
    const response = await apiClient.get(
      "/v1/dashboard/district-admin-schools",
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

export const fetchRecentLogins = async (requestPayload: fetchUsersPayload) => {
  try {
    const response = await apiClient.get(
      "/v1/dashboard/district-admin-recent-logins",
      {
        params: requestPayload,
      }
    );
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
    const response = await apiClient.get(
      "/v1/dashboard/district-admin-observation-tools",
      {
        params: requestPayload,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching Observation tools:", error);
    return { success: false, error };
  }
};

export const districtAdminObservationSessions = async (
  requestPayload: observationSessionPayload
) => {
  try {
    const response = await apiClient.get(
      "/v1/dashboard/district-admin-observation-sessions",
      {
        params: requestPayload,
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching Observation tools:", error);
    return { success: false, error };
  }
};

export const editObservationSession = async (
  requestPayload: editObservationSessionPayload
) => {
  try {
    const response = await apiClient.post(
      `/v1/observation_session/edit_observation_session/${requestPayload.id}`,
      requestPayload
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while editing observation session:", error);
    return { success: false, error };
  }
};

export const observerObservationSessions = async (
  requestPayload: observationSessionPayload
) => {
  try {
    const response = await apiClient.get("/v1/dashboard/observer-sessions", {
      params: requestPayload,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching Observation tools:", error);
    return { success: false, error };
  }
};
