import EditRole from '@/components/roles/edit-role'
import React from 'react'
interface ParamsProps {
  params: Promise<{
    id?: string
  }>
}
export default async function page({ params }: ParamsProps) {
  const { id } = await params
  
  console.log(id, 'idcc')
  return (
    <>
      <EditRole id={id as string} />
    </>
  )
}
