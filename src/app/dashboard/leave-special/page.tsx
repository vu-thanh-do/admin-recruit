'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Plus, FileSpreadsheet, Trash2, Edit, Save, X, Download, Upload, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import RenderSkeletonRows from '@/components/common/skeleton/renderSkeletonRows'
import { EmployeeEzV4 } from '@/types/resignSpecific'
import { EmployeeSpecific } from '@/types/resignSpecific'
import TabEzV4 from '@/components/leave-special/TabEzV4'
import { useDepartmentsV2 } from '@/lib/react-query/queries/companyStructure'
import { useDebounce } from '@/hooks/use-debounce'
import { Department } from '@/types/company-structure'
import AddEmployeeDialog from './components/add-employee-dialog'

// Component PreventCloseCommandItem để ngăn đóng dropdown khi chọn
const PreventCloseCommandItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem> & { preventClose?: boolean }
>(({ className, onSelect, preventClose, ...props }, ref) => {
  return (
    <CommandItem
      ref={ref}
      className={cn("cursor-pointer hover:bg-accent active:pointer-events-auto", className)}
      style={{ pointerEvents: 'auto' }}
      onSelect={(value) => {
        if (preventClose && onSelect) {
          // Sửa pointer-events trên body để đảm bảo UI hoạt động bình thường
          if (document.body.style.pointerEvents === "none") {
            document.body.style.pointerEvents = "auto";
          }
          
          // Ngăn chặn sự kiện đóng dropdown
          setTimeout(() => {
            if (onSelect) onSelect(value);
          }, 0);
        } else if (onSelect) {
          onSelect(value);
        }
      }}
      {...props}
    />
  );
});
PreventCloseCommandItem.displayName = "PreventCloseCommandItem";

// Hàm tiện ích để khắc phục vấn đề pointer-events
const fixPointerEvents = () => {
  if (document.body.style.pointerEvents === "none") {
    document.body.style.pointerEvents = "auto";
  }
};

// Component chính
export default function LeaveSpecialPage() {
  const [activeTab, setActiveTab] = useState('specific')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [ezV4Department, setEzV4Department] = useState('42')
  const [ezV4FilterState, setEzV4FilterState] = useState('mfg1')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [specificData, setSpecificData] = useState<EmployeeSpecific[]>([])
  const [ezV4Data, setEzV4Data] = useState<EmployeeEzV4[]>([])
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('')
  const debouncedDepartmentSearch = useDebounce(departmentSearchTerm, 300)
  const [isDepartmentPopoverOpen, setIsDepartmentPopoverOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Partial<EmployeeSpecific>>({
    _id: '',
    code: '',
    name: '',
    division: '',
    section: '',
    position: '',
    grade: '',
    entryDate: '',
    actualLeaveDate: '',
    note: ''
  })
  const [openPopover, setOpenPopover] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Sử dụng API phòng ban v2 mới
  const {
    data: departmentsData,
    isLoading: isLoadingDepartments,
    refetch: refetchDepartments
  } = useDepartmentsV2(debouncedDepartmentSearch, 1, 15)

  // Phòng ban từ API
  const departments = React.useMemo(() => {
    return departmentsData?.docs || []
  }, [departmentsData])
  
  // Xử lý thay đổi từ khóa tìm kiếm phòng ban
  const handleDepartmentSearch = (value: string) => {
    setDepartmentSearchTerm(value);
    fixPointerEvents();
  };
  
  // Xử lý chọn phòng ban
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setIsDepartmentPopoverOpen(false);
    setDepartmentSearchTerm("");
    fixPointerEvents();
  };

  // Xử lý click trên một mục phòng ban
  const handleDepartmentItemClick = (dept: Department, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleDepartmentChange(dept.code);
    fixPointerEvents();
  };

  // Fetch dữ liệu đặc biệt
  const fetchSpecificData = async () => {
    if (!selectedDepartment) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resign/get-resign-specific`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deptName: selectedDepartment })
      })
      const data = await response.json()
      if (response.ok) {
        setSpecificData(data.data?.data?.info || [])
      } else {
        toast.error(data.message || 'Không thể tải dữ liệu')
        setSpecificData([])
      }
    } catch (error) {
      console.error('Error fetching specific data:', error)
      toast.error('Đã xảy ra lỗi khi tải dữ liệu')
      setSpecificData([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch dữ liệu từ EzV4
  const fetchEzV4Data = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requestRecruitment/mfgReplace/getListEmpResignMfg?page=${page}&limit=${limit}&search=${searchTerm}&typeFilter=${ezV4FilterState}`
      )
      const data = await response.json()
      if (response.ok) {
        setEzV4Data(data.data || [])
        setPagination({
          total: data.pagination.total,
          pages: data.pagination.totalPages
        })
      } else {
        toast.error(data.message || 'Không thể tải dữ liệu')
        setEzV4Data([])
      }
    } catch (error) {
      console.error('Error fetching EzV4 data:', error)
      toast.error('Đã xảy ra lỗi khi tải dữ liệu')
      setEzV4Data([])
    } finally {
      setIsLoading(false)
    }
  }

  // Effect khi thay đổi tab hoặc phòng ban
  useEffect(() => {
    if (activeTab === 'specific') {
      if (selectedDepartment) {
        fetchSpecificData()
      }
    } else {
      fetchEzV4Data()
    }
  }, [activeTab, selectedDepartment, ezV4Department, page, limit, ezV4FilterState])

  // Set giá trị mặc định cho phòng ban khi dữ liệu phòng ban được load
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0].code)
    }
  }, [departments, selectedDepartment])

  // Xử lý thêm nhân viên mới từ dialog
  const handleAddEmployee = async (employee: Partial<EmployeeSpecific>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resign/create-resign-specific`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deptName: selectedDepartment,
          info: employee
        })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Thêm nhân viên thành công')
        fetchSpecificData()
      } else {
        toast.error(data.message || 'Không thể thêm nhân viên')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
      toast.error('Đã xảy ra lỗi khi thêm nhân viên')
    }
  }

  // Xóa nhân viên
  const deleteEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resign/resign-specific/${selectedDepartment}/${employeeId}`,
        {
          method: 'DELETE'
        }
      )
      const data = await response.json()
      if (response.ok) {
        toast.success('Xóa nhân viên thành công')
        fetchSpecificData()
      } else {
        toast.error(data.message || 'Không thể xóa nhân viên')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast.error('Đã xảy ra lỗi khi xóa nhân viên')
    }
  }
  // Xóa nhiều nhân viên
  const deleteMultipleEmployees = async () => {
    if (selectedEmployees.length === 0) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resign/delete-multiple-employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deptName: selectedDepartment,
          employeeIds: selectedEmployees
        })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(`Đã xóa ${selectedEmployees.length} nhân viên`)
        setSelectedEmployees([])
        fetchSpecificData()
      } else {
        toast.error(data.message || 'Không thể xóa nhân viên')
      }
    } catch (error) {
      console.error('Error deleting multiple employees:', error)
      toast.error('Đã xảy ra lỗi khi xóa nhân viên')
    }
  }
  // Reset form
  const resetEmployeeForm = () => {
    setNewEmployee({
      _id: '',
      code: '',
      name: '',
      division: '',
      section: '',
      position: '',
      grade: '',
      entryDate: '',
      actualLeaveDate: '',
      note: ''
    })
  }
  // Toggle chọn nhân viên
  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id)
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    )
  }
  // Toggle chọn tất cả nhân viên
  const toggleSelectAll = () => {
    if (selectedEmployees.length === specificData.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(specificData.map(emp => emp._id))
    }
  }
  // Chuyển đổi giữa chế độ xem và chỉnh sửa
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }
  // Xử lý thay đổi filter EzV4
  const setEzV4Filter = (value: string) => {
    setEzV4FilterState(value)
  }

  // Effect để đảm bảo pointer-events được đặt về auto khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup: đảm bảo pointer-events được đặt lại khi component unmount
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "auto";
      }
    };
  }, []);

  // Effect đặc biệt để theo dõi khi dropdown mở/đóng
  useEffect(() => {
    if (isDepartmentPopoverOpen) {
      // Khi dropdown mở, đảm bảo pointer-events được thiết lập đúng
      fixPointerEvents();
    }
  }, [isDepartmentPopoverOpen]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Thông Tin Nghỉ Đặc Biệt</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="specific">Nghỉ đặc biệt</TabsTrigger>
          <TabsTrigger value="ezv4">Dữ liệu EzV4</TabsTrigger>
        </TabsList>
        {/* Tab Nghỉ đặc biệt */}
        <TabsContent value="specific" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bộ lọc tìm kiếm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="specificDept">Phòng ban</Label>
                  <div className="relative">
                    <Popover 
                      open={isDepartmentPopoverOpen} 
                      onOpenChange={(open) => {
                        setIsDepartmentPopoverOpen(open);
                        fixPointerEvents();
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          role="combobox" 
                          aria-expanded={isDepartmentPopoverOpen}
                          className="w-full justify-between"
                          onClick={() => {
                            setIsDepartmentPopoverOpen(!isDepartmentPopoverOpen);
                            fixPointerEvents();
                          }}
                        >
                          {selectedDepartment 
                            ? departments.find(dept => dept.code === selectedDepartment)?.name || selectedDepartment
                            : "Chọn phòng ban"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[300px] p-0" 
                        align="start" 
                        side="bottom"
                        onEscapeKeyDown={() => {
                          setIsDepartmentPopoverOpen(false);
                          fixPointerEvents();
                        }}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Tìm kiếm phòng ban..."
                              value={departmentSearchTerm}
                              onChange={(e) => handleDepartmentSearch(e.target.value)}
                              autoFocus
                              onClick={fixPointerEvents}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-1">
                            {isLoadingDepartments ? (
                              <div className="p-2 text-center">Đang tải...</div>
                            ) : departments.length === 0 ? (
                              <div className="py-6 text-center text-sm">Không tìm thấy phòng ban</div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                {departments.map((dept) => (
                                  <div
                                    key={dept._id.toString()}
                                    className={cn(
                                      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                                      selectedDepartment === dept.code && "bg-accent"
                                    )}
                                    onClick={(e) => handleDepartmentItemClick(dept, e)}
                                  >
                                    <Check 
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedDepartment === dept.code ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <span>{dept.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">({dept.code})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="searchSpecific">Tìm kiếm</Label>
                  <div className="flex items-center">
                    <Input
                      id="searchSpecific"
                      placeholder="Tìm kiếm theo mã nhân viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0"
                      onClick={() => {
                        if (activeTab === 'specific') {
                          fetchSpecificData()
                        } else {
                          fetchEzV4Data()
                        }
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-end justify-end space-x-2">
                  <Button onClick={toggleEditMode}>
                    {isEditMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                  </Button>

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm mới
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  {/* Sử dụng component AddEmployeeDialog mới */}
                  <AddEmployeeDialog 
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    selectedDepartment={selectedDepartment}
                    onAddEmployee={handleAddEmployee}
                    initialData={newEmployee}
                    isEditing={newEmployee._id ? true : false}
                  />

                  {isEditMode && selectedEmployees.length > 0 && (
                    <Button variant="destructive" onClick={deleteMultipleEmployees}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa ({selectedEmployees.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách nhân viên nghỉ đặc biệt</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isEditMode && (
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={specificData.length > 0 && selectedEmployees.length === specificData.length}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                      )}
                      <TableHead>Mã NV</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Bộ phận</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Cấp bậc</TableHead>
                      <TableHead>Ngày vào công ty</TableHead>
                      <TableHead>Ngày nghỉ</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      {isEditMode && <TableHead>Thao tác</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <RenderSkeletonRows />
                    ) : specificData.length > 0 ? (
                      specificData.map((employee) => (
                        <TableRow key={employee._id}>
                          {isEditMode && (
                            <TableCell>
                              <Checkbox
                                checked={selectedEmployees.includes(employee._id)}
                                onCheckedChange={() => toggleEmployeeSelection(employee._id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{employee.code}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.division}</TableCell>
                          <TableCell>{employee.section}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.grade}</TableCell>
                          <TableCell>
                            {employee?.entryDate ? format(new Date(employee?.entryDate), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>
                            {employee?.actualLeaveDate ? format(new Date(employee?.actualLeaveDate), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>{employee.note}</TableCell>
                          {isEditMode && (
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setNewEmployee(employee)
                                    setIsAddDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => deleteEmployee(employee._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={isEditMode ? 11 : 10}
                          className="text-center py-6"
                        >
                          Không có dữ liệu nhân viên nghỉ đặc biệt
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tab dữ liệu EzV4 */}
        <TabsContent value="ezv4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bộ lọc tìm kiếm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="ezv4Filter">Bộ lọc</Label>
                  <Select value={ezV4FilterState} onValueChange={setEzV4Filter}>
                    <SelectTrigger id="ezv4Filter">
                      <SelectValue placeholder="Chọn bộ lọc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mfg1">Manufacturing 1</SelectItem>
                      <SelectItem value="mfg2">Manufacturing 2</SelectItem>
                      <SelectItem value="all">Tất cả</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Label htmlFor="searchEzV4">Tìm kiếm</Label>
                  <div className="flex items-center">
                    <Input
                      id="searchEzV4"
                      placeholder="Tìm kiếm theo mã nhân viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0"
                      onClick={() => {
                        if (activeTab === 'specific') {
                          fetchSpecificData()
                        } else {
                          fetchEzV4Data()
                        }
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách nhân viên nghỉ việc từ EzV4</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã NV</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Bộ phận</TableHead>
                      <TableHead>Nhóm</TableHead>
                      <TableHead>Đội</TableHead>
                      <TableHead>Ngày vào</TableHead>
                      <TableHead>Ngày nghỉ</TableHead>
                      <TableHead>Quyết định số</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <RenderSkeletonRows />
                    ) : ezV4Data.length > 0 ? (
                      ezV4Data.map((employee) => (
                        <TableRow key={employee.EmployeeID}>
                          <TableCell>{employee.EmployeeCode}</TableCell>
                          <TableCell>{employee.FullName}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.divisionName}</TableCell>
                          <TableCell>{employee.departmentName}</TableCell>
                          <TableCell>{employee.sectionName}</TableCell>
                          <TableCell>{employee.teamName}</TableCell>
                          <TableCell>
                            {employee.JoinDate ? format(new Date(employee.JoinDate), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>
                            {employee.ResignDate ? format(new Date(employee.ResignDate), 'dd/MM/yyyy') : '-'}
                          </TableCell>
                          <TableCell>{employee.DecisionNo}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-6">
                          Không có dữ liệu nhân viên nghỉ việc
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {ezV4Data.length} trong tổng số {pagination.total} nhân viên
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1 || isLoading}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page} / {pagination.pages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= pagination.pages || isLoading}
              >
                Sau
              </Button>
            </div>
          </div></TabsContent>
      </Tabs>
    </div>
  )
}

