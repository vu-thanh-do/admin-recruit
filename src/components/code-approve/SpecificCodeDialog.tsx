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
import { ICodeApproval, ISpecificCodeApprove } from '@/types/code-approval'

interface SpecificCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCodeApproval: ICodeApproval | null
  onAddSpecific: (data: { employeeCode: string, employeeName: string, employeeEmail: string }) => Promise<void>
  onUpdateSpecific: (data: { employeeCode: string, employeeName: string, employeeEmail: string }, index: number) => Promise<void>
  onDeleteSpecific: (index: number) => Promise<void>
}

export default function SpecificCodeDialog({
  open,
  onOpenChange,
  selectedCodeApproval,
  onAddSpecific,
  onUpdateSpecific,
  onDeleteSpecific
}: SpecificCodeDialogProps) {
  const [employeeCode, setEmployeeCode] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const resetForm = () => {
    setEmployeeCode('')
    setEmployeeName('')
    setEmployeeEmail('')
    setSelectedIndex(null)
  }

  const handleEdit = (item: ISpecificCodeApprove, index: number) => {
    setEmployeeCode(item.employeeCode)
    setEmployeeName(item.employeeName)
    setEmployeeEmail(item.employeeEmail)
    setSelectedIndex(index)
  }

  const handleSave = async () => {
    try {
      if (selectedIndex !== null) {
        await onUpdateSpecific({ employeeCode, employeeName, employeeEmail }, selectedIndex)
      } else {
        await onAddSpecific({ employeeCode, employeeName, employeeEmail })
      }
      resetForm()
    } catch (error) {
      console.error('Error saving specific code', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Quản lý Specific Code Approve</DialogTitle>
          <DialogDescription>
            Thêm, sửa, xóa specific code approve cho {selectedCodeApproval?._idCodeApproval.label}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">{selectedIndex !== null ? 'Sửa' : 'Thêm'} Specific Code</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="employeeCode">Mã nhân viên</Label>
                <Input
                  id="employeeCode"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="employeeName">Tên nhân viên</Label>
                <Input
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="employeeEmail">Email nhân viên</Label>
                <Input
                  id="employeeEmail"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                />
              </div>
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
                <TableHead>Mã nhân viên</TableHead>
                <TableHead>Tên nhân viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!selectedCodeApproval || selectedCodeApproval.specificCodeApprove?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Chưa có specific code approve nào
                  </TableCell>
                </TableRow>
              ) : (
                selectedCodeApproval.specificCodeApprove.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.employeeCode}</TableCell>
                    <TableCell>{item.employeeName}</TableCell>
                    <TableCell>{item.employeeEmail}</TableCell>
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
                          onClick={() => onDeleteSpecific(index)}
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