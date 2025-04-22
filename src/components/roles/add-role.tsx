'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { addRole, updateRole } from '@/app/actions/role'    
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { IAddRole } from '@/types/role'

interface Permission {
  id: string
  name: string
  route: string
  actions: {
    id: string
    name: string
    key: 'view' | 'create' | 'update' | 'delete'
  }[]
}

const permissions: Permission[] = [
  {
    id: '1',
    name: 'Thống kê',
    route: '/dashboard',
    actions: [
      { id: '1-1', name: 'Xem', key: 'view' },
      { id: '1-2', name: 'Tạo mới', key: 'create' },
      { id: '1-3', name: 'Cập nhật', key: 'update' },
      { id: '1-4', name: 'Xóa', key: 'delete' }
    ]
  },
  {
    id: '2',
    name: 'Thành viên',
    route: '/dashboard/users',
    actions: [
      { id: '2-1', name: 'Xem', key: 'view' },
      { id: '2-2', name: 'Tạo mới', key: 'create' },
      { id: '2-3', name: 'Cập nhật', key: 'update' },
      { id: '2-4', name: 'Xóa', key: 'delete' }
    ]
  },
  {
    id: '3',
    name: 'Form',
    route: '/dashboard/forms',
    actions: [
      { id: '3-1', name: 'Xem', key: 'view' },
      { id: '3-2', name: 'Tạo mới', key: 'create' },
      { id: '3-3', name: 'Cập nhật', key: 'update' },
      { id: '3-4', name: 'Xóa', key: 'delete' }
    ]
  },
  {
    id: '4',
    name: 'Category',
    route: '/dashboard/categories',
    actions: [
      { id: '4-1', name: 'Xem', key: 'view' },
      { id: '4-2', name: 'Tạo mới', key: 'create' },
      { id: '4-3', name: 'Cập nhật', key: 'update' },
      { id: '4-4', name: 'Xóa', key: 'delete' }
    ]
  },
  {
    id: '5',
    name: 'Phân quyền',
    route: '/dashboard/roles',
    actions: [
      { id: '5-1', name: 'Xem', key: 'view' },
      { id: '5-2', name: 'Tạo mới', key: 'create' },
      { id: '5-3', name: 'Cập nhật', key: 'update' },
      { id: '5-4', name: 'Xóa', key: 'delete' }
    ]
  },
  {
    id: '6',
    name: 'Report',
    route: '/dashboard/reports',
    actions: [
      { id: '6-1', name: 'Xem', key: 'view' },
      { id: '6-2', name: 'Tạo mới', key: 'create' },
      { id: '6-3', name: 'Cập nhật', key: 'update' },
      { id: '6-4', name: 'Xóa', key: 'delete' }
    ]
  }
]

interface AddRoleComponentProps {
  roleId?: string
  initialData?: {
    RoleId: string
    RoleName: string
    CreatedDate: string
    Permission: Array<{
      ActionName: string
      Route: string
    }>
  }
}

export default function AddRoleComponent({ roleId, initialData }: AddRoleComponentProps) {
  const [roleName, setRoleName] = useState(initialData?.RoleName || '')
  const [description, setDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Khởi tạo selectedPermissions từ initialData
  useEffect(() => {
    if (initialData) {
      const initialPermissions: Record<string, boolean> = {}
      
      // Lặp qua từng permission trong danh sách permissions
      permissions.forEach(permission => {
        // Tìm các action của permission hiện tại trong initialData
        const permissionActions = initialData.Permission.filter(
          action => action.Route.startsWith(permission.route)
        )

        // Nếu có action của permission này
        if (permissionActions.length > 0) {
          // Lặp qua từng action của permission
          permission.actions.forEach(action => {
            // Tìm action tương ứng trong initialData
            const matchingAction = permissionActions.find(
              initAction => 
                initAction.ActionName === action.name && 
                initAction.Route === `${permission.route}/${action.key}`
            )
            
            // Nếu tìm thấy action tương ứng, đánh dấu là đã chọn
            if (matchingAction) {
              initialPermissions[`${permission.id}-${action.id}`] = true
            }
          })
        }
      })

      setSelectedPermissions(initialPermissions)
    }
  }, [initialData])

  const handlePermissionChange = (permissionId: string, actionId: string) => {
    const key = `${permissionId}-${actionId}`
    setSelectedPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelectAllForPermission = (permissionId: string, checked: boolean) => {
    const newPermissions = { ...selectedPermissions }
    permissions
      .find((p) => p.id === permissionId)
      ?.actions.forEach((action) => {
        newPermissions[`${permissionId}-${action.id}`] = checked
      })
    setSelectedPermissions(newPermissions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!roleName.trim()) {
      toast.error('Vui lòng nhập tên vai trò')
      setIsLoading(false)
      return
    }

    const permissionsFormatted = permissions.reduce((acc, permission) => {
      const selectedActions = permission.actions
        .filter(action => selectedPermissions[`${permission.id}-${action.id}`])
        .map(action => ({
          ActionName: action.name,
          Route: `${permission.route}/${action.key}`
        }))
      
      return [...acc, ...selectedActions]
    }, [] as Array<{ ActionName: string; Route: string }>)

    const formData = {
      PermissionName: roleName,
      Actions: permissionsFormatted
    } as IAddRole

    try {
      let response
      if (roleId) {
        console.log(12234)
        // Gọi API sửa role
        const res = await updateRole(roleId, formData)
        console.log(res,'res')
        const data = res.data
        response = {
          success: res.success,
          message: data.message,
          data: data.data
        }
      } else {
        console.log(formData,'cccc')
        // Gọi API thêm role
        response = await addRole(formData)
        console.log(response,'response')
      }

      if (response.success) {
        toast.success(roleId ? 'Đã cập nhật vai trò' : 'Đã tạo vai trò mới')
        router.push('/dashboard/roles')
      } else {
        toast.error(response.message || 'Có lỗi xảy ra. Vui lòng thử lại')
      }
    } catch (error) {
      toast.error('Lỗi kết nối đến server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className='container mx-auto py-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {roleId ? 'Sửa vai trò' : 'Thêm vai trò mới'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <Card className='p-6'>
            <div className='grid gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Tên vai trò</Label>
                <Input
                  id='name'
                  placeholder='Nhập tên vai trò'
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <h2 className='text-xl font-semibold mb-6'>Phân quyền</h2>
            <div className='space-y-6'>
              {permissions.map((permission) => (
                <div key={permission.id} className='p-4 rounded-lg border dark:border-gray-700'>
                  <div className='flex items-center gap-4 mb-4'>
                    <Checkbox
                      id={`select-all-${permission.id}`}
                      checked={permission.actions.every(
                        (action) => selectedPermissions[`${permission.id}-${action.id}`]
                      )}
                      onCheckedChange={(checked) => handleSelectAllForPermission(permission.id, checked as boolean)}
                    />
                    <Label htmlFor={`select-all-${permission.id}`} className='text-lg font-medium'>
                      {permission.name}
                    </Label>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 ml-8'>
                    {permission.actions.map((action) => (
                      <div key={action.id} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`${permission.id}-${action.id}`}
                          checked={selectedPermissions[`${permission.id}-${action.id}`] || false}
                          onCheckedChange={() => handlePermissionChange(permission.id, action.id)}
                        />
                        <Label htmlFor={`${permission.id}-${action.id}`}>{action.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : roleId ? 'Cập nhật' : 'Tạo vai trò'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
