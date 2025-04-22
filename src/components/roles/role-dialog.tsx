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
import { RoleForm } from './role-form'

interface RoleDialogProps {
    children: React.ReactNode
    role?: any
}

export default function RoleDialog({ children, role }: RoleDialogProps) {
    const [open, setOpen] = useState(false)

    const handleSave = (data: any) => {
        console.log("Saving user:", data)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {role ? "Edit Role" : "Add New Role"}
                    </DialogTitle>
                    <DialogDescription>
                        {role
                            ? "Update role information and permissions."
                            : "Fill in the information to create a new role."}
                    </DialogDescription>
                </DialogHeader>
                <RoleForm role={role} onSave={handleSave} />
            </DialogContent>
        </Dialog>
    )
}       