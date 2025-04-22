import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../apiClient";

// Types
export interface LineMfg {
  _id: string;
  nameLine: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    nameLineBefore: string;
    updatedAt: string;
  }>;
}

export interface LineMfgResponse {
  docs: LineMfg[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Lấy danh sách line với phân trang và tìm kiếm
export const useGetAllLineMfg = (page = 1, limit = 10, search = "") => {
  return useQuery<LineMfgResponse>({
    queryKey: ["lines-mfg", page, limit, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("limit", limit.toString());
      if (search) searchParams.append("search", search);
      
      const { data } = await apiClient.get(`/lineMfg/getAllLineMfg?${searchParams.toString()}`);
      return data;
    },
  });
};

// Tạo line mới
export const useCreateLineMfg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nameLine: string) => {
      const { data } = await apiClient.post("/lineMfg/createLine", { nameLine });
      return data;
    },
    onSuccess: () => {
      toast.success("Tạo line thành công");
      queryClient.invalidateQueries({ queryKey: ["lines-mfg"] });
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tạo line: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Cập nhật line
export const useUpdateLineMfg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, nameLine }: { id: string; nameLine: string }) => {
      const { data } = await apiClient.put(`/lineMfg/updateLine/${id}`, { nameLine });
      return data;
    },
    onSuccess: () => {
      toast.success("Cập nhật line thành công");
      queryClient.invalidateQueries({ queryKey: ["lines-mfg"] });
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi cập nhật line: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Toggle trạng thái line (active/inactive)
export const useToggleLineMfg = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/lineMfg/toggleLine/${id}`);
      return data;
    },
    onSuccess: (data) => {
      const statusText = data.line.status ? "kích hoạt" : "vô hiệu hóa";
      toast.success(`Line đã được ${statusText}`);
      queryClient.invalidateQueries({ queryKey: ["lines-mfg"] });
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi thay đổi trạng thái line: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Tải template Excel
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get("/lineMfg/downloadTemplate", {
        responseType: "blob",
      });
      // Tạo URL và tải xuống file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template-linemfg.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi tải template: ${error.message}`);
    },
  });
};

// Import dữ liệu từ Excel
export const useImportExcel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const { data } = await apiClient.post("/lineMfg/importExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Import dữ liệu thành công");
      queryClient.invalidateQueries({ queryKey: ["lines-mfg"] });
    },
    onError: (error: any) => {
      toast.error(`Lỗi khi import dữ liệu: ${error.response?.data?.message || error.message}`);
    },
  });
};
  
