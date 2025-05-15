import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3003",
  withCredentials: true,
});

// Intercepteur pour les réponses (simplifié)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
