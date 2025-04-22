// src/components/users/user-table.tsx
"use client"

import { useState } from 'react'
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Search, MoreHorizontal, Edit, Trash } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserDialog from '@/components/users/user-dialog'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/lib/api/users'

// Define the user data type
type User = {
    id: string
    name: string
    Code: string
    Email: string
    EmployeeCode : string
    Username : string
    role: string
    status: 'active' | 'inactive' | 'pending'
    lastActive: string
    initials: string
}

// Thêm interface cho response API
interface UsersResponse {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    data: User[];
    status: number;
    message: string;
}

export default function UserTable() {
    const [page, setPage] = useState(1)
    const { data: usersData, isLoading, isFetching } = useQuery({
        queryKey: ['users', page],
        queryFn: () => getUsers(page),
        placeholderData: (previousData) => previousData
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    console.log(usersData, 'usersData')
    // Define columns
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'Code',
            header: 'Code',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="font-medium">{user.Code}</div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'Username',
            header: 'Họ tên',
            cell: ({ row }) => <div>{row.getValue('Username')}</div>,
        },
        {
            accessorKey: 'Email',
            header: 'Email',
            cell: ({ row }) => {
                const status = row.getValue('Email') as string
                return (
                    <div >
                        <div >
                            {status}
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <UserDialog user={user}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                </UserDialog>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: usersData?.data || [],
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
            <div className="flex items-center">
                <div className="flex items-center border rounded-md bg-background/50 px-3 flex-1 max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={(table.getColumn('Code')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('Code')?.setFilterValue(event.target.value)
                        }
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    />
                </div>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    Hiển thị {usersData?.data?.length || 0} trong tổng số {usersData?.totalItems || 0} người dùng
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1 || isLoading || isFetching}
                    >
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {usersData?.currentPage || page} / {usersData?.totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= (usersData?.totalPages || 1) || isLoading || isFetching}
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    )
}