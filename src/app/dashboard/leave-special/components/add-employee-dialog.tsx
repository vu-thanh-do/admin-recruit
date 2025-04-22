'use client'

import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Search, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { EmployeeSpecific } from "@/types/resignSpecific"
import { useDebounce } from "@/hooks/use-debounce"
import { useDepartmentsV2 } from '@/lib/react-query/queries/companyStructure'
import { Department } from '@/types/company-structure'

interface AddEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDepartment: string
  onAddEmployee: (employee: Partial<EmployeeSpecific>) => void
  initialData?: Partial<EmployeeSpecific>
  isEditing?: boolean
}
const fixPointerEvents = () => {
  if (document.body.style.pointerEvents === "none") {
    document.body.style.pointerEvents = "auto";
  }
};
export const AddEmployeeDialog = ({
  open,
  onOpenChange,
  selectedDepartment,
  onAddEmployee,
  initialData,
  isEditing = false
}: AddEmployeeDialogProps) => {
  const [employee, setEmployee] = useState<Partial<EmployeeSpecific>>(
    initialData || {
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
    }
  )
  const [divisionSearchTerm, setDivisionSearchTerm] = useState('')
  const [isDivisionPopoverOpen, setIsDivisionPopoverOpen] = useState(false)
  const debouncedDivisionSearch = useDebounce(divisionSearchTerm, 300)
  
  const [sectionSearchTerm, setSectionSearchTerm] = useState('')
  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)
  const debouncedSectionSearch = useDebounce(sectionSearchTerm, 300)

  const {
    data: divisionsData,
    isLoading: isLoadingDivisions
  } = useDepartmentsV2(debouncedDivisionSearch, 1, 15)

  const {
    data: sectionsData,
    isLoading: isLoadingSections
  } = useDepartmentsV2(debouncedSectionSearch, 1, 15)

  const divisions = React.useMemo(() => {
    return divisionsData?.docs || []
  }, [divisionsData])

  const sections = React.useMemo(() => {
    return sectionsData?.docs || []
  }, [sectionsData])

  const handleDivisionSelect = (division: Department) => {
    setEmployee({ 
      ...employee, 
      division: division.name, 
      divisionCode: division.code 
    })
    setIsDivisionPopoverOpen(false)
    setDivisionSearchTerm('')
    
    if (employee.section) {
      setEmployee(prev => ({ ...prev, section: '', sectionCode: '' }))
    }
    
    fixPointerEvents()
  }

  const handleSectionSelect = (section: Department) => {
    setEmployee({ 
      ...employee, 
      section: section.name,
      sectionCode: section.code 
    })
    setIsSectionPopoverOpen(false)
    setSectionSearchTerm('')
    
    fixPointerEvents()
  }

  const handleDivisionSearch = (value: string) => {
    setDivisionSearchTerm(value)
    fixPointerEvents()
  }

  const handleSectionSearch = (value: string) => {
    setSectionSearchTerm(value)
    fixPointerEvents()
  }

  const handleDivisionItemClick = (dept: Department, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleDivisionSelect(dept)
  }

  const handleSectionItemClick = (dept: Department, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleSectionSelect(dept)
  }

  const handleSubmit = () => {
    onAddEmployee(employee)
    if (!isEditing) {
      setEmployee({
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
    onOpenChange(false)
  }

  useEffect(() => {
    fixPointerEvents()
    return () => {
      fixPointerEvents()
    }
  }, [])

  useEffect(() => {
    if (isDivisionPopoverOpen || isSectionPopoverOpen) {
      fixPointerEvents()
    }
  }, [isDivisionPopoverOpen, isSectionPopoverOpen])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên nghỉ đặc biệt'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Cập nhật thông tin nhân viên nghỉ đặc biệt.' 
              : `Nhập thông tin nhân viên nghỉ đặc biệt cho phòng ban ${selectedDepartment}.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              value={employee._id || ''}
              onChange={(e) => setEmployee({ ...employee, _id: e.target.value })}
              placeholder="Nhập ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Mã nhân viên</Label>
            <Input
              id="code"
              value={employee.code || ''}
              onChange={(e) => setEmployee({ ...employee, code: e.target.value })}
              placeholder="Nhập mã nhân viên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên nhân viên</Label>
            <Input
              id="name"
              value={employee.name || ''}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              placeholder="Nhập tên nhân viên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Phòng ban lớn (Division)</Label>
            <Popover 
              open={isDivisionPopoverOpen} 
              onOpenChange={(open) => {
                setIsDivisionPopoverOpen(open)
                fixPointerEvents()
              }}
            >
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={isDivisionPopoverOpen}
                  className="w-full justify-between"
                  onClick={() => {
                    setIsDivisionPopoverOpen(!isDivisionPopoverOpen)
                    fixPointerEvents()
                  }}
                >
                  {employee.division || "Chọn phòng ban lớn (division)"}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[300px] p-0" 
                align="start" 
                side="bottom"
                onEscapeKeyDown={() => {
                  setIsDivisionPopoverOpen(false)
                  fixPointerEvents()
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex flex-col">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tìm kiếm phòng ban..."
                      value={divisionSearchTerm}
                      onChange={(e) => handleDivisionSearch(e.target.value)}
                      autoFocus
                      onClick={fixPointerEvents}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {isLoadingDivisions ? (
                      <div className="p-2 text-center">Đang tải...</div>
                    ) : divisions.length === 0 ? (
                      <div className="py-6 text-center text-sm">Không tìm thấy phòng ban</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {divisions.map((dept) => (
                          <div
                            key={dept._id.toString()}
                            className={cn(
                              "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                              employee.divisionCode === dept.code && "bg-accent"
                            )}
                            onClick={(e) => handleDivisionItemClick(dept, e)}
                          >
                            <Check 
                              className={cn(
                                "mr-2 h-4 w-4",
                                employee.divisionCode === dept.code ? "opacity-100" : "opacity-0"
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

          <div className="space-y-2">
            <Label htmlFor="section">Bộ phận (Section)</Label>
            <Popover 
              open={isSectionPopoverOpen} 
              onOpenChange={(open) => {
                setIsSectionPopoverOpen(open)
                fixPointerEvents()
              }}
            >
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={isSectionPopoverOpen}
                  className="w-full justify-between"
                  disabled={!employee.division} 
                  onClick={() => {
                    setIsSectionPopoverOpen(!isSectionPopoverOpen)
                    fixPointerEvents()
                  }}
                >
                  {employee.section || "Chọn bộ phận (section)"}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[300px] p-0" 
                align="start" 
                side="bottom"
                onEscapeKeyDown={() => {
                  setIsSectionPopoverOpen(false)
                  fixPointerEvents()
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex flex-col">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tìm kiếm bộ phận..."
                      value={sectionSearchTerm}
                      onChange={(e) => handleSectionSearch(e.target.value)}
                      autoFocus
                      onClick={fixPointerEvents}
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {isLoadingSections ? (
                      <div className="p-2 text-center">Đang tải...</div>
                    ) : sections.length === 0 ? (
                      <div className="py-6 text-center text-sm">Không tìm thấy bộ phận</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {sections.map((dept) => (
                          <div
                            key={dept._id.toString()}
                            className={cn(
                              "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
                              employee.sectionCode === dept.code && "bg-accent"
                            )}
                            onClick={(e) => handleSectionItemClick(dept, e)}
                          >
                            <Check 
                              className={cn(
                                "mr-2 h-4 w-4",
                                employee.sectionCode === dept.code ? "opacity-100" : "opacity-0"
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

          <div className="space-y-2">
            <Label htmlFor="position">Vị trí (Position)</Label>
            <Input
              id="position"
              value={employee.position || ''}
              onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
              placeholder="Nhập vị trí"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Cấp bậc (Grade)</Label>
            <Input
              id="grade"
              value={employee.grade || ''}
              onChange={(e) => setEmployee({ ...employee, grade: e.target.value })}
              placeholder="Nhập cấp bậc"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryDate">Ngày vào công ty (Entry Date)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {employee.entryDate ? (
                    format(new Date(employee.entryDate), 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={employee.entryDate ? new Date(employee.entryDate) : undefined}
                  onSelect={(date) => setEmployee({
                    ...employee,
                    entryDate: date ? date.toISOString() : ''
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveDate">Ngày nghỉ việc (Leave Date)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {employee.actualLeaveDate ? (
                    format(new Date(employee.actualLeaveDate), 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={employee.actualLeaveDate ? new Date(employee.actualLeaveDate) : undefined}
                  onSelect={(date) => setEmployee({
                    ...employee,
                    actualLeaveDate: date ? date.toISOString() : ''
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="note">Ghi chú (Note)</Label>
            <Input
              id="note"
              value={employee.note || ''}
              onChange={(e) => setEmployee({ ...employee, note: e.target.value })}
              placeholder="Nhập ghi chú"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Cập nhật' : 'Thêm nhân viên'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEmployeeDialog 