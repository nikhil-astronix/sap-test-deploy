import apiClient from "@/api/axiosInterceptor";

export const getCalibarationData = async (
  sessionId: string,
  classroomId: string
) => {
  try {
    const response = await apiClient.post(
      `/v1/observation/get_calibration_data`,
      { session_id: sessionId, classroom_id: classroomId }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("curriculum service error:", error);
    return { success: false, error };
  }
};
