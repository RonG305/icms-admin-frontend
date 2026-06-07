'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/common/data-table'
import { ActionDropdown } from '@/components/common/ActionDropdown'
import { ShareDecisionDialog } from './ShareDecisionDialog'
import { ShareTransaction } from '@/types/shares'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/format'

const statusVariant = (s: string) => {
  const map: Record<string, 'warning' | 'success' | 'destructive' | 'info' | 'secondary'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    completed: 'info',
    cancelled: 'secondary',
  }
  return map[s] ?? 'secondary'
}

const typeVariant = (t: string) => {
  const map: Record<string, 'success' | 'info' | 'secondary' | 'warning' | 'destructive'> = {
    coop_purchase: 'success',
    member_purchase: 'info',
    transfer: 'secondary',
    coop_sale: 'warning',
    member_sale: 'destructive',
  }
  return map[t] ?? 'secondary'
}

interface Props {
  data: ShareTransaction[]
  approvedBy: string
}

const PendingTransactionsList = ({ data, approvedBy }: Props) => {
  const router = useRouter()
  const [decisionTarget, setDecisionTarget] = useState<ShareTransaction | null>(null)

  const onSuccess = () => {
    setDecisionTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<ShareTransaction>[] = [
    {
      id: 'member',
      header: 'Member',
      accessorFn: (row) =>
        row.member
          ? [row.member.profile?.first_name, row.member.profile?.last_name].filter(Boolean).join(' ')
          : row.member_id,
      cell: ({ row }) => {
        const tx = row.original
        const name = tx.member
          ? [tx.member.profile?.first_name, tx.member.profile?.last_name].filter(Boolean).join(' ')
          : tx.member_id
        return (
          <div className='min-w-0'>
            <p className='text-sm font-medium truncate'>{name || '—'}</p>
            {tx.member && (
              <p className='text-xs text-muted-foreground font-mono'>{tx.member.member_number}</p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'transaction_type',
      header: 'Type',
      cell: ({ row }) => {
        const t = row.getValue('transaction_type') as string
        return (
          <Badge variant={typeVariant(t)} className='capitalize text-xs'>
            {t.replace(/_/g, ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'number_of_shares',
      header: 'Shares',
      cell: ({ row }) => (
        <span className='text-sm font-medium'>{row.getValue('number_of_shares')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.getValue('status') as string
        return (
          <Badge variant={statusVariant(s)} className='capitalize text-xs'>
            {s}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDate(row.getValue('created_at'))}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const tx = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setDecisionTarget(tx)}>
              <Icon icon='solar:document-text-linear' fontSize={16} />
              <span>Approve / Reject</span>
            </DropdownMenuItem>
          </ActionDropdown>
        )
      },
    },
  ]

  return (
    <>
      <DataTable<ShareTransaction>
        columns={columns}
        data={data}
        emptyMessage='No pending transactions.'
      />

      {decisionTarget && (
        <ShareDecisionDialog
          transaction={decisionTarget}
          approvedBy={approvedBy}
          open={!!decisionTarget}
          onOpenChange={(o) => !o && setDecisionTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default PendingTransactionsList
