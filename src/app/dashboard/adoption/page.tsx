'use client'

import React, { useState } from 'react'
import { Search, Calendar as CalendarIcon, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, isWithinInterval } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AdoptionData {
  _id: string
  recCode: string
  requestRecruitment: string
  createdBy: {
    userId: string
    name: string
    RequesterName: string
    RequesterCode: string
    RequesterPosition: string
  }
  memberHrCreate: {
    name: string,
    CreateByName: string
    CreateByCode: string
    CreateByPosition: string
  }
  type: string
  status: string
  remark: string
  createdAt: string
  updatedAt: string
}

interface AdoptionResponse {
  status: number
  message: string
  data: {
    docs: AdoptionData[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}

export default function AdoptionPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [recCode, setRecCode] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch data with React Query
  const {
    data: adoptionData,
    isLoading,
    isFetching,
    refetch
  } = useQuery<AdoptionResponse>({
    queryKey: ['adoptions', page, limit, status, type, recCode, dateRange],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())

      if (status && status !== 'all') queryParams.append('status', status)
      if (type && type !== 'all') queryParams.append('type', type)
      if (recCode) queryParams.append('recCode', recCode)

      if (dateRange?.from) {
        queryParams.append('startDate', dateRange.from.toISOString())
      }

      if (dateRange?.to) {
        queryParams.append('endDate', dateRange.to.toISOString())
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adoption/getAll-adoption-admin?${queryParams.toString()}`
      )

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu')
      }

      return response.json()
    },
    refetchOnWindowFocus: false
  })

  const handleSearch = () => {
    refetch()
  }

  const handleReset = () => {
    setDateRange(undefined)
    setRecCode('')
    setStatus('all')
    setType('all')
    setPage(1)
  }

  // Hàm render skeleton loading
  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className='h-4 w-8' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-40' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-6 w-20 rounded-full' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24' />
          </TableCell>
        </TableRow>
      ))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Adoption</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Mã tuyển dụng */}
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Mã tuyển dụng...'
                className='pl-8'
                value={recCode}
                onChange={(e) => setRecCode(e.target.value)}
              />
            </div>

            {/* Date range picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full justify-start text-left font-normal'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} -{' '}
                        {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy', { locale: vi })
                    )
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Loại */}
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder='Loại tuyển dụng' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='direct'>Direct</SelectItem>
                <SelectItem value='indirect'>Indirect</SelectItem>
              </SelectContent>
            </Select>

            {/* Trạng thái */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder='Trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='pending'>Chờ duyệt</SelectItem>
                <SelectItem value='processing'>Đang xử lý</SelectItem>
                <SelectItem value='approved'>Đã duyệt</SelectItem>
                <SelectItem value='rejected'>Từ chối</SelectItem>
              </SelectContent>
            </Select>

            <div className='md:col-span-4 flex space-x-2 justify-end'>
              <Button variant='outline' onClick={handleReset}>
                Đặt lại
              </Button>
              <Button onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Danh sách Adoption</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mã tuyển dụng</TableHead>
                <TableHead>Người tạo HR</TableHead>
                <TableHead>Người tạo PB</TableHead>

                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>tác vụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                renderSkeletonRows()
              ) : adoptionData?.data?.docs?.length ? (
                adoptionData.data.docs.map((adoption) => (
                  <TableRow key={adoption._id}>
                    <TableCell>{adoption._id.slice(-6)}</TableCell>
                    <TableCell className="font-bold">{adoption.recCode}</TableCell>
                    <TableCell>
                      {adoption?.memberHrCreate?.CreateByName}{' '}
                      <span className='text-xs text-black font-bold'>
                        {adoption?.memberHrCreate?.CreateByCode}
                      </span>
                      <br />
                      {adoption?.memberHrCreate?.CreateByPosition}
                    </TableCell>
                    <TableCell>
                      {adoption?.createdBy?.RequesterName}{' '}
                      <span className='text-xs text-black font-bold'>
                        {adoption?.createdBy?.RequesterCode}
                      </span>
                      <br />
                      {adoption?.createdBy?.RequesterPosition}
                    </TableCell>
                    <TableCell>
                      {adoption.type === 'direct' ? 'Direct' : 'Indirect'}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'inline-block px-2 py-1 rounded-full text-xs font-medium',
                          adoption.status === 'pending'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : adoption.status === 'processing'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : adoption.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        )}
                      >
                        {adoption.status === 'pending'
                          ? 'Chờ duyệt'
                          : adoption.status === 'processing'
                            ? 'Đang xử lý'
                            : adoption.status === 'approved'
                              ? 'Đã duyệt'
                              : 'Từ chối'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(adoption.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button variant='outline' size='sm'>
                        <Eye className='w-4 h-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-6'>
                    Không tìm thấy dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='flex items-center justify-between mt-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Hiển thị {adoptionData?.data?.docs?.length || 0} trong tổng số {adoptionData?.data?.totalDocs || 0} yêu cầu
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page - 1)}
            disabled={!adoptionData?.data?.hasPrevPage || isLoading || isFetching}
          >
            Trước
          </Button>
          <span className='text-sm text-muted-foreground'>
            Trang {adoptionData?.data?.page || 1} / {adoptionData?.data?.totalPages || 1}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page + 1)}
            disabled={!adoptionData?.data?.hasNextPage || isLoading || isFetching}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}
