import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Department, DepartmentResponse, DepartmentSearchResponse, SyncResponse } from "@/types/company-structure";

const COMPANY_STRUCTURE_API = `${process.env.NEXT_PUBLIC_API_URL}/sync-company-structure`

// API mới cho phòng ban v2
export const useDepartmentsV2 = (search: string = '', page: number = 1, limit: number = 15) => {
    return useQuery<DepartmentResponse>({
        queryKey: ['departments-v2', search, page, limit],
        queryFn: async () => {
            const response = await fetch(
                `${COMPANY_STRUCTURE_API}/all-department-version-2?search=${encodeURIComponent(search)}&limit=${limit}&page=${page}`
            )
            if (!response.ok) throw new Error('Failed to fetch departments')
            return response.json()
        }
    })
}

// Lấy danh sách phòng ban có phân trang
export const useCompanyStructure = () => {
    return useInfiniteQuery<DepartmentResponse>({
        queryKey: ['company-structure'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                `${COMPANY_STRUCTURE_API}/all?page=${pageParam}&limit=10`
            )
            if (!response.ok) throw new Error('Failed to fetch departments')
            return response.json()
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasNextPage) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1
    })
}

// Tìm kiếm phòng ban và lấy cấu trúc cha-con
export const useDepartmentStructure = (name: string) => {
    return useQuery<DepartmentSearchResponse>({
        queryKey: ['department-structure', name],
        queryFn: async () => {
            if (!name) return null
            const response = await fetch(
                `${COMPANY_STRUCTURE_API}/search?name=${encodeURIComponent(name)}`
            )
            if (!response.ok) throw new Error('Failed to fetch department structure')
            return response.json()
        },
        enabled: !!name
    })
}

// Đồng bộ dữ liệu từ hệ thống nhân sự
export const useSyncCompanyStructure = () => {
    return useMutation<SyncResponse>({
        mutationFn: async () => {
            const response = await fetch(COMPANY_STRUCTURE_API, {
                method: 'GET'
            })
            if (!response.ok) throw new Error('Failed to sync company structure')
            return response.json()
        }
    })
}