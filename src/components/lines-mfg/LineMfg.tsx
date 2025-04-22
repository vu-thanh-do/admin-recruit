'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LineDialog } from './line-dialog'
import { Search, Plus, MoreHorizontal, Edit, Power, Download, Upload, Loader2 } from 'lucide-react'
import { useGetAllLineMfg, useToggleLineMfg, useDownloadTemplate, useImportExcel, LineMfg } from '@/lib/react-query/queries/linesMfg'
import { toast } from 'sonner'

type StatusTabType = 'active' | 'inactive' | 'all';

export default function LineMfgComponent() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [statusTab, setStatusTab] = useState<StatusTabType>('active')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Reset trang về 1 khi chuyển tab
  useEffect(() => {
    setPage(1)
  }, [statusTab])
  
  // Queries và mutations
  const { data: linesData, isLoading } = useGetAllLineMfg(page, limit, searchDebounced)
  const toggleLineMutation = useToggleLineMfg()
  const downloadTemplateMutation = useDownloadTemplate()
  const importExcelMutation = useImportExcel()
  
  // Lọc lines dựa theo tab đang chọn
  const filteredLines = linesData?.docs.filter(line => {
    if (statusTab === 'all') return true;
    return statusTab === 'active' ? line.status : !line.status;
  }) || [];
  
  // Tính toán totalDocs dựa trên tab đang chọn
  const totalDocsActive = linesData?.docs.filter(line => line.status).length || 0;
  const totalDocsInactive = linesData?.docs.filter(line => !line.status).length || 0;
  
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    // Debounce search
    const timeoutId = setTimeout(() => {
      setSearchDebounced(e.target.value)
      setPage(1) // Reset về trang 1 khi search
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }
  
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleLineMutation.mutateAsync(id)
      
      // Hiển thị thông báo
      toast.success(`Line đã được ${currentStatus ? 'vô hiệu hóa' : 'kích hoạt'}`)
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }
  
  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateMutation.mutateAsync()
    } catch (error) {
      console.error('Error downloading template:', error)
    }
  }
  
  const handleImportFile = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      await importExcelMutation.mutateAsync(file)
    } catch (error) {
      console.error('Error importing file:', error)
    } finally {
      // Reset input để có thể upload lại cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // Table content component
  const LineTable = ({ lines }: { lines: LineMfg[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Tên Line</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[100px]">Ngày tạo</TableHead>
            <TableHead className="w-[100px]">Cập nhật</TableHead>
            <TableHead className="text-right w-[70px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Không tìm thấy dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            lines.map((line, index) => (
              <TableRow key={line._id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell className="font-medium">{line.nameLine}</TableCell>
                <TableCell>
                  <Badge
                    variant={line.status ? "default" : "secondary"}
                    className={line.status ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}
                  >
                    {line.status ? "Đang hoạt động" : "Không hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(line.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(line.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <LineDialog line={line}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      </LineDialog>
                      <DropdownMenuItem 
                        onSelect={() => handleToggleStatus(line._id, line.status)}
                        disabled={toggleLineMutation.isPending}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        {line.status ? "Vô hiệu hóa" : "Kích hoạt"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
  
  // Loading và empty states
  if (isLoading && !linesData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Quản lý Line Sản Xuất</CardTitle>
            <CardDescription>
              Quản lý danh sách các line sản xuất trong hệ thống
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isPending}
            >
              {downloadTemplateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Tải template
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportFile}
              disabled={importExcelMutation.isPending}
            >
              {importExcelMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Import Excel
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            
            <LineDialog>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Line Mới
              </Button>
            </LineDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm line..."
                value={search}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            
            <Tabs 
              value={statusTab} 
              onValueChange={(value) => setStatusTab(value as StatusTabType)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active" className="relative">
                  Đang hoạt động
                  {totalDocsActive > 0 && (
                    <Badge className="ml-2 bg-primary/20 text-primary absolute -top-2 -right-2">
                      {totalDocsActive}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="inactive" className="relative">
                  Không hoạt động
                  {totalDocsInactive > 0 && (
                    <Badge className="ml-2 bg-muted text-muted-foreground absolute -top-2 -right-2">
                      {totalDocsInactive}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">
                  Tất cả
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <LineTable lines={filteredLines} />
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Hiển thị {filteredLines.length} 
          {statusTab === 'active' && ` trong tổng số ${totalDocsActive} line đang hoạt động`}
          {statusTab === 'inactive' && ` trong tổng số ${totalDocsInactive} line không hoạt động`}
          {statusTab === 'all' && ` trong tổng số ${linesData?.totalDocs || 0} line`}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            Trước
          </Button>
          <div className="text-sm text-muted-foreground">
            Trang {page} / {linesData?.totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= (linesData?.totalPages || 1) || isLoading}
          >
            Sau
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
