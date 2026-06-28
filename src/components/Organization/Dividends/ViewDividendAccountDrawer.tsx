'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WithdrawDividendDialog } from './WithdrawDividendDialog'
import { ReinvestDividendDialog } from './ReinvestDividendDialog'
import { DividendAccount } from '@/types/dividends'
import { Icon } from '@iconify/react'
import { formatCurrency } from '@/lib/format'

interface Props {
  account: DividendAccount
  memberName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 py-2.5'>
      <span className='text-sm text-muted-foreground shrink-0'>{label}</span>
      <span className='text-sm text-right font-medium break-all'>
        {value ?? <span className='text-muted-foreground font-normal'>—</span>}
      </span>
    </div>
  )
}

export const ViewDividendAccountDrawer = ({ account, memberName, open, onOpenChange }: Props) => {
  const router = useRouter()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [reinvestOpen, setReinvestOpen] = useState(false)

  const onSuccess = () => {
    setWithdrawOpen(false)
    setReinvestOpen(false)
    router.refresh()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>Dividend Account</SheetTitle>
            <SheetDescription>{memberName}</SheetDescription>
          </SheetHeader>

          <div className='flex flex-col gap-4 p-4 overflow-y-auto'>
            <div className='flex flex-col border p-3 rounded-lg divide-y'>
              <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1'>
                Account Info
              </p>
              <Row label='Account Number' value={<span className='font-mono'>{account.account_number}</span>} />
              <Row label='Balance' value={formatCurrency(account.balance)} />
              {account.total_earned !== undefined && (
                <Row label='Total Earned' value={formatCurrency(account.total_earned)} />
              )}
              {account.total_withdrawn !== undefined && (
                <Row label='Total Withdrawn' value={formatCurrency(account.total_withdrawn)} />
              )}
              {account.total_reinvested !== undefined && (
                <Row label='Total Reinvested' value={formatCurrency(account.total_reinvested)} />
              )}
            </div>

            <Separator />

            <div className='flex flex-col gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setWithdrawOpen(true)}
              >
                <Icon icon='solar:wallet-money-linear' fontSize={14} />
                Withdraw
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setReinvestOpen(true)}
              >
                <Icon icon='solar:arrow-right-up-linear' fontSize={14} />
                Reinvest as Shares
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  onOpenChange(false)
                  router.push(`/organization/dividends/${account.member_id}/statement`)
                }}
              >
                <Icon icon='solar:document-text-linear' fontSize={14} />
                View Statement
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <WithdrawDividendDialog
        memberId={account.member_id}
        balance={formatCurrency(account.balance)}
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        onSuccess={onSuccess}
      />
      <ReinvestDividendDialog
        memberId={account.member_id}
        balance={formatCurrency(account.balance)}
        open={reinvestOpen}
        onOpenChange={setReinvestOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}
