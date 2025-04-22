import { apiClient } from "../react-query/apiClient"

export async function getRoles(page: number = 1) {
    const response = await apiClient.get(`/role/get-role?page=${page}`)
    return response.data
}
