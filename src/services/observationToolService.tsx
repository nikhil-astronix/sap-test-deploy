import apiClient from "@/api/axiosInterceptor";
import { getObservationTools as getObservationToolsApi } from "@/api/observation-tool/observationToolsApi";

export const createObservationTool = async (data: any) => {
  try {
    const response = await apiClient.post(
      "/v1/observation_tool/create_observation_tool",
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

export const getObservationTools = async (params: any = {}) => {
  try {
    // Get the userIdToken from localStorage
    const bearerToken =
      typeof window !== "undefined"
        ? localStorage.getItem("userIdToken")
        : null;
    if (!bearerToken) {
      throw new Error("User ID token not found in localStorage");
    }

    // Map params to match the API function's expected keys
    const apiParams = {
      bearerToken,
      currPage: params.curr_page || 1,
      perPage: params.per_page || 10,
      isArchived:
        typeof params.is_archived === "boolean" ? params.is_archived : null,
      search: params.search || null,
      sortBy: params.sort_by || "name",
      sortOrder: params.sort_order || "asc",
    };

    const response = await getObservationToolsApi(apiParams);
    return { success: true, data: response };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

/**
 * Archives multiple observation tools by their IDs
 * @param data Object containing array of observation tool IDs to archive
 * @returns Response object with success status and data or error
 */
export const archiveObservationTools = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(
      "/v1/observation_tool/archive_observation_tools",
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

/**
 * Restores multiple observation tools from archived state by their IDs
 * @param data Object containing array of observation tool IDs to restore
 * @returns Response object with success status and data or error
 */
export const restoreObservationTools = async (data: { ids: string[] }) => {
  try {
    const response = await apiClient.post(
      "/v1/observation_tool/restore_observation_tools",
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

export interface EvidenceDoc {
  name: string;
  mime_type: string;
  s3_file_key: string;
}

export interface QuestionBasedObservation {
  id: string;
  section_id: string;
  question_id: string;
  is_sub_question: boolean;
  responses: string[];
  evidence_text: string;
  evidence_docs: EvidenceDoc[];
}

export interface UpdateObservationData {
  notes: string;
  note_evidence_docs: EvidenceDoc[];
  question_based_observations: QuestionBasedObservation[];
}

export const updateObservation = async ({
  observationId,
  data,
  operationType = "UPDATE_OBSERVATION",
}: {
  observationId: string;
  data: UpdateObservationData;
  operationType?: string;
}) => {
  try {
    // Hardcode the observationId as requested
    const hardcodedObservationId = "681bfc29657ea54c1e1d1b37";
    const response = await apiClient.post(
      `/v1/observation/update_observation/${hardcodedObservationId}?operation_type=${operationType}`,
      data
    );
    console.log("Update Observation Response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update observation error:", error);
    return { success: false, error };
  }
};

export const getObservationToolById = async (toolId: string) => {
  try {
    const bearerToken =
      typeof window !== "undefined"
        ? localStorage.getItem("userIdToken")
        : null;
    if (!bearerToken) {
      throw new Error("User ID token not found in localStorage");
    }
    const response = await apiClient.get(`/v1/observation_tool/${toolId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

export const getObservationClassrooms = async (
  observationId: string,
  sortBy: string = "teacher_name",
  sortOrder: string = "asc",
  currPage: number = 1,
  perPage: number = 10,
  search?: string
) => {
  try {
    if (!observationId) {
      throw new Error("observationId is required");
    }
    const bearerToken =
      typeof window !== "undefined"
        ? localStorage.getItem("userIdToken")
        : null;
    if (!bearerToken) {
      throw new Error("User ID token (bearerToken) is required");
    }
    const params: any = {
      sort_by: sortBy,
      sort_order: sortOrder,
      curr_page: currPage,
      per_page: perPage,
    };
    if (search !== undefined) {
      params.search = search;
    }
    const response = await apiClient.get(
      `/v1/observation/get_observation_classrooms/${observationId}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};

export const getCompleteObservationWithTool = async (observationId: string) => {
  try {
    const bearerToken =
      "eyJraWQiOiJUa3ljbUQ1V1BrQWpTNmEyUUs1R1Myb0hCZHFGQjFTN3V1V012bm9oMXFjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MTViMjVkMC0xMDExLTcwN2YtN2EyYS0xNGU0MmViNjY0YWQiLCJjb2duaXRvOmdyb3VwcyI6WyJzdXBlci1hZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfZmxiT2xSUUZWIiwiY29nbml0bzp1c2VybmFtZSI6IjgxNWIyNWQwLTEwMTEtNzA3Zi03YTJhLTE0ZTQyZWI2NjRhZCIsIm9yaWdpbl9qdGkiOiIxNWYwOWRiZC04NjczLTRjMWEtYWQ0NC03OTgyZWNjNzQ5N2IiLCJhdWQiOiI2ZmFqbG1kM3JhbjJhdWl1NnZxbjFkMDBrdCIsImV2ZW50X2lkIjoiYjBiNDVjNmMtNzdhNC00YzI4LTg1NGEtYjgyODFlOTY5ZmIwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDk3NDM0MzksImV4cCI6MTc0OTgyOTgzOSwiaWF0IjoxNzQ5NzQzNDM5LCJqdGkiOiJhMDkzMWQ1ZS1kMmUyLTRmMDUtODEzOS04N2FkZDBlY2UwMmIiLCJlbWFpbCI6InN1a29maW5vQGFzY2lpYmluZGVyLm5ldCJ9.M_CyotNpuP43YSPI-afpeSSniLL9egFKNSHtNJFhReFHRzJVr9lEwWd-C-u2LUgrEArhj7s9X_2z-c7eASfwAxOTahbSCpdEj0OSwJ4EDSoedAZpPaDgJjsGCI3Ia8vio4t8JB3FKGKBfs5d0oqJ1EFCE0iNpfiAJSPlnUDHrglpkrMpBSqRm95fSHjrLJMDwnLx5wmE5ftyG7NxBavk20_UNRA_z65dDriVZ9SDwFX5UPKP4qXAoVzvnS5jFSVlyK2hEO5WJldeFhG2NqHe6sBziNMP8mM7_6FSHzQPqqjMaYulfQfyAQ6fFhNpL0ZZVW2631xNiy3kEmRfWt7A-Q";
    if (!bearerToken) {
      throw new Error("User ID token not found in localStorage");
    }
    const response = await apiClient.get(
      `/v1/observation/complete_observation_with_observation_tool/${observationId}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Observation tool service error:", error);
    return { success: false, error };
  }
};
