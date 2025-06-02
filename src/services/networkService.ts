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

export const getSessionsByNetwork = async (filter_type: SessionFilterType = 'all') => {
  try {
    // Add filter_type as a query parameter to filter sessions on the server side
    const response = await apiClient.get(`/v1/dashboard/network-admin-observation-sessions?filter_type=${filter_type}`);
    // If your API doesn't support this parameter yet, you can filter here on the client side
    /*
    if (filter_type !== 'all' && response.data && response.data.sessions) {
      const currentDate = new Date();
      const filteredSessions = response.data.sessions.filter((session: any) => {
        const sessionDate = new Date(session.date);
        
        switch (filter_type) {
          case 'today':
            return (
              sessionDate.getDate() === currentDate.getDate() &&
              sessionDate.getMonth() === currentDate.getMonth() &&
              sessionDate.getFullYear() === currentDate.getFullYear()
            );
          case 'upcoming':
            return sessionDate > currentDate;
          case 'past':
            return sessionDate < currentDate;
          default:
            return true;
        }
      });
      
      response.data.sessions = filteredSessions;
    }
    */
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};  