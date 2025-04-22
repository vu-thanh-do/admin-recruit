import { TableRow } from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { TableCell } from "@/components/ui/table"

const RenderSkeletonRows = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className='h-4 w-4' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-16' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-28' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-20' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-12' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-32' />
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-8 w-8 rounded-full' />
          </div>
        </TableCell>
      </TableRow>
    ))
}
export default RenderSkeletonRows;