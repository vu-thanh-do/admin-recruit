// src/components/users/user-table.tsx
"use client"

import { useState, useEffect } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getLogs } from '@/lib/api/logs'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

// Define the log data type
interface Log {
    _id: string
    code: string
    logType: string
    content: string
    ipAddress: string
    createdAt: string
    updatedAt: string
    id: string
}

// Interface cho response API
interface LogsResponse {
    status: number
    message: string
    data: Log[]
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

export default function LogsTable() {
    const [page, setPage] = useState(1)
    const [daysToDelete, setDaysToDelete] = useState(30) // Mặc định 30 ngày
    const [countdown, setCountdown] = useState('')
    const { data: logsData, isLoading, isFetching } = useQuery({
        queryKey: ['logs', page],
        queryFn: () => getLogs(page),
        placeholderData: (previousData) => previousData
    })

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Tính toán countdown
    useEffect(() => {
        const calculateCountdown = () => {
            if (!logsData?.data?.[0]) return ''
            
            const oldestLogDate = new Date(logsData.data[0].createdAt)
            const deleteDate = new Date(oldestLogDate.getTime() + (daysToDelete * 24 * 60 * 60 * 1000))
            const now = new Date()
            const daysLeft = Math.ceil((deleteDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            
            return `${daysLeft} ngày`
        }

        setCountdown(calculateCountdown())
        
        // Cập nhật countdown mỗi giờ
        const interval = setInterval(() => {
            setCountdown(calculateCountdown())
        }, 3600000)

        return () => clearInterval(interval)
    }, [logsData, daysToDelete])

    const handleSaveDaysToDelete = async () => {
        try {
            // Gọi API để lưu cấu hình
            const response = await fetch(`${process.env.BACKEND_URL}/api/logs/config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ daysToDelete })
            })
            
            if (response.ok) {
                toast.success('Đã lưu cấu hình thành công')
            } else {
                toast.error('Có lỗi xảy ra khi lưu cấu hình')
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server')
        }
    }

    // Define columns
    const columns: ColumnDef<Log>[] = [
        {
            accessorKey: 'code',
            header: 'Mã',
            cell: ({ row }) => {
                return (
                    <div className="font-medium">{row.getValue('code')}</div>
                )
            },
        },
        {
            accessorKey: 'logType',
            header: 'Loại',
            cell: ({ row }) => <div>{row.getValue('logType')}</div>,
        },
        {
            accessorKey: 'content',
            header: 'Nội dung',
            cell: ({ row }) => <div>{row.getValue('content')}</div>,
        },
        {
            accessorKey: 'ipAddress',
            header: 'Địa chỉ IP',
            cell: ({ row }) => <div>{row.getValue('ipAddress')}</div>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Thời gian',
            cell: ({ row }) => {
                const date = new Date(row.getValue('createdAt'))
                return <div>{date.toLocaleString('vi-VN')}</div>
            },
        },
    ]

    const table = useReactTable({
        data: logsData?.data || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className='text-2xl font-bold'>Nhật ký hoạt động</h1>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="daysToDelete">Tự động xóa logs sau</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="daysToDelete"
                                    type="number"
                                    min="1"
                                    className="w-24"
                                    value={daysToDelete}
                                    onChange={(e) => setDaysToDelete(Number(e.target.value))}
                                />
                                <span>ngày</span>
                                <Button onClick={handleSaveDaysToDelete}>Lưu</Button>
                            </div>
                        </div>
                        {countdown && (
                            <div className="grid gap-2">
                                <Label>Thời gian còn lại</Label>
                                <div className="text-lg font-semibold">{countdown}</div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            <div className="rounded-md border overflow-hidden relative">
                {(isLoading || isFetching) && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    Hiển thị {logsData?.data?.length || 0} trong tổng số {logsData?.pagination?.totalDocs || 0} bản ghi
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!logsData?.pagination?.hasPrevPage || isLoading || isFetching}
                    >
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {logsData?.pagination?.page || page} / {logsData?.pagination?.totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!logsData?.pagination?.hasNextPage || isLoading || isFetching}
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    )
}