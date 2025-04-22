export interface Department {
    _id: number
    name: string
    code: string
    parentId: number | null
    managerId: string | null
    flowPICId: string | null
    isActive: boolean
    branchId: number | null
    orderId: number | null
}

export interface DepartmentResponse {
    docs: Department[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}

export interface DepartmentSearchResponse {
    message: string
    target: Department
    parents: Department[]
    children: Department[]
}

export interface SyncResponse {
    status: number
    message: string
    data: {
        success: boolean
        message: string
        count: number
    }
} 