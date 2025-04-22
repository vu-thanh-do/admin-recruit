// src/app/(auth)/login/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
    title: 'Login | Admin Portal',
    description: 'Login to access the admin dashboard',
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 dark:bg-[#0a0a0c] bg-grid-pattern">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <div className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                        Quản lý tuyển dụng
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Đăng nhập vào tài khoản quản lý tuyển dụng
                    </p>
                </div>
                <div className="rounded-lg border border-border/40 bg-card/80 p-6 backdrop-blur-sm">
                    <LoginForm />

                    <div className="mt-4 text-center text-sm">
                        <p className="text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} IS/App. All rights reserved.
                </div>
            </div>
        </div>
    )
}