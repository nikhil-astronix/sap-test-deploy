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