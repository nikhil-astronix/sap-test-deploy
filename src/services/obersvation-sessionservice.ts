import apiClient from "@/api/axiosInterceptor";
import {
	FetchAllSessionsRequestPayload,
	ObservationSessionData,
} from "@/types/userData";

export const getSessions = async (
	requestPayload: FetchAllSessionsRequestPayload
) => {
	try {
		const response = await apiClient.get(`/v1/observation_session`, {
			params: requestPayload,
		});
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};

export const editSession = async (
	observation_session_id: string,
	data: ObservationSessionData
) => {
	try {
		const response = await apiClient.post(
			`/v1/observation_session/edit_observation_session/${observation_session_id}`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};

export const createSession = async (data: ObservationSessionData) => {
	try {
		const response = await apiClient.post(
			"/v1/observation_session/create_observation_session",
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};

export const archiveSessions = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.post(
			`/v1/observation_session/archive_observation_sessions`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};

export const restoreSessions = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.post(
			`/v1/observation_session/restore_observation_sessions`,
			data
		);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};

export const deleteSessions = async (data: { ids: string[] }) => {
	try {
		const response = await apiClient.post(`/v1/session/delete_sessions`, data);
		return { success: true, data: response.data };
	} catch (error) {
		console.error("session service error:", error);
		return { success: false, error };
	}
};
