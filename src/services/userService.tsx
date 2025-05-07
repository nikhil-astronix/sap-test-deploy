import apiClient from "@/api/axiosInterceptor";
import { userData } from "@/types/userData";
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
