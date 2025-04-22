import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});
// ✅ Thêm interceptor để refresh token tự động
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting to login...");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);
