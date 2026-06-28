'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WithdrawDividendDialog } from './WithdrawDividendDialog'
import { ReinvestDividendDialog } from './ReinvestDividendDialog'
import { Icon } from '@iconify/react'
import { formatCurrency } from '@/lib/format'

interface Props {
  memberId: string
  balance: string
  processedBy?: string
}

const MemberDividendActions = ({ memberId, balance }: Props) => {
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
      <div className='flex flex-col gap-2'>
        <Button variant='outline' onClick={() => setWithdrawOpen(true)} className='justify-start'>
          <Icon icon='solar:wallet-money-linear' fontSize={16} />
          Withdraw Funds
        </Button>
        <Button variant='outline' onClick={() => setReinvestOpen(true)} className='justify-start'>
          <Icon icon='solar:arrow-right-up-linear' fontSize={16} />
          Reinvest as Shares
        </Button>
      </div>

      <WithdrawDividendDialog
        memberId={memberId}
        balance={formatCurrency(balance)}
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        onSuccess={onSuccess}
      />
      <ReinvestDividendDialog
        memberId={memberId}
        balance={formatCurrency(balance)}
        open={reinvestOpen}
        onOpenChange={setReinvestOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default MemberDividendActions
