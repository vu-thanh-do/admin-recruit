import { apiClient } from '@/lib/react-query/apiClient'

export async function getUsers(page: number = 1) {
  const { data } = await apiClient.get(`/auth/get-all-users?page=${page}`)
  return data
} 