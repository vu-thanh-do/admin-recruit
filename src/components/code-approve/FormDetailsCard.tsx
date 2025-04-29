import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Save } from "lucide-react"
import { IFormTemplate } from '@/types/code-approval'

interface FormDetailsCardProps {
  formTemplate: IFormTemplate | null
  nameFormVi: string
  nameFormEn: string
  isEditing: boolean
  onNameViChange: (value: string) => void
  onNameEnChange: (value: string) => void
  onToggleEdit: () => void
  onSaveName: () => Promise<void>
}

export default function FormDetailsCard({
  formTemplate,
  nameFormVi,
  nameFormEn,
  isEditing,
  onNameViChange,
  onNameEnChange,
  onToggleEdit,
  onSaveName
}: FormDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Thông tin Form Template</span>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? onSaveName() : onToggleEdit()}
          >
            {isEditing ? <><Save className="w-4 h-4 mr-2" /> Lưu</> : <><Edit className="w-4 h-4 mr-2" /> Sửa</>}
          </Button>
        </CardTitle>
        <CardDescription>
          Chi tiết form template và quản lý phê duyệt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nameVi">Tên form (Tiếng Việt)</Label>
            <Input
              id="nameVi"
              className="font-bold text-black"
              value={nameFormVi}
              onChange={(e) => onNameViChange(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="nameEn">Tên form (Tiếng Anh)</Label>
            <Input
              id="nameEn"
              className="font-bold text-black"
              value={nameFormEn}
              onChange={(e) => onNameEnChange(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Loại form</Label>
            <div className="mt-1 p-2 border rounded">{formTemplate?.typeForm}</div>
          </div>
          <div>
            <Label>Phiên bản</Label>
            <div className="mt-1 p-2 border rounded">{formTemplate?.version}</div>
          </div>
          <div>
            <Label>Ngày áp dụng</Label>
            <div className="mt-1 p-2 border rounded">
              {formTemplate?.dateApply
                ? new Date(formTemplate.dateApply).toLocaleDateString('vi-VN')
                : 'Chưa có ngày áp dụng'}
            </div>
          </div>
        </div>

        <div>
          <Label>Trạng thái</Label>
          <div className="mt-1">
            <Badge variant={formTemplate?.status === 'active' ? "default" : "destructive"}>
              {formTemplate?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 