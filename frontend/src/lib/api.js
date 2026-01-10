import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Inject JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  console.log("DEBUG TOKEN:", token); // <-- KEEP THIS FOR NOW

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: if we get 401, try to refresh the access token and retry once
api.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;

  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      // No refresh token available — force login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshToken,
      });
      const newAccess = res.data.access;
      localStorage.setItem("access_token", newAccess);
      // Update defaults and original request header
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
      }
      return api(originalRequest);
    } catch (err) {
      // Refresh failed — clear tokens and force login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
});

export default api;
