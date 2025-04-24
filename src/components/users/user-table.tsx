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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteUser, getUsers } from '@/lib/api/users'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDebounce } from '@/hooks/use-debounce'

// Define the user data type
type User = {
    UserId: string
    EmployeeCode: string
    Code: string
    Username: string
    Email: string
    RoleId: string
    RoleName?: string
    Avatar: string
    CreatedDate: string
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
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    const [searchInput, setSearchInput] = useState('')
    // Debounce tìm kiếm để tránh gọi API quá nhiều
    const debouncedSearch = useDebounce(searchInput, 500) // Đợi 500ms sau khi người dùng ngừng gõ
    
    const { data: usersData, isLoading, isFetching } = useQuery({
        queryKey: ['users', page, debouncedSearch],
        queryFn: () => getUsers(page, debouncedSearch),
        placeholderData: (previousData) => previousData
    })

    // Mutation cho việc xóa người dùng
    const deleteUserMutation = useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => {
            toast.success('Xóa người dùng thành công')
            // Làm mới danh sách người dùng
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setIsDeleteDialogOpen(false)
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng'
            toast.error(errorMessage)
        }
    })

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Xử lý xóa người dùng
    const handleDeleteUser = () => {
        if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.UserId)
        }
    }

    // Mở dialog xác nhận xóa
    const openDeleteDialog = (user: User) => {
        setUserToDelete(user)
        setIsDeleteDialogOpen(true)
    }

    // Define columns
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'Code',
            header: 'Mã',
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.Username?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user.Code}</div>
                            <div className="text-sm text-muted-foreground">{user.EmployeeCode}</div>
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
            cell: ({ row }) => <div>{row.getValue('Email')}</div>,
        },
        {
            accessorKey: 'RoleName',
            header: 'Vai trò',
            cell: ({ row }) => {
                const user = row.original
                return <div>{user.RoleName || 'Người dùng'}</div>
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
                                    <span className="sr-only">Mở menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <UserDialog user={user}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                </UserDialog>
                                <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => openDeleteDialog(user)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Xóa
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

    useEffect(() => {
        table.getColumn('Code')?.setFilterValue(searchInput);
    }, [searchInput, table]);

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="flex items-center border rounded-md bg-background/50 px-3 flex-1 max-w-sm">
                        <Search className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            value={searchInput}
                            onChange={(event) => {
                                setSearchInput(event.target.value);
                            }}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        />
                        {searchInput && isFetching && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        )}
                    </div>
                </div>
                <div className="rounded-md border overflow-hidden relative">
                    {(isLoading || (isFetching && !searchInput) || deleteUserMutation.isPending) && (
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
                                        {isLoading ? 'Đang tải...' : 'Không có kết quả.'}
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
            
            {/* Dialog xác nhận xóa người dùng */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.Username}</strong>?
                            <br />
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteUserMutation.isPending}>Hủy</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteUser}
                            disabled={deleteUserMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteUserMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}