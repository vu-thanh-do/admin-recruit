'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { ICodeApproval, CodeApprovalOption, IFormTemplate } from '@/types/code-approval'

// Import các components đã tách
import FormDetailsCard from '@/components/code-approve/FormDetailsCard'
import CodeApprove from '@/components/code-approve/CodeApprove'
import SpecificCodeDialog from '@/components/code-approve/SpecificCodeDialog'
import ExcludeCodeDialog from '@/components/code-approve/ExcludeCodeDialog'

export default function FormTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [codeApproval, setCodeApproval] = useState<ICodeApproval[]>([])
  const [formTemplate, setFormTemplate] = useState<IFormTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [nameFormVi, setNameFormVi] = useState('')
  const [nameFormEn, setNameFormEn] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()
  
  // Dialog states
  const [openSpecificDialog, setOpenSpecificDialog] = useState(false)
  const [openExcludeDialog, setOpenExcludeDialog] = useState(false)
  const [selectedCodeApproval, setSelectedCodeApproval] = useState<ICodeApproval | null>(null)
  const [codeApprovalOptions, setCodeApprovalOptions] = useState<CodeApprovalOption[]>([])

  // Fetch form template data
  useEffect(() => {
    const fetchFormTemplate = async () => {
      try {
        setLoading(true)
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/formTemplate/get-by-id/' + id + '?codeUser=' + session?.user.EmployeeCode)
        const data = response.data.data
        console.log(data, 'data')
        setFormTemplate(data?.formTemplate)
        setCodeApproval(data?.codeApproval)
        setNameFormVi(data?.formTemplate?.nameForm?.vi || '')
        setNameFormEn(data?.formTemplate?.nameForm?.en || '')
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
  }, [id, session])

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
  const addCodeApproval = async (data: { _idCodeApproval: string, status: string, indexSTT: number }) => {
    try {
      const response = await axios.post(`/api/formTemplate/${id}/code-approval`, data)
      setFormTemplate(response.data.data)
      toast.success("Đã thêm code approval")
      return response.data
    } catch (error: any) {
      console.error('Error adding code approval:', error)
      toast.error("Không thể thêm code approval")
      throw error
    }
  }

  // Update code approval
  const updateCodeApproval = async (data: { status: string, indexSTT: number }) => {
    if (!selectedCodeApproval) return
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}`,
        data
      )
      setFormTemplate(response.data.data)
      toast.success("Đã cập nhật code approval")
      return response.data
    } catch (error: any) {
      console.error('Error updating code approval:', error)
      toast.error("Không thể cập nhật code approval")
      throw error
    }
  }

  // Add specific code approve
  const addSpecificCodeApprove = async (data: { employeeCode: string, employeeName: string, employeeEmail: string }) => {
    if (!selectedCodeApproval) return
    try {
      const response = await axios.post(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/specific-code-approve`,
        data
      )
      setFormTemplate(response.data.data)
      toast.success("Đã thêm specific code approve")
      return response.data
    } catch (error) {
      console.error('Error adding specific code approve:', error)
      toast.error("Không thể thêm specific code approve")
      throw error
    }
  }

  // Update specific code approve
  const updateSpecificCodeApprove = async (
    data: { employeeCode: string, employeeName: string, employeeEmail: string },
    index: number
  ) => {
    if (!selectedCodeApproval) return
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/specific-code-approve/${index}`,
        data
      )
      setFormTemplate(response.data.data)
      toast.success("Đã cập nhật specific code approve")
      return response.data
    } catch (error) {
      console.error('Error updating specific code approve:', error)
      toast.error("Không thể cập nhật specific code approve")
      throw error
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
      return response.data
    } catch (error) {
      console.error('Error deleting specific code approve:', error)
      toast.error("Không thể xóa specific code approve")
      throw error
    }
  }

  // Add exclude code approve
  const addExcludeCodeApprove = async (data: { employeeCode: string }) => {
    if (!selectedCodeApproval) return
    try {
      const response = await axios.post(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/exclude-code-approve`,
        data
      )
      setFormTemplate(response.data.data)
      toast.success("Đã thêm exclude code approve")
      return response.data
    } catch (error) {
      console.error('Error adding exclude code approve:', error)
      toast.error("Không thể thêm exclude code approve")
      throw error
    }
  }

  // Update exclude code approve
  const updateExcludeCodeApprove = async (data: { employeeCode: string }, index: number) => {
    if (!selectedCodeApproval) return
    try {
      const response = await axios.put(
        `/api/formTemplate/${id}/code-approval/${selectedCodeApproval._id}/exclude-code-approve/${index}`,
        data
      )
      setFormTemplate(response.data.data)
      toast.success("Đã cập nhật exclude code approve")
      return response.data
    } catch (error) {
      console.error('Error updating exclude code approve:', error)
      toast.error("Không thể cập nhật exclude code approve")
      throw error
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
      return response.data
    } catch (error) {
      console.error('Error deleting exclude code approve:', error)
      toast.error("Không thể xóa exclude code approve")
      throw error
    }
  }

  // Handlers for components
  const handleEditCodeApproval = (codeApproval: ICodeApproval) => {
    setSelectedCodeApproval(codeApproval)
  }

  const handleOpenSpecificManagement = (codeApproval: ICodeApproval) => {
    setSelectedCodeApproval(codeApproval)
    setOpenSpecificDialog(true)
  }

  const handleOpenExcludeManagement = (codeApproval: ICodeApproval) => {
    setSelectedCodeApproval(codeApproval)
    setOpenExcludeDialog(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Button variant="outline" onClick={() => router.push('/dashboard/form-recruitment')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
      </Button>
      <FormDetailsCard
        formTemplate={formTemplate}
        nameFormVi={nameFormVi}
        nameFormEn={nameFormEn}
        isEditing={isEditing}
        onNameViChange={setNameFormVi}
        onNameEnChange={setNameFormEn}
        onToggleEdit={() => setIsEditing(true)}
        onSaveName={updateFormName}
      />
      <CodeApprove
        codeApproval={codeApproval}
        codeApprovalOptions={codeApprovalOptions}
        onEditCodeApproval={handleEditCodeApproval}
        onAddCodeApproval={addCodeApproval}
        onUpdateCodeApproval={updateCodeApproval}
        onOpenSpecificManagement={handleOpenSpecificManagement}
        onOpenExcludeManagement={handleOpenExcludeManagement}
      />
      <SpecificCodeDialog
        open={openSpecificDialog}
        onOpenChange={setOpenSpecificDialog}
        selectedCodeApproval={selectedCodeApproval}
        onAddSpecific={addSpecificCodeApprove}
        onUpdateSpecific={updateSpecificCodeApprove}
        onDeleteSpecific={deleteSpecificCodeApprove}
      />
      <ExcludeCodeDialog
        open={openExcludeDialog}
        onOpenChange={setOpenExcludeDialog}
        selectedCodeApproval={selectedCodeApproval}
        onAddExclude={addExcludeCodeApprove}
        onUpdateExclude={updateExcludeCodeApprove}
        onDeleteExclude={deleteExcludeCodeApprove}
      />
    </div>
  )
}