'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/common/data-table'
import { TablePagination } from '@/components/common/TablePagination'
import { ShareFilters } from './ShareFilters'
import { BuySharesDialog } from './BuySharesDialog'
import { SellSharesDialog } from './SellSharesDialog'
import { TransferSharesDialog } from './TransferSharesDialog'
import { ShareAccount } from '@/types/shares'
import { Icon } from '@iconify/react'
import { formatCurrency } from '@/lib/format'

function getInitials(first?: string, last?: string) {
  return [first?.[0], last?.[0]].filter(Boolean).join('').toUpperCase() || '?'
}

interface Props {
  data: ShareAccount[]
  total: number
}

const ShareAccountsList = ({ data, total }: Props) => {
  const router = useRouter()
  const [buyTarget, setBuyTarget] = useState<ShareAccount | null>(null)
  const [sellTarget, setSellTarget] = useState<ShareAccount | null>(null)
  const [transferTarget, setTransferTarget] = useState<ShareAccount | null>(null)
  const [buyOpen, setBuyOpen] = useState(false)
  const [sellOpen, setSellOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)

  const onSuccess = () => {
    setBuyTarget(null)
    setSellTarget(null)
    setTransferTarget(null)
    setBuyOpen(false)
    setSellOpen(false)
    setTransferOpen(false)
    router.refresh()
  }

  const columns: ColumnDef<ShareAccount>[] = [
    {
      id: 'member',
      header: 'Member',
      accessorFn: (row) =>
        row.member
          ? [row.member.profile?.first_name, row.member.profile?.last_name].filter(Boolean).join(' ')
          : row.member_id,
      cell: ({ row }) => {
        const sa = row.original
        const name = sa.member
          ? [sa.member.profile?.first_name, sa.member.profile?.last_name].filter(Boolean).join(' ')
          : sa.member_id
        return (
          <div className='flex items-center gap-3 min-w-0'>
            <Avatar className='size-8 shrink-0'>
              <AvatarImage src={sa.member?.profile?.avatar_url || undefined} />
              <AvatarFallback className='text-xs bg-primary/10 text-primary'>
                {getInitials(sa.member?.profile?.first_name, sa.member?.profile?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <p className='text-sm font-medium truncate'>{name || '—'}</p>
              {sa.member && (
                <p className='text-xs text-muted-foreground font-mono'>{sa.member.member_number}</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'account_number',
      header: 'Account Number',
      cell: ({ row }) => (
        <span className='text-sm font-mono'>{row.getValue('account_number')}</span>
      ),
    },
    {
      accessorKey: 'total_shares',
      header: 'Total Shares',
      cell: ({ row }) => (
        <span className='text-sm font-medium'>{row.getValue('total_shares')}</span>
      ),
    },
    {
      accessorKey: 'total_value',
      header: 'Total Value',
      cell: ({ row }) => (
        <span className='text-sm'>{formatCurrency(row.getValue('total_value'))}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const sa = row.original
        return (
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => { setBuyTarget(sa); setBuyOpen(true) }}
            >
              <Icon icon='solar:add-circle-linear' fontSize={14} />
              Buy
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => { setSellTarget(sa); setSellOpen(true) }}
            >
              <Icon icon='solar:minus-circle-linear' fontSize={14} />
              Sell
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => { setTransferTarget(sa); setTransferOpen(true) }}
            >
              <Icon icon='solar:transfer-horizontal-linear' fontSize={14} />
              Transfer
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable<ShareAccount>
        columns={columns}
        data={data}
        toolbar={<ShareFilters />}
        emptyMessage='No share accounts found.'
        paginationComponent={<TablePagination total={total} />}
      />

      <BuySharesDialog
        defaultMemberId={buyTarget?.member_id}
        open={buyOpen}
        onOpenChange={(o) => { if (!o) { setBuyOpen(false); setBuyTarget(null) } }}
        onSuccess={onSuccess}
      />

      <SellSharesDialog
        defaultMemberId={sellTarget?.member_id}
        open={sellOpen}
        onOpenChange={(o) => { if (!o) { setSellOpen(false); setSellTarget(null) } }}
        onSuccess={onSuccess}
      />

      <TransferSharesDialog
        defaultFromMemberId={transferTarget?.member_id}
        open={transferOpen}
        onOpenChange={(o) => { if (!o) { setTransferOpen(false); setTransferTarget(null) } }}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default ShareAccountsList
