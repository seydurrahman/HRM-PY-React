import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Inject JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  console.log("DEBUG TOKEN:", token);  // <-- KEEP THIS FOR NOW

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
