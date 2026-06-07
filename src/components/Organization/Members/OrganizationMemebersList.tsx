'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/common/data-table'
import { TablePagination } from '@/components/common/TablePagination'
import { OrganizationMember } from '@/types/organization'

function getInitials(first?: string, last?: string) {
  return [first?.[0], last?.[0]].filter(Boolean).join('').toUpperCase() || '?'
}

export const columns: ColumnDef<OrganizationMember>[] = [
  {
    accessorKey: 'member_number',
    header: 'Member No.',
    cell: ({ row }) => (
      <span className='text-sm font-mono font-medium'>{row.getValue('member_number')}</span>
    ),
  },
  {
    id: 'name',
    header: 'Name',
    accessorFn: (row) =>
      [row.profile?.first_name, row.profile?.last_name].filter(Boolean).join(' ') || '—',
    cell: ({ row }) => {
      const m = row.original
      const name =
        [m.profile?.first_name, m.profile?.last_name].filter(Boolean).join(' ') || 'Unknown'
      return (
        <div className='flex items-center gap-3 min-w-0'>
          <Avatar className='size-8 shrink-0'>
            <AvatarImage src={m.profile?.avatar_url} />
            <AvatarFallback className='text-xs bg-primary/10 text-primary'>
              {getInitials(m.profile?.first_name, m.profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-sm font-medium truncate'>{name}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {m.profile?.user?.email ?? '—'}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize text-xs font-normal'>
        {(row.getValue('category') as string).replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'profile.city',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.original.profile
      return (
      <span className='text-sm text-muted-foreground'>
        {row.getValue('profile.city') || '—'}
      </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'} className='capitalize text-xs'>
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'shares',
    header: 'Shares',
    cell: ({ row }) => {
      const account = row.original.share_account
      return (
        <span className='text-sm text-muted-foreground'>
          {account ? account.total_shares : '—'}
        </span>
      )
    },
  },
  {
    accessorKey: 'joined_date',
    header: 'Joined',
    cell: ({ row }) => {
      const raw = row.getValue('joined_date') as string
      return (
        <span className='text-sm text-muted-foreground'>
          {raw ? new Date(raw).toLocaleDateString() : '—'}
        </span>
      )
    },
  },
]

interface Props {
  data: OrganizationMember[]
  total: number
}

const OrganizationMemebersList = ({ data, total }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  // Debounce: push search to URL 400 ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])  // eslint-disable-line react-hooks/exhaustive-deps

  const searchInput = (
    <div className='relative w-full max-w-xs'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
      <Input
        placeholder='Search members...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='pl-9 h-9'
      />
    </div>
  )

  return (
    <DataTable<OrganizationMember>
      columns={columns}
      data={data}
      toolbar={searchInput}
      emptyMessage='No members found.'
      paginationComponent={<TablePagination total={total} />}
    />
  )
}

export default OrganizationMemebersList
