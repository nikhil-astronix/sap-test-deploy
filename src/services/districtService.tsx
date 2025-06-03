import apiClient from "@/api/axiosInterceptor";

export interface districtPayload {
  name: string;
  network_id: string | null;
  state: string;
  city: string;
  enrollment_range: string;
  admins?: string[];
}

export interface getDistrictsPayload {
  is_archived: boolean | null;
  network_id: string | null;
  sort_by: string | null;
  sort_order: string | null;
  page: number;
  limit: number;
  search: string | null;
}

export interface archiveDistrictPayload {
  ids: string[];
}

export const createDistrict = async (payload: districtPayload) => {
  try {
    const response = await apiClient.post("/v1/district", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while creating districts:", error);
    return { success: false, error };
  }
};

export const fetchAllDistricts = async (payload: getDistrictsPayload) => {
  try {
    const response = await apiClient.get("/v1/district", {
      params: payload,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while fetching districts:", error);
    return { success: false, error };
  }
};

export const archiveDistricts = async (payload: archiveDistrictPayload) => {
  try {
    const response = await apiClient.patch("/v1/district/archive", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while archiving districts:", error);
    return { success: false, error };
  }
};

export const unArchiveDistricts = async (payload: archiveDistrictPayload) => {
  try {
    const response = await apiClient.patch("/v1/district/unarchive", payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while un-archiving districts:", error);
    return { success: false, error };
  }
};

export const updateDistrict = async (payload: districtPayload, id: string) => {
  try {
    const response = await apiClient.put("/v1/district/" + id, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error while creating districts:", error);
    return { success: false, error };
  }
};
