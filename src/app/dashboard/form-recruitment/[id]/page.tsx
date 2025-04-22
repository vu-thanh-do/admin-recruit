'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Trash2, Edit, Plus, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'

interface ISpecificCodeApprove {
  employeeCode: string;
  employeeName: string;
  employeeEmail: string;
}

interface IExcludeCodeApprove {
  employeeCode: string;
}

interface ICodeApproval {
  _id: string;
  _idCodeApproval: {
    _id: string;
    label: string;
    code: string;
    status: string;
    index: number;
  };
  status: string;
  indexSTT: number;
  specificCodeApprove: ISpecificCodeApprove[];
  excludeCodeApprove: IExcludeCodeApprove[];
}

interface IFormTemplate {
  _id: string;
  nameForm: {
    vi: string;
    en: string;
  };
  typeForm: string;
  version: string;
  dateApply: string;
  fields: any[];
  codeApproval: ICodeApproval[];
  status: string;
}

interface CodeApprovalOption {
  _id: string;
  label: string;
  code: string;
}

export default function FormTemplatePage() {
  const router = useRouter()
  const id = '67d3ca4e98f7cf6e006648c5'
  const [formTemplate, setFormTemplate] = useState<IFormTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [nameFormVi, setNameFormVi] = useState('')
  const [nameFormEn, setNameFormEn] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Dialog states
  const [openCodeApprovalDialog, setOpenCodeApprovalDialog] = useState(false)
  const [openSpecificDialog, setOpenSpecificDialog] = useState(false)
  const [openExcludeDialog, setOpenExcludeDialog] = useState(false)
  const [selectedCodeApproval, setSelectedCodeApproval] = useState<ICodeApproval | null>(null)
  
  // Form states for adding code approval
  const [codeApprovalOptions, setCodeApprovalOptions] = useState<CodeApprovalOption[]>([])
  const [selectedCodeApprovalId, setSelectedCodeApprovalId] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('active')
  const [indexSTT, setIndexSTT] = useState(0)
  
  // Forms for specific code approve
  const [specificEmployeeCode, setSpecificEmployeeCode] = useState('')
  const [specificEmployeeName, setSpecificEmployeeName] = useState('')
  const [specificEmployeeEmail, setSpecificEmployeeEmail] = useState('')
  const [selectedSpecificIndex, setSelectedSpecificIndex] = useState<number | null>(null)
  
  // Forms for exclude code approve
  const [excludeEmployeeCode, setExcludeEmployeeCode] = useState('')
  const [selectedExcludeIndex, setSelectedExcludeIndex] = useState<number | null>(null)

  // Fetch form template data
  useEffect(() => {
    const fetchFormTemplate = async () => {
      try {
        setLoading(true)
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/formTemplate/get-by-id/67d3ca4e98f7cf6e006648c5')
        const data = response.data.data
        setFormTemplate(data)
        setNameFormVi(data?.nameForm?.vi || '')
        setNameFormEn(data?.nameForm?.en || '')
      } catch (error) {
        console.error('Error fetching form template:', error)
        toast.error("Không thể tải thông tin form template")
      } finally {
        setLoading(false) 
      }
    }

    const fetchCodeApprovals = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/codeApproval/')
        setCodeApprovalOptions(response.data.data)
      } catch (error) {
        console.error('Error fetching code approvals:', error)
      }
    }
    fetchFormTemplate()
     fetchCodeApprovals()
  }, [toast])

  // Update form template name
  const updateFormName = async () => {
    try {
      await axios.put(`/api/formTemplate/edit-form/${id}`, {
        nameForm: {
          vi: nameFormVi,
          en: nameFormEn
        }
      })
      
      if (formTemplate) {
        setFormTemplate({
          ...formTemplate,
          nameForm: {
            vi: nameFormVi,
            en: nameFormEn
          }
        })
      }
      
      setIsEditing(false)
      toast.success("Đã cập nhật tên form")
    } catch (error) {
      console.error('Error updating form name:', error)
      toast.error("Không thể cập nhật tên form")
    }
  }

  // Add code approval
  const addCodeApproval = async () => {
    try {
      const response = await axios.post(`/api/formTemplate/${id}/code-approval`, {
        _idCodeApproval: selectedCodeApprovalId,
        status: approvalStatus,
        indexSTT: indexSTT
      })
      
      setFormTemplate(response.data.data)
      setOpenCodeApprovalDialog(false)
      resetCodeApprovalForm()
      
      toast.success("Đã thêm code approval")
    } catch (error: any) {
      console.error('Error adding code approval:', error)
      toast.error("Không thể thêm code approval")
    }
  }

  // Update code approval
  const updateCodeApproval = async () => {
    if (!selectedCodeApproval) return
    
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}`,
        {
          status: approvalStatus,
          indexSTT: indexSTT
        }
      )
      
      setFormTemplate(response.data.data)
      setOpenCodeApprovalDialog(false)
      resetCodeApprovalForm()
      
      toast.success("Đã cập nhật code approval")
    } catch (error: any) {
      console.error('Error updating code approval:', error)
      toast.error("Không thể cập nhật code approval")
    }
  }

  // Add specific code approve
  const addSpecificCodeApprove = async () => {
    if (!selectedCodeApproval) return
    
    try {
      const response = await axios.post(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/specific-code-approve`,
        {
          employeeCode: specificEmployeeCode,
          employeeName: specificEmployeeName,
          employeeEmail: specificEmployeeEmail
        }
      )
      
      setFormTemplate(response.data.data)
      resetSpecificForm()
      
      toast.success("Đã thêm specific code approve")
    } catch (error) {
      console.error('Error adding specific code approve:', error)
      toast.error("Không thể thêm specific code approve")
    }
  }

  // Update specific code approve
  const updateSpecificCodeApprove = async () => {
    if (!selectedCodeApproval || selectedSpecificIndex === null) return
    
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/specific-code-approve/${selectedSpecificIndex}`,
        {
          employeeCode: specificEmployeeCode,
          employeeName: specificEmployeeName,
          employeeEmail: specificEmployeeEmail
        }
      )
      
      setFormTemplate(response.data.data)
      resetSpecificForm()
      
      toast.success("Đã cập nhật specific code approve")
    } catch (error) {
      console.error('Error updating specific code approve:', error)
      toast.error("Không thể cập nhật specific code approve")
    }
  }

  // Delete specific code approve
  const deleteSpecificCodeApprove = async (index: number) => {
    if (!selectedCodeApproval) return
    
    try {
      const response = await axios.delete(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/specific-code-approve/${index}`
      )
      
      setFormTemplate(response.data.data)
      
      toast.success("Đã xóa specific code approve")
    } catch (error) {
      console.error('Error deleting specific code approve:', error)
      toast.error("Không thể xóa specific code approve")
    }
  }

  // Add exclude code approve
  const addExcludeCodeApprove = async () => {
    if (!selectedCodeApproval) return
    
    try {
      const response = await axios.post(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/exclude-code-approve`,
        {
          employeeCode: excludeEmployeeCode
        }
      )
      
      setFormTemplate(response.data.data)
      resetExcludeForm()
      
      toast.success("Đã thêm exclude code approve")
    } catch (error) {
      console.error('Error adding exclude code approve:', error)
      toast.error("Không thể thêm exclude code approve")
    }
  }

  // Update exclude code approve
  const updateExcludeCodeApprove = async () => {
    if (!selectedCodeApproval || selectedExcludeIndex === null) return
    
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/exclude-code-approve/${selectedExcludeIndex}`,
        {
          employeeCode: excludeEmployeeCode
        }
      )
      
      setFormTemplate(response.data.data)
      resetExcludeForm()
      
      toast.success("Đã cập nhật exclude code approve")
    } catch (error) {
      console.error('Error updating exclude code approve:', error)
      toast.error("Không thể cập nhật exclude code approve")
    }
  }

  // Delete exclude code approve
  const deleteExcludeCodeApprove = async (index: number) => {
    if (!selectedCodeApproval) return
    
    try {
      const response = await axios.delete(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/exclude-code-approve/${index}`
      )
      
      setFormTemplate(response.data.data)
      
      toast.success("Đã xóa exclude code approve")
    } catch (error) {
      console.error('Error deleting exclude code approve:', error)
      toast.error("Không thể xóa exclude code approve")
    }
  }

  // Edit code approval
  const editCodeApproval = (codeApproval: ICodeApproval) => {
    setSelectedCodeApproval(codeApproval)
    setApprovalStatus(codeApproval.status)
    setIndexSTT(codeApproval.indexSTT)
    setOpenCodeApprovalDialog(true)
  }

  // Reset forms
  const resetCodeApprovalForm = () => {
    setSelectedCodeApprovalId('')
    setApprovalStatus('active')
    setIndexSTT(0)
    setSelectedCodeApproval(null)
  }
  
  const resetSpecificForm = () => {
    setSpecificEmployeeCode('')
    setSpecificEmployeeName('')
    setSpecificEmployeeEmail('')
    setSelectedSpecificIndex(null)
  }
  
  const resetExcludeForm = () => {
    setExcludeEmployeeCode('')
    setSelectedExcludeIndex(null)
  }

  // Set up edit for specific code approve
  const editSpecific = (item: ISpecificCodeApprove, index: number) => {
    setSpecificEmployeeCode(item.employeeCode)
    setSpecificEmployeeName(item.employeeName)
    setSpecificEmployeeEmail(item.employeeEmail)
    setSelectedSpecificIndex(index)
  }

  // Set up edit for exclude code approve
  const editExclude = (item: IExcludeCodeApprove, index: number) => {
    setExcludeEmployeeCode(item.employeeCode)
    setSelectedExcludeIndex(index)
  }

  // Open dialog for specific or exclude code approve management
  const openCodeApproveManagement = (codeApproval: ICodeApproval, type: 'specific' | 'exclude') => {
    setSelectedCodeApproval(codeApproval)
    if (type === 'specific') {
      setOpenSpecificDialog(true)
    } else {
      setOpenExcludeDialog(true)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>
  }

 

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Thông tin Form Template</span>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => isEditing ? updateFormName() : setIsEditing(true)}
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
                value={nameFormVi} 
                onChange={(e) => setNameFormVi(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="nameEn">Tên form (Tiếng Anh)</Label>
              <Input 
                id="nameEn" 
                value={nameFormEn} 
                onChange={(e) => setNameFormEn(e.target.value)}
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
                {new Date(formTemplate?.dateApply).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
          
          <div>
            <Label>Trạng thái</Label>
            <div className="mt-1">
              <Badge variant={formTemplate?.status === 'active' ? "success" : "destructive"}>
                {formTemplate?.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Danh sách Code Approval</span>
            <Dialog open={openCodeApprovalDialog} onOpenChange={setOpenCodeApprovalDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetCodeApprovalForm()
                  setOpenCodeApprovalDialog(true)
                }}>
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
                    setOpenCodeApprovalDialog(false)
                    resetCodeApprovalForm()
                  }}>
                    Hủy
                  </Button>
                  <Button onClick={selectedCodeApproval ? updateCodeApproval : addCodeApproval}>
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
              {formTemplate?.codeApproval?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Chưa có code approval nào
                  </TableCell>
                </TableRow>
              ) : (
                formTemplate?.codeApproval?.sort((a, b) => a.indexSTT - b.indexSTT)
                  .map((codeApproval) => (
                    <TableRow key={codeApproval._id}>
                      <TableCell className="font-medium">{codeApproval.indexSTT}</TableCell>
                      <TableCell>{codeApproval._idCodeApproval.label}</TableCell>
                      <TableCell>{codeApproval._idCodeApproval.code}</TableCell>
                      <TableCell>
                          <Badge variant={codeApproval.status === 'active' ? "success" : "destructive"}>
                          {codeApproval.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCodeApproveManagement(codeApproval, 'specific')}
                          >
                            Specific Code
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCodeApproveManagement(codeApproval, 'exclude')}
                          >
                            Exclude Code
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editCodeApproval(codeApproval)}
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

      {/* Dialog for Specific Code Approve */}
      <Dialog open={openSpecificDialog} onOpenChange={setOpenSpecificDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Quản lý Specific Code Approve</DialogTitle>
            <DialogDescription>
              Thêm, sửa, xóa specific code approve cho {selectedCodeApproval?._idCodeApproval.label}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{selectedSpecificIndex !== null ? 'Sửa' : 'Thêm'} Specific Code</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employeeCode">Mã nhân viên</Label>
                  <Input
                    id="employeeCode"
                    value={specificEmployeeCode}
                    onChange={(e) => setSpecificEmployeeCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeName">Tên nhân viên</Label>
                  <Input
                    id="employeeName"
                    value={specificEmployeeName}
                    onChange={(e) => setSpecificEmployeeName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeEmail">Email nhân viên</Label>
                  <Input
                    id="employeeEmail"
                    value={specificEmployeeEmail}
                    onChange={(e) => setSpecificEmployeeEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={resetSpecificForm}>
                  Hủy
                </Button>
                <Button onClick={selectedSpecificIndex !== null ? updateSpecificCodeApprove : addSpecificCodeApprove}>
                  {selectedSpecificIndex !== null ? 'Cập nhật' : 'Thêm'}
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
                            onClick={() => editSpecific(item, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSpecificCodeApprove(index)}
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

      {/* Dialog for Exclude Code Approve */}
      <Dialog open={openExcludeDialog} onOpenChange={setOpenExcludeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quản lý Exclude Code Approve</DialogTitle>
            <DialogDescription>
              Thêm, sửa, xóa exclude code approve cho {selectedCodeApproval?._idCodeApproval.label}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{selectedExcludeIndex !== null ? 'Sửa' : 'Thêm'} Exclude Code</h4>
              <div>
                <Label htmlFor="excludeEmployeeCode">Mã nhân viên loại trừ</Label>
                <Input
                  id="excludeEmployeeCode"
                  value={excludeEmployeeCode}
                  onChange={(e) => setExcludeEmployeeCode(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={resetExcludeForm}>
                  Hủy
                </Button>
                <Button onClick={selectedExcludeIndex !== null ? updateExcludeCodeApprove : addExcludeCodeApprove}>
                  {selectedExcludeIndex !== null ? 'Cập nhật' : 'Thêm'}
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
                            onClick={() => editExclude(item, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExcludeCodeApprove(index)}
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
    </div>
  )
}