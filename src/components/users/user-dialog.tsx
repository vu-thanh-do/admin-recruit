// src/components/users/user-dialog.tsx
"use client"

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { UserForm } from '@/components/users/user-form'
import { toast } from 'sonner'
import { createUser, updateUser } from '@/lib/api/users'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UserDialogProps {
    children: React.ReactNode
    user?: any
}

export default function UserDialog({ children, user }: UserDialogProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    
    // Mutation cho việc tạo người dùng mới
    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success('Tạo người dùng thành công')
            setOpen(false)
            // Làm mới danh sách người dùng
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng'
            toast.error(errorMessage)
        }
    })
    
    // Mutation cho việc cập nhật người dùng
    const updateUserMutation = useMutation({
        mutationFn: (data: any) => updateUser(user.UserId, data),
        onSuccess: () => {
            toast.success('Cập nhật người dùng thành công')
            setOpen(false)
            // Làm mới danh sách người dùng
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng'
            toast.error(errorMessage)
        }
    })

    const handleSave = (data: any) => {
        if (user) {
            // Cập nhật người dùng đã tồn tại
            updateUserMutation.mutate(data)
        } else {
            // Tạo người dùng mới
            createUserMutation.mutate(data)
        }
    }

    const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending

    return (
        <Dialog open={open} onOpenChange={(newState) => {
            // Ngăn đóng dialog trong khi đang gửi yêu cầu
            if (isSubmitting && !newState) return
            setOpen(newState)
        }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Cập nhật thông tin và quyền hạn của người dùng."
                            : "Điền thông tin để tạo người dùng mới."}
                    </DialogDescription>
                </DialogHeader>
                <UserForm 
                    user={user} 
                    onSave={handleSave} 
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    )
}       