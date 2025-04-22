"use client"

import React, { useState } from 'react'
import { useCompanyStructure, useDepartmentStructure, useSyncCompanyStructure } from '@/lib/react-query/queries/companyStructure'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RefreshCw, ChevronRight } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { useInView } from 'react-intersection-observer'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export default function CompanyStructure() {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const { ref: loadMoreRef, inView } = useInView()

    const {
        data: departmentsData,
        isLoading: isLoadingDepartments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useCompanyStructure()

    const {
        data: departmentStructure,
        isLoading: isLoadingStructure
    } = useDepartmentStructure(debouncedSearch)

    const {
        mutate: syncStructure,
        isPending: isSyncing
    } = useSyncCompanyStructure()

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const departments = React.useMemo(() => {
        if (!departmentsData?.pages) return []
        return departmentsData.pages.flatMap(page => page.docs)
    }, [departmentsData])

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Sơ đồ tổ chức công ty</h1>
                <Button 
                    onClick={() => syncStructure()} 
                    disabled={isSyncing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    Đồng bộ dữ liệu
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Danh sách phòng ban */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách phòng ban</CardTitle>
                        <CardDescription>
                            Tất cả các phòng ban trong công ty
                        </CardDescription>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm phòng ban..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            {isLoadingDepartments ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {departments.map((dept,index) => (
                                        <div
                                            key={`dept-${dept._id}-${dept.code}-${index}`}
                                            className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => setSearchTerm(dept.name)}
                                        >
                                            <div className="font-medium">{dept.name}</div>
                                            <div className="text-sm text-muted-foreground">{dept.code}</div>
                                        </div>
                                    ))}
                                    {hasNextPage && (
                                        <div ref={loadMoreRef} className="py-4 text-center text-muted-foreground">
                                            {isFetchingNextPage ? 'Đang tải thêm...' : 'Cuộn để tải thêm'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Chi tiết cấu trúc phòng ban */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chi tiết cấu trúc</CardTitle>
                        <CardDescription>
                            Cấu trúc cha-con của phòng ban
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            {isLoadingStructure ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-24 w-full" />
                                    ))}
                                </div>
                            ) : departmentStructure ? (
                                <div className="space-y-6">
                                    {/* Phòng ban cha */}
                                    <div>
                                        <h3 className="font-medium mb-2">Phòng ban cấp trên</h3>
                                        <div className="space-y-2 pl-4 border-l-2">
                                            {departmentStructure.parents.map((parent, index) => (
                                                <div key={`parent-${parent._id}-${parent.code}`} className="relative">
                                                    <div className="absolute -left-[17px] top-1/2 w-3 h-px bg-border" />
                                                    <div className="p-2 rounded-lg border">
                                                        <div className="font-medium">{parent.name}</div>
                                                        <div className="text-sm text-muted-foreground">{parent.code}</div>
                                                    </div>
                                                    {index < departmentStructure.parents.length - 1 && (
                                                        <ChevronRight className="mx-auto my-1 h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phòng ban hiện tại */}
                                    <div>
                                        <h3 className="font-medium mb-2">Phòng ban hiện tại</h3>
                                        <div className="p-4 rounded-lg border bg-primary/5">
                                            <div className="font-medium">{departmentStructure.target.name}</div>
                                            <div className="text-sm text-muted-foreground">{departmentStructure.target.code}</div>
                                        </div>
                                    </div>

                                    {/* Phòng ban con */}
                                    {departmentStructure.children.length > 0 && (
                                        <div>
                                            <h3 className="font-medium mb-2">Phòng ban trực thuộc</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {departmentStructure.children.map((child) => (
                                                    <div
                                                        key={`child-${child._id}-${child.code}`}
                                                        className="p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                                        onClick={() => setSearchTerm(child.name)}
                                                    >
                                                        <div className="font-medium">{child.name}</div>
                                                        <div className="text-sm text-muted-foreground">{child.code}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    Chọn một phòng ban để xem chi tiết
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
