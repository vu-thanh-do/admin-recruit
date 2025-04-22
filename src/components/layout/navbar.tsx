// src/components/layout/navbar.tsx
"use client"

import { useState, useEffect } from 'react'
import { MoonStar, Search, Bell, User, Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Notification, NotificationIcons } from '@/types/notification'
import { signOut, useSession } from 'next-auth/react'
import { useNotifications } from '@/lib/react-query/queries/notification'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'

interface NotificationResponse {
    status: number
    message: string
    data: Notification[]
    pagination: {
        totalDocs: number
        limit: number
        totalPages: number
        page: number
        hasPrevPage: boolean
        hasNextPage: boolean
        prevPage: number | null
        nextPage: number | null
    }
}

export default function Navbar() {
    const { setTheme, theme } = useTheme()
    const [searchOpen, setSearchOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const { data: session } = useSession()
    const [page, setPage] = useState(1)
    const { ref: loadMoreRef, inView } = useInView()
    const [selectedTab, setSelectedTab] = useState('all')
    
    const {
        data: notificationData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery<NotificationResponse>({
        queryKey: ['notifications', selectedTab],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?page=${pageParam}&limit=10`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch notifications')
            }
            return response.json()
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.hasNextPage) {
                return lastPage.pagination.nextPage
            }
            return undefined
        },
        initialPageParam: 1
    })

    // Loại bỏ các thông báo trùng lặp bằng cách sử dụng Map
    const notifications = React.useMemo(() => {
        if (!notificationData?.pages) return []
        
        const uniqueNotifications = new Map()
        notificationData.pages.forEach((page: NotificationResponse) => {
            page.data.forEach((notification: Notification) => {
                if (!uniqueNotifications.has(notification._id)) {
                    uniqueNotifications.set(notification._id, notification)
                }
            })
        })
        
        return Array.from(uniqueNotifications.values())
    }, [notificationData])

    const unreadCount = notifications.filter(n => !n.isRead).length
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-read/${id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!response.ok) throw new Error('Failed to mark notification as read')
            
            // Refresh notifications
            refetch()
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }
    
    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!response.ok) throw new Error('Failed to mark all notifications as read')
            
            // Refresh notifications
            refetch()
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }
    
    // Handle notification click
    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id)
        }
        // Tạm thời comment phần navigate
        // window.location.href = notification.metadata.link
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm transition-all">
            <div className="flex flex-1 items-center gap-4">
                {searchOpen ? (
                    <div className="flex w-full max-w-sm items-center">
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="rounded-r-none focus-visible:ring-0"
                            autoFocus
                            onBlur={() => setSearchOpen(false)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 rounded-l-none border border-l-0"
                            onClick={() => setSearchOpen(false)}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                    {unreadCount}
                                </span>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h4 className="font-medium">Thông báo</h4>
                            {unreadCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={markAllAsRead}
                                    className="h-8 text-xs"
                                >
                                    <Check className="h-3 w-3 mr-1" />
                                    Đánh dấu tất cả đã đọc
                                </Button>
                            )}
                        </div>
                        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="w-full border-b rounded-none h-10">
                                <TabsTrigger value="all" className="flex-1">Tất cả</TabsTrigger>
                                <TabsTrigger value="unread" className="flex-1">
                                    Chưa đọc
                                    {unreadCount > 0 && (
                                        <span className="ml-1 text-xs rounded-full bg-primary text-primary-foreground px-1.5">
                                            {unreadCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <NotificationList 
                                    notifications={notifications} 
                                    onNotificationClick={handleNotificationClick}
                                    isLoading={isLoading}
                                    loadMoreRef={loadMoreRef}
                                    hasNextPage={hasNextPage}
                                    isFetchingNextPage={isFetchingNextPage}
                                />
                            </TabsContent>
                            <TabsContent value="unread">
                                <NotificationList 
                                    notifications={notifications.filter(n => !n.isRead)} 
                                    onNotificationClick={handleNotificationClick}
                                    isLoading={isLoading}
                                    loadMoreRef={loadMoreRef}
                                    hasNextPage={hasNextPage}
                                    isFetchingNextPage={isFetchingNextPage}
                                />
                            </TabsContent>
                        </Tabs>
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <MoonStar className="h-5 w-5" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session?.user?.Avatar} alt="User" />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                                    {session?.user?.Username?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.Username}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer'>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

// NotificationList component
function NotificationList({ 
    notifications, 
    onNotificationClick, 
    isLoading,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage
}: {
    notifications: Notification[]
    onNotificationClick: (notification: Notification) => void
    isLoading: boolean
    loadMoreRef: (node?: Element | null) => void
    hasNextPage: boolean
    isFetchingNextPage: boolean
}) {
    if (isLoading) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p>Đang tải thông báo...</p>
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p>Không có thông báo nào</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-[400px]">
            <div className="divide-y">
                {notifications.map((notification) => (
                    <div 
                        key={notification._id} 
                        className={`flex items-start p-4 gap-3 cursor-pointer transition-colors ${
                            notification.isRead 
                                ? 'bg-background hover:bg-muted/50' 
                                : 'bg-muted/20 hover:bg-muted/30'
                        }`}
                        onClick={() => onNotificationClick(notification)}
                    >
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            {NotificationIcons[notification.type] || NotificationIcons.default}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                </p>
                                <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                            <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                                {notification.content}
                            </p>
                            <div className="text-xs mt-1 text-muted-foreground">
                                {notification.metadata.requesterName} ({notification.metadata.requesterCode})
                            </div>
                        </div>
                        {!notification.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1"></div>
                        )}
                    </div>
                ))}
                {hasNextPage && (
                    <div ref={loadMoreRef} className="py-4 text-center text-muted-foreground">
                        {isFetchingNextPage ? 'Đang tải thêm...' : 'Cuộn để tải thêm'}
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}