'use client'
import { Button } from '../ui/button'
import { TableBody } from '../ui/table'
import { TableCell, TableHeader, TableRow } from '../ui/table'
import { Table } from '../ui/table'
import { TableHead } from '../ui/table'
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { useQuery } from '@tanstack/react-query'
import { getAllGroupConfigSystem } from '@/lib/api/configSystem'
import { GroupConfigSystemResponse } from '@/types/configSystem'
import { formatDate } from '@/lib/utils'
import { Pencil } from 'lucide-react'

export default function ListConfig() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const {
    data: configSystem,
    isLoading,
    refetch
  } = useQuery<GroupConfigSystemResponse>({
    queryKey: ['configSystem', page, limit],
    queryFn: () => getAllGroupConfigSystem(limit, page),
    placeholderData: {
      status: 200,
      message: 'success',
      data: { data: [], paginator: { total: 0, perPage: 0, currentPage: 0, pageCount: 0, slNo: 0 } }
    }
  })
  return (
    <div>
      <div className='space-y-4'>
        <Card className='p-6'>
          <CardHeader>
            <CardTitle>Quản lý cấp phê duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  configSystem?.data?.data?.map((configSystem: any, index: number) => (
                    <TableRow key={index + configSystem?.nameGroup}>
                      <TableCell>{configSystem?.nameGroup}</TableCell>
                      <TableCell>{configSystem?.count}</TableCell>
                      <TableCell>
                        <Button variant='outline' size='icon'>
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {configSystem?.data?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              Hiển thị {configSystem?.data?.data?.length}
            </div>

            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='sm' onClick={() => setPage(page - 1)} disabled={page <= 1 || isLoading}>
                Trước
              </Button>
              <div className='text-sm text-muted-foreground'>
                Trang {page} / {configSystem?.data?.paginator?.pageCount || 1}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage(page + 1)}
                disabled={page >= (configSystem?.data?.paginator?.pageCount || 1) || isLoading}
              >
                Sau
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
