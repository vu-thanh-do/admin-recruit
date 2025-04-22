// /lib/react-query/queries/users.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ✅ Hàm gọi API
const fetchUsers = async () => {
  const { data } = await apiClient.get("/auth/get-all-users");
  return data;
};

// ✅ Hook dùng để fetch danh sách user
export const useUsers = ({ page = 1, limit = 20, search = '' }: UseUsersParams = {}) => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }
      const { data } = await apiClient.get(`/auth/get-all-users?${params}`);
      return data;
    }
  });
}
