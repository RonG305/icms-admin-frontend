'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ExitRequestFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('search', search)
      else params.delete('search')
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set('status', value)
    else params.delete('status')
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='relative w-full max-w-xs'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
        <Input
          placeholder='Search exit requests...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-9 h-9'
        />
      </div>
      <Select
        defaultValue={searchParams.get('status') || 'all'}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className='w-40 h-9'>
          <SelectValue placeholder='All statuses' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All statuses</SelectItem>
          <SelectItem value='pending'>Pending</SelectItem>
          <SelectItem value='under_review'>Under Review</SelectItem>
          <SelectItem value='approved'>Approved</SelectItem>
          <SelectItem value='rejected'>Rejected</SelectItem>
          <SelectItem value='completed'>Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
