'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pencil, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { CodeApproval, CodeApprovalResponse } from '@/types/code-approval'
import { updateCodeApproval, getCodeApproval } from '@/lib/api/codeApproval'
import { getForm } from '@/lib/api/form'
import { Form, FormResponse } from '@/types/form'
    export default function FormRecruitment() {
    const [currentTab, setCurrentTab] = useState('all');
    const [formState, setFormState] = useState<Partial<Form>>({});
    const { data: formRecruitment, isLoading, refetch } = useQuery<FormResponse>({
        queryKey: ['formRecruitment'],
        queryFn: getForm,
        placeholderData: { status: 200, message: 'success', data: [] },
    });

    const handleEdit = (approval: Form) => {
       
    };
  
    if(isLoading){
      return <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    }
    return (
        <div className="space-y-4">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Quản lý form</h1>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
                    <TabsContent value={currentTab}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên form</TableHead>
                                    <TableHead>Loại form</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formRecruitment?.data?.map((form) => (
                                    <TableRow key={form._id}>
                                        <TableCell>{form.nameForm.vi}</TableCell>
                                        <TableCell>{form.typeForm}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-white ${form.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {form.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(new Date(form.createdAt))}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(form)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {formRecruitment?.data?.length === 0 && (
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
