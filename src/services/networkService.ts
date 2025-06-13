import apiClient from "@/api/axiosInterceptor";
import { fetchNetworkRequestPayload, networkData } from "@/types/userData";
export const getNetwork = async (
	requestPayload: fetchNetworkRequestPayload
) => {
	try {
		const response = await apiClient.get(`/v1/network`, {
			params: requestPayload,
		});
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const editNetwork = async (network_id: string, data: networkData) => {
  try {
	const response = await apiClient.post(
	  `/v1/network/edit_network/${network_id}`,
	  data
	);
	return { success: true, data: response.data };
  } catch (error) {
	console.error("user profile service error:", error);
	return { success: false, error };
  }
};
export const createNetwork = async (data:any) => {
  try {
	const response = await apiClient.post("/v1/network/create_network", data);
	return { success: true, data: response.data };
  } catch (error) {
	console.error("user profile service error:", error);
	return { success: false, error };
  }
};

export const archiveNetwork = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/network/archive_networks`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const restoreNetwork = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/network/restore_networks`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const deleteNetwork = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/network/delete_networks`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const getDistrictsByNetwork = async () => {
  try {
    const response = await apiClient.get(`/v1/dashboard/network-admin-districts`);
    return { success: true, data: response?.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const getObservationToolsByNetwork = async () => {
  try {
    const response = await apiClient.get(`/v1/dashboard/network-admin-observation-tools`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export type SessionFilterType = 'all' | 'today' | 'upcoming' | 'past';

export const getSessionsByNetwork = async (filter_type: SessionFilterType = 'today') => {
  try {
    // Add filter_type as a query parameter to filter sessions on the server side
    const response = await apiClient.get(`/v1/dashboard/network-admin-observation-sessions?filter_type=${filter_type}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};  

export const viewClassroomSession = async (session_id: string) => {
  try {
    const response = await apiClient.get(`/v1/observation/get_observation_classrooms/${session_id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};