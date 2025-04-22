'use server'

import { IAddRole } from '@/types/role'

export async function addRole(role: IAddRole) {
  try {
    console.log(role, 'role')
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/create-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    })
    console.log(process.env.BACKEND_URL + '/role/create-role', 'process.env.BACKEND_URL + /role/create-role')
    const data = await response.json()
    console.log(data, 'data')
    if (!response.ok) {
      // Lấy thông tin lỗi từ response
      const errorMessage = data.message || data.error || 'Có lỗi xảy ra khi tạo vai trò'
      return {
        status: response.status,
        success: false,
        message: errorMessage
      }
    }

    return {
      status: response.status,
      success: true,
      data
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return {
      status: 500,
      success: false,
      message: 'Lỗi kết nối đến server'
    }
  }
}
export async function getRoleById(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-role-by-id/${id}`)
    const data = await response.json()
    if (!response.ok) {
      return {
        status: response.status,
        success: false,
        message: data.message || data.error || 'Có lỗi xảy ra khi tạo vai trò'
      }
    }
    return {
      status: response.status,
      success: true,
      data
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return {
      status: 500,
      success: false,
      message: 'Lỗi kết nối đến server'
    }
  }
}
export async function updateRole(id: string, role: IAddRole) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/update-role/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    })
    const data = await response.json()
    if (!response.ok) {
      return {
        status: response.status,
        success: false,
        message: data.message || data.error || 'Có lỗi xảy ra khi tạo vai trò'
      }
    } 
    return {
      status: response.status,
      success: true,
      data
    }

  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return {
      status: 500,
      success: false,
      message: 'Lỗi kết nối đến server'
    }
  }
}
