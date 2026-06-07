'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function ShareFilters() {
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

  return (
    <div className='relative w-full max-w-xs'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
      <Input
        placeholder='Search share accounts...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='pl-9 h-9'
      />
    </div>
  )
}
