'use client'

import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Role {
  RoleId: string
  RoleName: string
  CreatedDate: string
}

interface RolesResponse {
  roles: Role[]
  currentPage: number
  totalPages: number
  totalItems: number
}

const TableRow = memo(({ role, onEdit }: { role: Role; onEdit: (roleId: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
      <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium'>{role.RoleName}</td>
      <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>{role.CreatedDate}</td>
      <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
        <div className='flex justify-end gap-2'>
          <div className='relative inline-block text-left'>
            <button 
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10'
            >
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </button>
            {isOpen && (
              <div 
                ref={menuRef}
                className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50'
              >
                <div className='px-1 py-1'>
                  <button 
                    onClick={() => {
                      onEdit(role.RoleId)
                      setIsOpen(false)
                    }}
                    className='flex w-full items-center rounded-sm px-2 py-2 text-sm hover:bg-accent text-red-600 hover:text-accent-foreground'
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </button>
                  <button className='flex w-full items-center rounded-sm px-2 py-2 text-sm text-red-600 hover:bg-red-50'>
                    <Trash className='mr-2 h-4 w-4' />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
})

const TableBody = memo(({ roles, onEdit }: { roles: Role[]; onEdit: (roleId: string) => void }) => (
  <tbody className='[&_tr:last-child]:border-0'>
    {roles.length > 0 ? (
      roles.map((role) => (
        <TableRow key={role.RoleId} role={role} onEdit={onEdit} />
      ))
    ) : (
      <tr>
        <td colSpan={3} className='h-24 text-center text-sm text-muted-foreground'>
          Không có kết quả
        </td>
      </tr>
    )}
  </tbody>
))

const Pagination = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading: boolean
  }) => (
    <div className='flex items-center space-x-2'>
      <button
        className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
      >
        Trước
      </button>
      <span className='text-sm text-muted-foreground'>
        Trang {currentPage} / {totalPages}
      </span>
      <button
        className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
      >
        Sau
      </button>
    </div>
  )
)

export default function RoleTable() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<RolesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEdit = useCallback((roleId: string) => {
    router.push(`/dashboard/roles/edit/${roleId}`)
  }, [router])

  const fetchRoles = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/role/get-role?page=${pageNum}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles(page)
  }, [page, fetchRoles])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  return (
    <div className='space-y-4'>
      <div className='rounded-md border border-border overflow-hidden relative'>
        {isLoading && (
          <div className='absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm'>
            <div className='animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent'></div>
          </div>
        )}
        <table className='w-full caption-bottom text-sm'>
          <thead className='[&_tr]:border-b'>
            <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
              <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>
                Mã vai trò
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>
                Ngày tạo
              </th>
              <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'></th>
            </tr>
          </thead>
          <TableBody roles={data?.roles || []} onEdit={handleEdit} />
        </table>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Hiển thị {data?.roles?.length || 0} trong tổng số {data?.totalItems || 0} vai trò
        </div>
        <Pagination
          currentPage={data?.currentPage || 1}
          totalPages={data?.totalPages || 1}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
