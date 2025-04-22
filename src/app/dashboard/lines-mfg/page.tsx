import { Suspense } from 'react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import LineMfgComponent from '@/components/lines-mfg/LineMfg'

async function getInitialLineMfg() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/lineMfg/getAllLineMfg?page=1&limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Không thể tải dữ liệu line')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch initial lines data:', error)
    return {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    }
  }
}

export default async function LineMfgPage() {
  const queryClient = new QueryClient()
  
  await queryClient.prefetchQuery({
    queryKey: ['lines-mfg', 1, 10, ''],
    queryFn: getInitialLineMfg
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Line Sản Xuất</h1>
      </div>
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Đang tải...</div>}>
          <LineMfgComponent />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}
