// src/components/auth/login-form.tsx
"use client"

import { useState } from 'react'
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
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authenticate } from '@/app/actions/auth'
import { toast } from 'sonner'

const formSchema = z.object({
  employeeCode: z.string().min(4, {
        message: "Please enter a valid employee code",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
})

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          employeeCode: "",
            password: "",
        },
    })

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
          const res = await authenticate(values.employeeCode, values.password);
          console.log(res, 'resresresres')
            // Here you would normally call your auth service
            if (res?.error) {
              //error
              if (res?.code === 1) {
              toast.error(res?.error || 'Error login');
                return;
              }
              if (res?.code === 2) {
                return;
              }
              toast.error(res?.error || 'Error login');
            } else {
              router.push('/dashboard');
            }

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="employeeCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="your employeeCode"
                                    type="text"
                                    {...field}
                                    className="bg-background/50"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        {...field}
                                        className="bg-background/50"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-end">
                    <Button variant="link" size="sm" className="px-0 font-normal" type="button">
                        Forgot password?
                    </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </Form>
    )
}