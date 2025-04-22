import { apiClient } from "../react-query/apiClient"

export async function getLogs(page: number = 1) {
    const response = await apiClient.get(`/logs/get-all-logs?page=${page}`)
    return response.data
}
