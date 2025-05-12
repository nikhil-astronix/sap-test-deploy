import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create an Axios instance with retry logic
const apiClient = axios.create({
  baseURL: "http://35.172.199.63",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: false,
});

// Retry logic configuration
// const MAX_RETRIES = 3;
// const RETRY_DELAY = 2000; // 2 seconds

const retryRequest = async (error: AxiosError, retryCount = 0) => {
  const config = error.config as AxiosRequestConfig & { url: string };
  if (!config) return Promise.reject(error);

  // Don't retry on 401, 403, or 404
  if (
    error.response?.status &&
    [401, 403, 404, 500].includes(error.response.status)
  ) {
    return Promise.reject(error);
  }

  // if (
  //   retryCount < MAX_RETRIES &&
  //   (error.code === "ERR_NETWORK" ||
  //     error.code === "ECONNABORTED" ||
  //     (error.response?.status ?? 0) >= 500)
  // ) {
  //   retryCount++;
  //   console.log(`Retry attempt ${retryCount} of ${MAX_RETRIES}`);
  //   await new Promise((resolve) =>
  //     setTimeout(resolve, RETRY_DELAY * retryCount)
  //   );
  //   return apiClient({ ...config, timeout: 30000 * (retryCount + 1) });
  // }
  return Promise.reject(error);
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userAccessToken");
    console.log("tokentoken", token);
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Network or server error
    if (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      !error.response
    ) {
      console.error("Network Error:", error);
      // Attempt retry
      return retryRequest(error);
    }

    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        break;
      case 403:
        console.error("Forbidden access!");
        break;
      case 404:
        console.error("Resource not found!");
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        console.error("Server error!");
        // Attempt retry for server errors
        return retryRequest(error);
      default:
        console.error("API Error:", error.response?.data || error.toString());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
