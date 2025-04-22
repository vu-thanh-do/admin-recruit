'use client'

import React, { useState, useRef, memo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Eye, Pencil, MoreHorizontal, PlusCircle, Check } from 'lucide-react'
import { format, isWithinInterval } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DateRange } from 'react-day-picker'
import { useAllRequest } from '@/lib/react-query/queries/all-request'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface RequestData {
  _id: string
  requestId: {
    _id: string
    formType: string
    status: string
    nameForm: {
      title: string
    }
    createdAt: string
    updatedAt: string
    createdBy: {
      userId: string
      name: string
      RequesterName: string
      RequesterCode: string
      RequesterPosition: string
      RequesterSection: string
    }
    recCode?: string
    processing?: {
      title: string
      code: string
    }
  }
  processing?: {
    title: string
    code: string
  }
  total: number
  levelApproval: Array<{
    Id: number
    level: number
    status: string
    reasonReject: string
    approveTime: string
    codeUserApproval: string
    EmployeeId: string
    EmployeeName: string
    IsSelected: string
    _id: string
  }>
  additionalInfo: {
    createdAt: string
    updatedAt: string
  }
  hrAnswer?: {
    dateOfAdoption: string
    numberOfAdopt: string
    comment: string
  }
}

interface RequestResponse {
  status: number
  message: string
  data: RequestData[]
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

const DEFAULT_PROCESSES = [
  { code: 'POSTJD', title: 'Post Job', color: 'bg-blue-500' },
  { code: 'COLLECTCV', title: 'Collect CV', color: 'bg-purple-500' },
  { code: 'INTERVIEW', title: 'Interview', color: 'bg-indigo-500' },
  { code: 'HEALTHCHECK', title: 'Health checking', color: 'bg-pink-500' },
  { code: 'ADOPTION', title: 'Adoption', color: 'bg-yellow-500' },
  { code: 'FINISH', title: 'Finish', color: 'bg-green-500' },

]

interface Process {
  code: string
  title: string
  color: string
}

// Component con riêng biệt cho phần nhập RecCode
const RecCodeInput = memo(({ 
  recCode, 
  requestId, 
  disabled, 
  onConfirm 
}: { 
  recCode: string, 
  requestId: string, 
  disabled: boolean, 
  onConfirm: (requestId: string, value: string) => void 
}) => {
  const [inputValue, setInputValue] = useState(recCode || '')
  const [isEditing, setIsEditing] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      onConfirm(requestId, inputValue)
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    if (isEditing && inputValue && inputValue !== recCode) {
      onConfirm(requestId, inputValue)
    }
    setIsEditing(false)
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  return (
    <div className='flex items-center gap-2'>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        placeholder='Nhập mã...'
        className='w-28 font-bold text-black'
      />
      {!disabled && inputValue && inputValue !== recCode && (
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => onConfirm(requestId, inputValue)}
        >
          <Check className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
})

RecCodeInput.displayName = 'RecCodeInput'

export default function AllRequest() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [requestType, setRequestType] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [page, setPage] = useState(1)
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES)
  const [newProcess, setNewProcess] = useState('')
  const [selectedProcess, setSelectedProcess] = useState<string>('')
  const [isAddingProcess, setIsAddingProcess] = useState(false)
  const [recCodes, setRecCodes] = useState<Record<string, string>>({})
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState('')

  const {
    data: allRequestData,
    isLoading,
    isFetching,
    refetch
  } = useAllRequest({
    page,
    limit: 10,
    search: searchQuery,
    status: requestStatus !== 'all' ? requestStatus : undefined,
    type: requestType !== 'all' ? requestType : undefined,
    processingCode: selectedProcess !== 'all' ? selectedProcess : undefined
  })

  // Lọc dữ liệu dựa trên khoảng thời gian
  const filteredData =
    allRequestData?.data?.filter((item: RequestData) => {
      // Kiểm tra xem ngày yêu cầu có nằm trong khoảng ngày đã chọn không
      let matchesDate = true
      if (dateRange && dateRange.from && dateRange.to) {
        const requestDateObj = new Date(item.requestId.createdAt)
        matchesDate = isWithinInterval(requestDateObj, {
          start: dateRange.from,
          end: dateRange.to
        })
      } else if (dateRange && dateRange.from) {
        // Nếu chỉ có ngày bắt đầu được chọn
        matchesDate = new Date(item.requestId.createdAt) >= dateRange.from
      }

      return matchesDate
    }) || []

  const handleView = (id: string) => {
    console.log('Xem chi tiết yêu cầu:', id)
    // Triển khai xem chi tiết
  }

  const handleEdit = (id: string) => {
    console.log('Chỉnh sửa yêu cầu:', id)
    // Triển khai chỉnh sửa
  }

  const handleAddProcess = () => {
    if (newProcess.trim()) {
      const processCode = newProcess.toUpperCase().replace(/\s+/g, '')
      const newProcessItem: Process = {
        code: processCode,
        title: newProcess,
        color: `bg-${['red', 'blue', 'green', 'purple', 'indigo'][Math.floor(Math.random() * 5)]}-500`
      }
      setProcesses([...processes, newProcessItem])
      setNewProcess('')
      setIsAddingProcess(false)
    }
  }

  const handleProcessChange = async (requestId: string, processCode: string) => {
    try {
      const selectedProcess = processes.find(p => p.code === processCode)
      if (!selectedProcess) return

      const payLoad = {
        processing: {
          title: selectedProcess.title,
          code: selectedProcess.code
        }
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requestRecruitment/update-processing/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payLoad)
        }
      )

      if (!response.ok) throw new Error('Cập nhật thất bại')

      // Refresh data
      refetch()
    } catch (error) {
      console.error('Error updating process:', error)
    }
  }

  const confirmUpdateRecCode = (requestId: string, value: string) => {
    setRecCodes({
      ...recCodes,
      [requestId]: value
    })
    setCurrentRequestId(requestId)
    setIsConfirmDialogOpen(true)
  }

  const handleUpdateRecCode = async () => {
    try {
      const recCode = recCodes[currentRequestId]
      if (!recCode || !currentRequestId) return

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requestRecruitment/update-rec-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recCode,
            requestId: currentRequestId
          })
        }
      )

      const result = await response.json()
      if (response.ok) {
        toast.success(result.message || 'Cập nhật mã tuyển dụng thành công')
        // Refresh data
        refetch()
      } else {
        toast.error(result.message || 'Không thể cập nhật mã tuyển dụng')
      }
    } catch (error) {
      console.error('Error updating recCode:', error)
      toast.error('Đã xảy ra lỗi khi cập nhật mã tuyển dụng')
    } finally {
      setIsConfirmDialogOpen(false)
    }
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
            <Skeleton className='h-4 w-40' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-32' />
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
          <TableCell>
            <Skeleton className='h-6 w-20 rounded-full' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-24' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-6 w-20 rounded-full' />
          </TableCell>
          <TableCell className='text-right'>
            <Skeleton className='h-8 w-8 rounded-full ml-auto' />
          </TableCell>
        </TableRow>
      ))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Tìm kiếm */}
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Tìm kiếm...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Loại yêu cầu */}
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder='Loại yêu cầu' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='YCTD'>Yêu cầu tuyển dụng</SelectItem>
                {/* Thêm các loại yêu cầu khác nếu có */}
              </SelectContent>
            </Select>
            {/* Tiến trình */}
            <Select value={selectedProcess} onValueChange={setSelectedProcess}>
              <SelectTrigger>
                <SelectValue placeholder='Tiến trình' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                {processes.map((process) => (
                  <SelectItem key={process.code} value={process.code}>
                    <span>{process.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Trạng thái */}
            <Select value={requestStatus} onValueChange={setRequestStatus}>
              <SelectTrigger>
                <SelectValue placeholder='Trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                <SelectItem value='pending'>Chờ duyệt</SelectItem>
                <SelectItem value='processing'>Đang xử lý</SelectItem>
                <SelectItem value='approved'>Đã duyệt</SelectItem>
                <SelectItem value='completed'>Hoàn thành</SelectItem>
                <SelectItem value='rejected'>Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Danh sách yêu cầu tuyển dụng</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mã tuyển dụng</TableHead>
                <TableHead>Tiến trình</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                renderSkeletonRows()
              ) : filteredData.length > 0 ? (
                filteredData.map((request: RequestData) => {
                  return (
                    <TableRow key={request._id}>
                      <TableCell>{request.requestId._id.slice(-6)}</TableCell>
                      <TableCell>
                        {request.requestId.createdBy.RequesterName}{' '}
                        <span className='text-xs text-black font-bold'>
                          {request.requestId.createdBy.RequesterCode}
                        </span>
                      </TableCell>
                      <TableCell>{request.requestId.createdBy.RequesterSection}</TableCell>
                      <TableCell>{format(new Date(request.requestId.createdAt), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{request.total}</TableCell>
                      <TableCell>{request.requestId.formType}</TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            'inline-block px-2 py-1 rounded-full text-xs font-medium',
                            request.requestId.status === 'pending'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : request.requestId.status === 'processing'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                : request.requestId.status === 'approved'
                                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                                  : request.requestId.status === 'completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          )}
                        >
                          {request.requestId.status === 'pending'
                            ? 'Chờ duyệt'
                            : request.requestId.status === 'processing'
                              ? 'Đang xử lý'
                              : request.requestId.status === 'approved'
                                ? 'Đã duyệt'
                                : request.requestId.status === 'completed'
                                  ? 'Hoàn thành'
                                  : request.requestId.status === 'rejected'
                                    ? 'Từ chối'
                                    : request.requestId.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RecCodeInput 
                          recCode={request.requestId.recCode || ''} 
                          requestId={request.requestId._id}
                          disabled={!!request.requestId.recCode}
                          onConfirm={confirmUpdateRecCode}
                        />
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Select
                            defaultValue={request.requestId.processing?.code}
                            value={request.requestId.processing?.code}
                            onValueChange={(value) => handleProcessChange(request.requestId._id, value)}
                          >
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue>
                                {request.requestId.processing ? (
                                  <div className='flex items-center gap-2'>
                                    <div className={`w-2 h-2 rounded-full ${processes.find(p => p.code === request.requestId.processing?.code)?.color}`}></div>
                                    <span>{request.requestId.processing.title}</span>
                                  </div>
                                ) : (
                                  'Chọn tiến trình'
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {processes.map((process) => (
                                <SelectItem key={process.code} value={process.code}>
                                  <div className='flex items-center gap-2'>
                                    <div className={`w-2 h-2 rounded-full ${process.color}`}></div>
                                    <span>{process.title}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleView(request._id)}>
                              <Eye className='mr-2 h-4 w-4' />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(request._id)}>
                              <Pencil className='mr-2 h-4 w-4' />
                              Chỉnh sửa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className='text-center py-6'>
                    Không tìm thấy yêu cầu tuyển dụng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className='flex items-center justify-between mt-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Hiển thị {filteredData.length || 0} trong tổng số {allRequestData?.pagination?.totalDocs || 0} yêu cầu
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page - 1)}
            disabled={!allRequestData?.pagination?.hasPrevPage || isLoading || isFetching}
          >
            Trước
          </Button>
          <span className='text-sm text-muted-foreground'>
            Trang {allRequestData?.pagination?.page || 1} / {allRequestData?.pagination?.totalPages || 1}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page + 1)}
            disabled={!allRequestData?.pagination?.hasNextPage || isLoading || isFetching}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Dialog xác nhận cập nhật mã tuyển dụng */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận cập nhật mã tuyển dụng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn cập nhật mã tuyển dụng thành "{recCodes[currentRequestId]}" không?</p>
            <p className="text-sm text-muted-foreground mt-2">Lưu ý: Hành động này không thể hoàn tác sau khi đã xác nhận.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdateRecCode}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
