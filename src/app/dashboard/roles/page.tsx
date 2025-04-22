import RoleDialog from '@/components/roles/role-dialog'
import RoleTable from '@/components/roles/role-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <Link href="/dashboard/roles/add-role" className="text-sm text-primary">
            Add new
          </Link>
      </div>
      <RoleTable />
    </div>
  )
}
