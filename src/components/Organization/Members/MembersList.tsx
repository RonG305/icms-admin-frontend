'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/common/data-table'
import { TablePagination } from '@/components/common/TablePagination'
import { ActionDropdown } from '@/components/common/ActionDropdown'
import { MemberFilters } from './MemberFilters'
import { ViewMemberDrawer } from './ViewMemberDrawer'
import { UpdateMemberDialog } from './UpdateMemberDialog'
import { UpdateMemberStatusDialog } from './UpdateMemberStatusDialog'
import { DeleteMemberDialog } from './DeleteMemberDialog'
import { ReviewMembershipDialog } from './ReviewMembershipDialog'
import { CreateMemberDialog } from './CreateMemberDialog'
import { Member } from '@/types/member'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import Link from 'next/link'

function getInitials(first?: string, last?: string) {
  return [first?.[0], last?.[0]].filter(Boolean).join('').toUpperCase() || '?'
}

const statusVariant = (s: string) => {
  if (s === 'active') return 'success' as const
  if (s === 'suspended') return 'destructive' as const
  return 'warning' as const
}

type ReviewAction = 'approve' | 'reject' | 'cancel'

interface Props {
  data: Member[]
  total: number
  organizationId: string
}

const MembersList = ({ data, total, organizationId }: Props) => {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState<Member | null>(null)
  const [updateTarget, setUpdateTarget] = useState<Member | null>(null)
  const [statusTarget, setStatusTarget] = useState<Member | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [reviewTarget, setReviewTarget] = useState<{ member: Member; action: ReviewAction } | null>(null)

  const onSuccess = () => {
    setCreateOpen(false)
    setUpdateTarget(null)
    setStatusTarget(null)
    setDeleteTarget(null)
    setReviewTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<Member>[] = [
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
              <AvatarImage src={m.profile?.avatar_url || undefined} />
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
          {(row.getValue('category') as string)?.replace(/_/g, ' ') ?? '—'}
        </Badge>
      ),
    },
    {
      accessorKey: 'membership_status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.getValue('membership_status') as string
        return (
          <Badge variant={statusVariant(s)} className='capitalize text-xs'>
            {s}
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
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDate(row.getValue('joined_date'))}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const m = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setViewTarget(m)}>
              <Icon icon='solar:eye-linear' fontSize={16} />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/organization/members/${m.id}`}>
                <Icon icon='solar:user-id-linear' fontSize={16} />
                <span>View Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUpdateTarget(m)}>
              <Icon icon='solar:pen-2-linear' fontSize={16} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusTarget(m)}>
              <Icon icon='solar:shield-check-linear' fontSize={16} />
              <span>Update Status</span>
            </DropdownMenuItem>
            {m.membership_status === 'pending_approval' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setReviewTarget({ member: m, action: 'approve' })}>
                  <Icon icon='solar:check-circle-linear' fontSize={16} />
                  <span>Approve</span>
                </DropdownMenuItem>
                <DropdownMenuItem variant='destructive' onClick={() => setReviewTarget({ member: m, action: 'reject' })}>
                  <Icon icon='solar:close-circle-linear' fontSize={16} />
                  <span>Reject</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/organization/members/${m.id}/shares`}>
                <Icon icon='solar:chart-square-linear' fontSize={16} />
                <span>Share Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/organization/members/${m.id}/dividends`}>
                <Icon icon='solar:money-bag-linear' fontSize={16} />
                <span>Dividend Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={() => setReviewTarget({ member: m, action: 'cancel' })}>
              <Icon icon='solar:forbidden-circle-linear' fontSize={16} />
              <span>Cancel Membership</span>
            </DropdownMenuItem>
            <DropdownMenuItem variant='destructive' onClick={() => setDeleteTarget(m)}>
              <Icon icon='solar:trash-bin-trash-linear' fontSize={16} />
              <span>Delete</span>
            </DropdownMenuItem>
          </ActionDropdown>
        )
      },
    },
  ]

  return (
    <>
      <DataTable<Member>
        columns={columns}
        data={data}
        toolbar={
          <div className='flex items-center gap-2'>
            <MemberFilters />
            <Button size='sm' onClick={() => setCreateOpen(true)}>
              <Icon icon='solar:add-circle-linear' fontSize={16} />
              Add Member
            </Button>
          </div>
        }
        emptyMessage='No members found.'
        paginationComponent={<TablePagination total={total} />}
      />

      {viewTarget && (
        <ViewMemberDrawer
          member={viewTarget}
          open={!!viewTarget}
          onOpenChange={(o) => !o && setViewTarget(null)}
        />
      )}

      {updateTarget && (
        <UpdateMemberDialog
          member={updateTarget}
          open={!!updateTarget}
          onOpenChange={(o) => !o && setUpdateTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {statusTarget && (
        <UpdateMemberStatusDialog
          member={statusTarget}
          open={!!statusTarget}
          onOpenChange={(o) => !o && setStatusTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {deleteTarget && (
        <DeleteMemberDialog
          member={deleteTarget}
          open={!!deleteTarget}
          onOpenChange={(o) => !o && setDeleteTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {reviewTarget && (
        <ReviewMembershipDialog
          member={reviewTarget.member}
          action={reviewTarget.action}
          open={!!reviewTarget}
          onOpenChange={(o) => !o && setReviewTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      <CreateMemberDialog
        organizationId={organizationId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default MembersList
