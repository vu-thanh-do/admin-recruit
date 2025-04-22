import { apiClient } from "../react-query/apiClient"

export async function getConfigSystem(group: string) {
    const response = await apiClient.get(`/language?group=${group}`)
    return response.data
}

export async function getAllGroupConfigSystem(limit: number, page: number) {
    const response = await apiClient.get(`/language/get-all-group?limit=${limit}&page=${page}`)
    return response.data
}
