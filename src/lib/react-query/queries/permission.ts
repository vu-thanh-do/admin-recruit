import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

interface UsePermissionParams {
    page?: number;
    limit?: number;
    search?: string;
  }
// ✅ Hook dùng để fetch danh sách permission
export const usePermission = ({ page = 1, limit = 20, search = '' }: UsePermissionParams = {}) => {
    return useQuery({
    queryKey: ['permission', page, limit, search],
      queryFn: async () => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        const { data } = await apiClient.get(`/api/get-role?${params}`);
        return data;
      }
    });
  }