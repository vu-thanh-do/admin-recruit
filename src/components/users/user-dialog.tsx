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

interface UserDialogProps {
    children: React.ReactNode
    user?: any
}

export default function UserDialog({ children, user }: UserDialogProps) {
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
                        {user ? "Edit User" : "Add New User"}
                    </DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Update user information and permissions."
                            : "Fill in the information to create a new user."}
                    </DialogDescription>
                </DialogHeader>
                <UserForm user={user} onSave={handleSave} />
            </DialogContent>
        </Dialog>
    )
}       