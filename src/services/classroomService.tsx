import apiClient from "@/api/axiosInterceptor";
import { fetchClassroomRequestPayload, classroomData } from "@/types/userData";
export const getClassroom = async (
	requestPayload: fetchClassroomRequestPayload
) => {
	try {
		const response = await apiClient.get(`/v1/classrooms`, {
			params: requestPayload,
		});
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const editClassroom = async (
	classroom_id: string,
	data: classroomData
) => {
	try {
		const response = await apiClient.post(
			`/v1/classrooms/edit_classroom/${classroom_id}`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};
export const createClassroom = async (data: classroomData) => {
	try {
		const response = await apiClient.post(
			"/v1/classrooms/create_classroom",
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const archiveClassroom = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.patch(
			`/v1/classrooms/archive_classroom`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const restoreClassroom = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.patch(
			`/v1/classrooms/restore_classroom`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const deleteClassroom = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.post(`/v1/classrooms/delete`, data);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};

export const getClassroomsBySchool = async (school_id: string) => {
	try {
		const response = await apiClient.get(`/v1/classrooms/school/${school_id}`);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("user profile service error:", error);
		return { success: false, error };
	}
};
