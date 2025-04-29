import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ICodeApproval, CodeApprovalOption } from '@/types/code-approval'

interface CodeApproveProps {
  codeApproval: ICodeApproval[]
  codeApprovalOptions: CodeApprovalOption[]
  onEditCodeApproval: (codeApproval: ICodeApproval) => void
  onAddCodeApproval: (data: { _idCodeApproval: string, status: string, indexSTT: number }) => Promise<void>
  onUpdateCodeApproval: (data: { status: string, indexSTT: number }) => Promise<void>
  onOpenSpecificManagement: (codeApproval: ICodeApproval) => void
  onOpenExcludeManagement: (codeApproval: ICodeApproval) => void
}

export default function CodeApprove({
  codeApproval,
  codeApprovalOptions,
  onEditCodeApproval,
  onAddCodeApproval,
  onUpdateCodeApproval,
  onOpenSpecificManagement,
  onOpenExcludeManagement
}: CodeApproveProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCodeApproval, setSelectedCodeApproval] = useState<ICodeApproval | null>(null)
  const [selectedCodeApprovalId, setSelectedCodeApprovalId] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('active')
  const [indexSTT, setIndexSTT] = useState(0)

  const resetForm = () => {
    setSelectedCodeApprovalId('')
    setApprovalStatus('active')
    setIndexSTT(0)
    setSelectedCodeApproval(null)
  }

  const handleOpenDialog = () => {
    resetForm()
    setOpenDialog(true)
  }

  const handleEdit = (codeApproval: ICodeApproval) => {
    setSelectedCodeApproval(codeApproval)
    setApprovalStatus(codeApproval.status)
    setIndexSTT(codeApproval.indexSTT)
    setOpenDialog(true)
    onEditCodeApproval(codeApproval)
  }

  const handleSave = async () => {
    try {
      if (selectedCodeApproval) {
        await onUpdateCodeApproval({ status: approvalStatus, indexSTT })
      } else {
        await onAddCodeApproval({ _idCodeApproval: selectedCodeApprovalId, status: approvalStatus, indexSTT })
      }
      setOpenDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error saving code approval', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Danh sách Code Approval</span>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <Plus className="w-4 h-4 mr-2" /> Thêm Code Approval
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedCodeApproval ? 'Sửa Code Approval' : 'Thêm Code Approval'}
                </DialogTitle>
                <DialogDescription>
                  {selectedCodeApproval
                    ? 'Cập nhật thông tin code approval'
                    : 'Thêm code approval mới vào form template'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!selectedCodeApproval && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="codeApproval" className="text-right">
                      Code Approval
                    </Label>
                    <Select
                      value={selectedCodeApprovalId}
                      onValueChange={setSelectedCodeApprovalId}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn Code Approval" />
                      </SelectTrigger>
                      <SelectContent>
                        {codeApprovalOptions.map((option) => (
                          <SelectItem key={option._id} value={option._id}>
                            {option.label} ({option.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select
                    value={approvalStatus}
                    onValueChange={setApprovalStatus}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="indexSTT" className="text-right">
                    Thứ tự
                  </Label>
                  <Input
                    id="indexSTT"
                    type="number"
                    value={indexSTT}
                    onChange={(e) => setIndexSTT(parseInt(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setOpenDialog(false)
                  resetForm()
                }}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>
                  {selectedCodeApproval ? 'Cập nhật' : 'Thêm'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Quản lý các code approval của form template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">STT</TableHead>
              <TableHead>Code Approval</TableHead>
              <TableHead>Mã</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codeApproval?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Chưa có code approval nào
                </TableCell>
              </TableRow>
            ) : (
              codeApproval?.sort((a, b) => a.indexSTT - b.indexSTT)
                .map((codeApproval) => (
                  <TableRow key={codeApproval._id}>
                    <TableCell className="font-medium">{codeApproval.indexSTT}</TableCell>
                    <TableCell>{codeApproval._idCodeApproval.label}</TableCell>
                    <TableCell>{codeApproval._idCodeApproval.code}</TableCell>
                    <TableCell>
                      <Badge variant={codeApproval.status === 'active' ? "default" : "destructive"}>
                        {codeApproval.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenSpecificManagement(codeApproval)}
                        >
                          Specific Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenExcludeManagement(codeApproval)}
                        >
                          Exclude Code
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(codeApproval)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
