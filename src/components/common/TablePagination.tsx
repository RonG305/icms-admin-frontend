'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TablePaginationProps {
  total: number
  defaultPageSize?: number
}

export function TablePagination({ total, defaultPageSize = 10 }: TablePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || String(defaultPageSize), 10)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const push = (page: number, size: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    params.set('pageSize', String(size))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex items-center justify-between gap-4'>
      <p className='text-muted-foreground hidden text-sm lg:block'>
        {total} result{total !== 1 ? 's' : ''}
      </p>

      <div className='flex items-center gap-6 lg:gap-8'>
        <div className='hidden items-center gap-2 lg:flex'>
          <span className='text-sm font-medium whitespace-nowrap'>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => push(1, Number(val))}
          >
            <SelectTrigger size='sm' className='w-20 cursor-pointer'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 50].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className='text-sm font-medium whitespace-nowrap'>
          Page {currentPage} of {totalPages}
        </span>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='hidden size-8 p-0 lg:flex cursor-pointer'
            onClick={() => push(1, pageSize)}
            disabled={currentPage <= 1}
          >
            <span className='sr-only'>First page</span>
            <ChevronsLeft className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => push(currentPage - 1, pageSize)}
            disabled={currentPage <= 1}
          >
            <span className='sr-only'>Previous page</span>
            <ChevronLeft className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={() => push(currentPage + 1, pageSize)}
            disabled={currentPage >= totalPages}
          >
            <span className='sr-only'>Next page</span>
            <ChevronRight className='size-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden size-8 p-0 lg:flex cursor-pointer'
            onClick={() => push(totalPages, pageSize)}
            disabled={currentPage >= totalPages}
          >
            <span className='sr-only'>Last page</span>
            <ChevronsRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
