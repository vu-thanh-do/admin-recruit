'use client'
import React, { useState, useEffect }  from 'react'
import AddRoleComponent from './add-role'
import { getRoleById } from '@/app/actions/role'  
interface RoleData {
  RoleId: string
  RoleName: string
  CreatedDate: string
  Permission: Array<{
    ActionName: string
    Route: string
  }>
}
export default function EditRole({ id }: { id: string }) {
  console.log(id, 'idccc2')
  const [roleData, setRoleData] = useState<RoleData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setIsLoading(true)
        const response = await getRoleById(id)
        console.log(response, 'response')
        if (response.success) {
          setRoleData(response.data.data)
        } else {
          setError(response.message || 'Không thể tải dữ liệu vai trò')
        }
      } catch (error) {
        setError('Lỗi kết nối đến server')
        console.error('Error fetching role:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoleData()
  }, [id])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-500'>{error}</div>
      </div>
    )
  }

  if (!roleData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-muted-foreground'>Không tìm thấy dữ liệu vai trò</div>
      </div>
    )
  }
  return  (
    <>
    <AddRoleComponent roleId={id} initialData={roleData} /></>
  )
}
