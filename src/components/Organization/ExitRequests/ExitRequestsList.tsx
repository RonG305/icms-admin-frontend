'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/common/data-table'
import { TablePagination } from '@/components/common/TablePagination'
import { ActionDropdown } from '@/components/common/ActionDropdown'
import { ExitRequestFilters } from './ExitRequestFilters'
import { ViewExitRequestDrawer } from './ViewExitRequestDrawer'
import { ReviewExitRequestDialog } from './ReviewExitRequestDialog'
import { SettleExitRequestDialog } from './SettleExitRequestDialog'
import { ExitRequest } from '@/types/member'
import { Icon } from '@iconify/react'
import { formatDate, formatCurrency } from '@/lib/format'

const statusVariant = (s: string) => {
  const map: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
    pending: 'warning',
    under_review: 'info',
    approved: 'success',
    rejected: 'destructive',
    completed: 'secondary',
  }
  return map[s] ?? 'secondary'
}

interface Props {
  data: ExitRequest[]
  total: number
  reviewedBy: string
}

const ExitRequestsList = ({ data, total, reviewedBy }: Props) => {
  const router = useRouter()
  const [viewTarget, setViewTarget] = useState<ExitRequest | null>(null)
  const [reviewTarget, setReviewTarget] = useState<ExitRequest | null>(null)
  const [settleTarget, setSettleTarget] = useState<ExitRequest | null>(null)

  const onSuccess = () => {
    setReviewTarget(null)
    setSettleTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<ExitRequest>[] = [
    {
      id: 'member',
      header: 'Member',
      accessorFn: (row) =>
        row.member
          ? [row.member.profile?.first_name, row.member.profile?.last_name].filter(Boolean).join(' ')
          : row.member_id,
      cell: ({ row }) => {
        const er = row.original
        const name = er.member
          ? [er.member.profile?.first_name, er.member.profile?.last_name].filter(Boolean).join(' ')
          : er.member_id
        return (
          <div className='min-w-0'>
            <p className='text-sm font-medium truncate'>{name || '—'}</p>
            {er.member && (
              <p className='text-xs text-muted-foreground font-mono'>
                {er.member.member_number}
              </p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className='text-sm capitalize'>
          {(row.getValue('reason') as string).replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.getValue('status') as string
        return (
          <Badge variant={statusVariant(s)} className='capitalize text-xs'>
            {s.replace(/_/g, ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'settlement_amount',
      header: 'Settlement',
      cell: ({ row }) => {
        const val = row.getValue('settlement_amount') as string | undefined
        return (
          <span className='text-sm text-muted-foreground'>
            {val ? formatCurrency(val) : '—'}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDate(row.getValue('created_at'))}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const er = row.original
        const canReview = er.status === 'pending' || er.status === 'under_review'
        const canSettle = er.status === 'approved'
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setViewTarget(er)}>
              <Icon icon='solar:eye-linear' fontSize={16} />
              <span>View</span>
            </DropdownMenuItem>
            {canReview && (
              <DropdownMenuItem onClick={() => setReviewTarget(er)}>
                <Icon icon='solar:document-text-linear' fontSize={16} />
                <span>Review</span>
              </DropdownMenuItem>
            )}
            {canSettle && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettleTarget(er)}>
                  <Icon icon='solar:check-circle-linear' fontSize={16} />
                  <span>Settle</span>
                </DropdownMenuItem>
              </>
            )}
          </ActionDropdown>
        )
      },
    },
  ]

  return (
    <>
      <DataTable<ExitRequest>
        columns={columns}
        data={data}
        toolbar={<ExitRequestFilters />}
        emptyMessage='No exit requests found.'
        paginationComponent={<TablePagination total={total} />}
      />

      {viewTarget && (
        <ViewExitRequestDrawer
          exitRequest={viewTarget}
          open={!!viewTarget}
          onOpenChange={(o) => !o && setViewTarget(null)}
        />
      )}

      {reviewTarget && (
        <ReviewExitRequestDialog
          exitRequest={reviewTarget}
          reviewedBy={reviewedBy}
          open={!!reviewTarget}
          onOpenChange={(o) => !o && setReviewTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {settleTarget && (
        <SettleExitRequestDialog
          exitRequest={settleTarget}
          open={!!settleTarget}
          onOpenChange={(o) => !o && setSettleTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default ExitRequestsList
