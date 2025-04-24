import { apiClient } from '@/lib/react-query/apiClient'

export async function getUsers(page: number = 1, search: string = '') {
  const { data } = await apiClient.get(`/auth/get-all-users?page=${page}&search=${search}`)
  return data
}

export async function getRoles(page: number = 1) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role/get-role?page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch roles')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export async function createUser(userData: {
  employeeCode: string,
  email: string,
  username: string,
  password: string,
  roleId?: string,
  avatar?: string,
  code?: string
}) {
  const { data } = await apiClient.post('/auth/create-user', userData)
  return data
}

export async function updateUser(id: string, userData: {
  email?: string,
  username?: string,
  password?: string,
  roleId?: string,
  avatar?: string,
  code?: string
}) {
  const { data } = await apiClient.put(`/auth/update-user/${id}`, userData)
  return data
}

export async function deleteUser(id: string) {
  const { data } = await apiClient.delete(`/auth/delete-user/${id}`)
  return data
} 