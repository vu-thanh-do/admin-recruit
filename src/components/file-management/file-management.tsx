'use client'
import { getConfigSystem } from '@/lib/api/configSystem'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

interface FileData {
    _id: string
    group: string
    key: string
    data: {
        url: string
    }
    createdAt: string
    updatedAt: string
    message: {
        vi: string
    }
}

interface FileResponse {
    status: number
    message: string
    data: {
        docs: FileData[]
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

// Định nghĩa các nhóm file
const FILE_GROUPS = {
    'config.jobdesc': 'Mô tả công việc',
    'config.system': 'Cấu hình hệ thống',
    // Thêm các nhóm khác tại đây
}

export default function FileManagement() {
    const [currentTab, setCurrentTab] = useState('all')
    const [page, setPage] = useState(1)
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)

    const { data: filesData, isLoading, refetch } = useQuery<FileResponse>({
        queryKey: ['files', page, currentTab],
        queryFn: () => getConfigSystem('configSystem'),
        placeholderData: (previousData) => previousData
    })

    const handleDownload = async (url: string, fileName: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/static-files/${url}`)
            if (!response.ok) throw new Error('Download failed')
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(downloadUrl)
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Không thể tải file')
        }
    }

    const handleEdit = (file: FileData) => {
        setSelectedFile(file)
        setIsEditDialogOpen(true)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileToUpload(e.target.files[0])
        }
    }

    const handleUpdateFile = async () => {
        if (!selectedFile || !fileToUpload) return
        const formData = new FormData()
        formData.append('file', fileToUpload)
        formData.append('fileId', selectedFile._id)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/update/`+selectedFile?.data.url.split('/').pop(), {
                method: 'PUT',
                body: formData
            })
            if (!response.ok) throw new Error('Update failed')
            toast.success('Cập nhật file thành công')
            setIsEditDialogOpen(false)
            setSelectedFile(null)
            setFileToUpload(null)
            refetch()
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Không thể cập nhật file')
        }
    }
    // Tạo danh sách các tab từ dữ liệu
    const uniqueKeys = filesData?.data.docs.reduce((keys: string[], file) => {
        if (!keys.includes(file.key)) {
            keys.push(file.key)
        }
        return keys
    }, ['all']) || ['all']

    // them 1 bảng product > proxy , proxypackage
    return (
        <div className="space-y-4">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật file</DialogTitle>
                        <DialogDescription>
                            Chọn file mới để thay thế file hiện tại
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>File hiện tại</Label>
                            <div className="text-sm text-muted-foreground">
                                {selectedFile?.data.url.split('/').pop()}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">Chọn file mới</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateFile}
                            disabled={!fileToUpload}
                        >
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Quản lý File</h1>
                
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        {uniqueKeys.map(key => (
                            key !== 'all' && (
                                <TabsTrigger key={key} value={key}>
                                    {FILE_GROUPS[key as keyof typeof FILE_GROUPS] || key}
                                </TabsTrigger>
                            )
                        ))}
                    </TabsList>

                    <TabsContent value={currentTab}>
                        <div className="rounded-md border overflow-hidden relative">
                            {isLoading && (
                                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên file</TableHead>
                                        <TableHead>Nhóm</TableHead>
                                        <TableHead>Mô tả</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filesData?.data.docs.map((file) => (
                                        <TableRow key={file._id}>
                                            <TableCell>{file.data.url.split('/').pop()}</TableCell>
                                            <TableCell>{file.group}</TableCell>
                                            <TableCell>{file.message.vi}</TableCell>
                                            <TableCell>
                                                {formatDate(new Date(file.createdAt))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDownload(
                                                            file.data.url,
                                                            file.data.url.split('/').pop() || 'download'
                                                        )}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEdit(file)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!filesData?.data.docs.length) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Không có dữ liệu
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                Hiển thị {filesData?.data.docs.length || 0} trong tổng số {filesData?.data.totalDocs || 0} file
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page - 1)}
                                    disabled={!filesData?.data.hasPrevPage}
                                >
                                    Trước
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Trang {filesData?.data.page || 1} / {filesData?.data.totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
                                    disabled={!filesData?.data.hasNextPage}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}

