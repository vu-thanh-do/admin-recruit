'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineMfg, useCreateLineMfg, useUpdateLineMfg } from '@/lib/react-query/queries/linesMfg'

interface LineDialogProps {
  children: React.ReactNode
  line?: LineMfg
}

export function LineDialog({ children, line }: LineDialogProps) {
  const [open, setOpen] = useState(false)
  const [nameLine, setNameLine] = useState('')
  const isEditing = !!line
  
  const createLineMutation = useCreateLineMfg()
  const updateLineMutation = useUpdateLineMfg()
  
  // Reset và set form khi mode hoặc data thay đổi
  useEffect(() => {
    if (open && line) {
      setNameLine(line.nameLine)
    } else if (!open) {
      setNameLine('')
    }
  }, [open, line])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (nameLine.trim() === '') return
    
    if (isEditing && line) {
      await updateLineMutation.mutateAsync({ id: line._id, nameLine })
    } else {
      await createLineMutation.mutateAsync(nameLine)
    }
    
    setOpen(false)
  }
  
  const isLoading = createLineMutation.isPending || updateLineMutation.isPending
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa line' : 'Thêm line mới'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Chỉnh sửa thông tin line sản xuất hiện có.'
                : 'Thêm thông tin cho line sản xuất mới vào hệ thống.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nameLine" className="text-right">
                Tên line
              </Label>
              <Input
                id="nameLine"
                value={nameLine}
                onChange={(e) => setNameLine(e.target.value)}
                className="col-span-3"
                placeholder="Nhập tên line"
                required
                disabled={isLoading}
              />
            </div>
            
            {isEditing && line?.history && line.history.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Lịch sử thay đổi</Label>
                <div className="col-span-3 text-sm">
                  {line.history.map((h, index) => (
                    <div key={index} className="mb-1 text-muted-foreground">
                      <span>{h.nameLineBefore}</span>
                      <span className="mx-1">→</span>
                      <span>{index === line.history.length - 1 ? line.nameLine : line.history[index + 1].nameLineBefore}</span>
                      <span className="ml-2 text-xs">
                        ({new Date(h.updatedAt).toLocaleDateString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || nameLine.trim() === ''}
              className="w-full sm:w-auto"
            >
              {isLoading 
                ? 'Đang xử lý...' 
                : isEditing 
                  ? 'Lưu thay đổi' 
                  : 'Tạo line'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 