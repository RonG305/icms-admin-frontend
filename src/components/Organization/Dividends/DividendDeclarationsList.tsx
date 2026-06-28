'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/common/data-table'
import { TablePagination } from '@/components/common/TablePagination'
import { ActionDropdown } from '@/components/common/ActionDropdown'
import { DividendFilters } from './DividendFilters'
import { UpdateDeclarationDialog } from './UpdateDeclarationDialog'
import { DistributeDeclarationDialog } from './DistributeDeclarationDialog'
import { CreateDeclarationDialog } from './CreateDeclarationDialog'
import { DividendDeclaration } from '@/types/dividends'
import { Icon } from '@iconify/react'
import { formatDate, formatCurrency } from '@/lib/format'

const statusVariant = (s: string) => {
  if (s === 'distributed') return 'success' as const
  return 'info' as const
}

interface Props {
  data: DividendDeclaration[]
  total: number
  organizationId: string
  declaredBy: string
}

const DividendDeclarationsList = ({ data, total, organizationId, declaredBy }: Props) => {
  console.log("Dividend declaration: ", data)
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [updateTarget, setUpdateTarget] = useState<DividendDeclaration | null>(null)
  const [distributeTarget, setDistributeTarget] = useState<DividendDeclaration | null>(null)

  const onSuccess = () => {
    setUpdateTarget(null)
    setDistributeTarget(null)
    setCreateOpen(false)
    router.refresh()
  }

  const columns: ColumnDef<DividendDeclaration>[] = [
    {
  accessorKey: 'declaration_reference',
      header: 'Declaration Ref',
      cell: ({ row }) => (
        <span className='text-sm font-medium'>{row.getValue('declaration_reference')}</span>
      ),
    },
    
    {
      accessorKey: 'financial_year',
      header: 'Financial Year',
      cell: ({ row }) => (
        <span className='text-sm font-medium'>{row.getValue('financial_year')}</span>
      ),
    },
    {
      accessorKey: 'total_pool_amount',
      header: 'Total Pool',
      cell: ({ row }) => (
        <span className='text-sm font-medium'>
          {formatCurrency(row.getValue('total_pool_amount'))}
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
            {s}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'declared_at',
      header: 'Declared At',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDate(row.getValue('declared_at'))}
        </span>
      ),
    },
    {
      accessorKey: 'payment_deadline',
      header: 'Payment Deadline',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {formatDate(row.getValue('payment_deadline'))}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const d = row.original
        const isDeclared = d.status === 'declared'
        return (
          <ActionDropdown>
            {isDeclared && (
              <DropdownMenuItem onClick={() => setUpdateTarget(d)}>
                <Icon icon='solar:pen-2-linear' fontSize={16} />
                <span>Edit</span>
              </DropdownMenuItem>
            )}
            {isDeclared && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDistributeTarget(d)}>
                  <Icon icon='solar:transfer-horizontal-linear' fontSize={16} />
                  <span>Distribute</span>
                </DropdownMenuItem>
              </>
            )}
            {!isDeclared && (
              <DropdownMenuItem disabled>
                <Icon icon='solar:check-circle-linear' fontSize={16} />
                <span>Distributed</span>
              </DropdownMenuItem>
            )}
          </ActionDropdown>
        )
      },
    },
  ]

  const toolbar = (
    <div className='flex items-center gap-2'>
      <DividendFilters />
      <Button size='sm' onClick={() => setCreateOpen(true)}>
        <Icon icon='solar:add-circle-linear' fontSize={16} />
        Declare Dividend
      </Button>
    </div>
  )

  return (
    <>
      <DataTable<DividendDeclaration>
        columns={columns}
        data={data}
        toolbar={toolbar}
        emptyMessage='No dividend declarations found.'
        paginationComponent={<TablePagination total={total} />}
      />

      <CreateDeclarationDialog
        organizationId={organizationId}
        declaredBy={declaredBy}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={onSuccess}
      />

      {updateTarget && (
        <UpdateDeclarationDialog
          declaration={updateTarget}
          open={!!updateTarget}
          onOpenChange={(o) => !o && setUpdateTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {distributeTarget && (
        <DistributeDeclarationDialog
          declaration={distributeTarget}
          open={!!distributeTarget}
          onOpenChange={(o) => !o && setDistributeTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default DividendDeclarationsList
