// src/components/users/user-form.tsx
"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/lib/api/users'
import { useState, useEffect } from 'react'

// Interface cho role lấy từ API
interface Role {
    RoleId: string
    RoleName: string
    CreatedDate: string
    Permission: any[]
}

// Interface cho response của API roles
interface RolesResponse {
    roles: Role[]
    currentPage: number
    totalPages: number
    totalItems: number
}

const formSchema = z.object({
    employeeCode: z.string().min(2, {
        message: "Mã nhân viên phải có ít nhất 2 ký tự.",
    }),
    code: z.string().optional(),
    email: z.string().email({
        message: "Vui lòng nhập địa chỉ email hợp lệ.",
    }),
    username: z.string().min(2, {
        message: "Tên người dùng phải có ít nhất 2 ký tự.",
    }),
    roleId: z.string().min(1, {
        message: "Vui lòng chọn vai trò.",
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
    }).optional().or(z.literal('')),
    avatar: z.string().optional(),
})

interface UserFormProps {
    user?: any
    onSave: (data: any) => void
    isSubmitting?: boolean
}

export function UserForm({ user, onSave, isSubmitting = false }: UserFormProps) {
    const [roles, setRoles] = useState<Role[]>([])
    
    // Lấy danh sách vai trò từ API
    const { data: rolesData, isLoading: isLoadingRoles } = useQuery<RolesResponse>({
        queryKey: ['roles'],
        queryFn: () => getRoles()
    })
    
    useEffect(() => {
        if (rolesData?.roles) {
            console.log("Roles loaded:", rolesData.roles)
            setRoles(rolesData.roles)
        }
    }, [rolesData])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: user ? {
            employeeCode: user.EmployeeCode || '',
            code: user.Code || '',
            email: user.Email || '',
            username: user.Username || '',
            roleId: user.RoleId || '',
            password: '', // Không lấy mật khẩu cũ
            avatar: user.Avatar || 'image/male.jpg',
        } : {
            employeeCode: '',
            code: '',
            email: '',
            username: '',
            roleId: '4F2BF40B-52D5-41E5-9CC2-B8251B436F4E', // Mặc định là role Admin
            password: '',
            avatar: 'image/male.jpg',
        },
    })

    // Debug values
    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log("Form values:", value)
        })
        return () => subscription.unsubscribe()
    }, [form])

    // Xác định form có bắt buộc nhập mật khẩu hay không
    const isPasswordRequired = !user

    // Validate password riêng dựa trên điều kiện
    useEffect(() => {
        const { password } = form.getValues()
        
        if (isPasswordRequired && (!password || password.length < 6)) {
            form.setError('password', {
                type: 'manual',
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            })
        } else {
            form.clearErrors('password')
        }
    }, [form, isPasswordRequired])

    function onSubmit(values: z.infer<typeof formSchema>) {
        onSave(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="employeeCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã nhân viên</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="VN12345" 
                                    {...field} 
                                    disabled={!!user} // Chỉ cho phép sửa mã khi tạo mới
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã (tùy chọn)</FormLabel>
                            <FormControl>
                                <Input placeholder="Mã hiển thị" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên người dùng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên đầy đủ" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vai trò</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                                disabled={isLoadingRoles}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoadingRoles ? (
                                        <SelectItem value="loading">Đang tải...</SelectItem>
                                    ) : roles.length === 0 ? (
                                        <SelectItem value="none">Không có vai trò nào</SelectItem>
                                    ) : (
                                        roles.map(role => (
                                            <SelectItem key={role.RoleId} value={role.RoleId}>
                                                {role.RoleName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {user ? "Mật khẩu (để trống nếu không thay đổi)" : "Mật khẩu"}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Đang xử lý..." : (user ? "Lưu thay đổi" : "Tạo người dùng")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

