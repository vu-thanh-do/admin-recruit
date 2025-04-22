'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { CodeApproval, CodeApprovalResponse } from '@/types/code-approval'
import { updateCodeApproval, getCodeApproval } from '@/lib/api/codeApproval'

export default function ListCodeApproval() {
    const [currentTab, setCurrentTab] = useState('all');
    const [selectedApproval, setSelectedApproval] = useState<CodeApproval | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formState, setFormState] = useState<Partial<CodeApproval>>({});

    const { data: codeApproval, isLoading, refetch } = useQuery<CodeApprovalResponse>({
        queryKey: ['codeApproval'],
        queryFn: getCodeApproval,
        placeholderData: { status: 200, message: 'success', data: [] },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CodeApproval> }) => updateCodeApproval(id, data),
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            setIsEditDialogOpen(false);
            setSelectedApproval(null);
            refetch();
        },
        onError: () => {
            toast.error('Cập nhật thất bại!');
        },
    });

    const handleEdit = (approval: CodeApproval) => {
        setSelectedApproval(approval);
        setFormState({ ...approval });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (selectedApproval) {
            updateMutation.mutate({ id: selectedApproval._id, data: formState });
        }
    };

    return (
        <div className="space-y-4">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
                        <DialogDescription>Cập nhật thông tin phê duyệt.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Label</Label>
                        <Input value={formState.label || ''} onChange={(e) => setFormState({ ...formState, label: e.target.value })} />
                        <Label>Code</Label>
                        <Input value={formState.code || ''} disabled />
                        <Label>Trạng thái</Label>
                        <Select value={formState.status || ''} onValueChange={(value) => setFormState({ ...formState, status: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Dừng hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Quản lý cấp phê duyệt</h1>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
                    <TabsContent value={currentTab}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Label</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {codeApproval?.data?.map((approval) => (
                                    <TableRow key={approval._id}>
                                        <TableCell>{approval.label}</TableCell>
                                        <TableCell>{approval.code}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-white ${approval.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {approval.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(new Date(approval.createdAt))}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(approval)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {codeApproval?.data?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
