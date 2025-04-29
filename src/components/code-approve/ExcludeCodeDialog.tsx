import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash2 } from "lucide-react"
import { ICodeApproval, IExcludeCodeApprove } from '@/types/code-approval'

interface ExcludeCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCodeApproval: ICodeApproval | null
  onAddExclude: (data: { employeeCode: string }) => Promise<void>
  onUpdateExclude: (data: { employeeCode: string }, index: number) => Promise<void>
  onDeleteExclude: (index: number) => Promise<void>
}

export default function ExcludeCodeDialog({
  open,
  onOpenChange,
  selectedCodeApproval,
  onAddExclude,
  onUpdateExclude,
  onDeleteExclude
}: ExcludeCodeDialogProps) {
  const [employeeCode, setEmployeeCode] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const resetForm = () => {
    setEmployeeCode('')
    setSelectedIndex(null)
  }

  const handleEdit = (item: IExcludeCodeApprove, index: number) => {
    setEmployeeCode(item.employeeCode)
    setSelectedIndex(index)
  }

  const handleSave = async () => {
    try {
      if (selectedIndex !== null) {
        await onUpdateExclude({ employeeCode }, selectedIndex)
      } else {
        await onAddExclude({ employeeCode })
      }
      resetForm()
    } catch (error) {
      console.error('Error saving exclude code', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quản lý Exclude Code Approve</DialogTitle>
          <DialogDescription>
            Thêm, sửa, xóa exclude code approve cho {selectedCodeApproval?._idCodeApproval.label}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">{selectedIndex !== null ? 'Sửa' : 'Thêm'} Exclude Code</h4>
            <div>
              <Label htmlFor="excludeEmployeeCode">Mã nhân viên loại trừ</Label>
              <Input
                id="excludeEmployeeCode"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Hủy
              </Button>
              <Button onClick={handleSave}>
                {selectedIndex !== null ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </div>

          <Separator />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã nhân viên loại trừ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!selectedCodeApproval || selectedCodeApproval?.excludeCodeApprove?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Chưa có exclude code approve nào
                  </TableCell>
                </TableRow>
              ) : (
                selectedCodeApproval.excludeCodeApprove.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.employeeCode}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item, index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteExclude(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
} 