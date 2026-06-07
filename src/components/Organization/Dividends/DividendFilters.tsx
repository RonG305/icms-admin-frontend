'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Icon } from '@iconify/react'

export function DividendFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [year, setYear] = useState(searchParams.get('financial_year') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (year) params.set('financial_year', year)
      else params.delete('financial_year')
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [year]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='relative w-40'>
      <Icon
        icon='solar:calendar-linear'
        fontSize={16}
        className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'
      />
      <Input
        placeholder='Financial year...'
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className='pl-9 h-9'
      />
    </div>
  )
}
