// src/app/(dashboard)/users/page.tsx
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import UserTable from '@/components/users/user-table'
import UserDialog from '@/components/users/user-dialog'
import { getUsers } from '@/lib/api/users'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function UsersPage() {
  const queryClient = new QueryClient()
  
  // Prefetch data trên server
  await queryClient.prefetchQuery({
    queryKey: ['users', 1],
    queryFn: () => getUsers(1)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <UserDialog>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </UserDialog>
        </div>
        <Suspense fallback={<div>Đang tải danh sách người dùng...</div>}>
          <UserTable />
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}