import apiClient from "@/api/axiosInterceptor";
import { userData, fetchUsersRequestPayload } from "@/types/userData";
// Replace with actual endpoint

export const createUser = async (data: userData) => {
  try {
    const response = await apiClient.post("/v1/user/create_user", data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const getUser = async (requestPayload: fetchUsersRequestPayload) => {
  try {
    const response = await apiClient.get(`/v1/user`, {
      params: requestPayload,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const editUser = async (user_id: string, data: userData) => {
  try {
    const response = await apiClient.post(
      `/v1/user/edit_user/${user_id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const archiveUser = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/user/archive_users`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const restoreUser = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(`/v1/user/restore_users`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`/v1/user/current_user`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("user profile service error:", error);
    return { success: false, error };
  }
};
