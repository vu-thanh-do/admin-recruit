import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Search, Table } from 'lucide-react'
import { FileSpreadsheet } from 'lucide-react'
import { TableBody, TableCell } from '../ui/table'
import { TableRow } from '../ui/table'
import { TableHeader } from '../ui/table'
import { TableHead } from '../ui/table'
import { ScrollArea } from '../ui/scroll-area'
import RenderSkeletonRows from '../common/skeleton/renderSkeletonRows'
import { format } from 'date-fns'

export default function TabEzV4({
  ezV4Data,
  isLoading,
  pagination,
  searchTerm,
  setSearchTerm,
  handleSearch,
  ezV4Filter,
  setEzV4Filter,
  setPage,
  page
}: {
  ezV4Data: any
  isLoading: boolean
  pagination: any
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleSearch: () => void
  ezV4Filter: string
  setEzV4Filter: (value: string) => void
  setPage: (value: number) => void
  page: number
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ezv4Filter">Bộ lọc</Label>
              <Select value={ezV4Filter} onValueChange={setEzV4Filter}>
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
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 flex items-end justify-end space-x-2">
              <Button variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
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
                  ezV4Data.map((employee: any) => (
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
            onClick={() => setPage(Math.max(1, page - 1))} // Truyền giá trị trực tiếp
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
            onClick={() => setPage(page + 1)} // Truyền giá trị trực tiếp
            disabled={page >= pagination.pages || isLoading}
          >
            Sau
          </Button>
        </div>
      </div>
    </>
  )
}
