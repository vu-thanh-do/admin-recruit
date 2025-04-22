import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface UseAllRequestParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  type?: string;
  processingCode?: string;
}

export const useAllRequest = ({ page, limit, search, status, type, processingCode }: UseAllRequestParams) => {
  return useQuery({
    queryKey: ['all-request', page, limit, search, status, type, processingCode],
    queryFn: async () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/requestRecruitment/department/get-all?page=${page}&limit=${limit}`;
      
      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (type) url += `&type=${type}`;
      if (processingCode) url += `&processingCode=${processingCode}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
}