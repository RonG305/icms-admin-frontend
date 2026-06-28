import { getMemberShareAccount, getMemberShareAccountSummary, getMemberShareStatement } from '@/data/organization/shares'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/common/BackButton'
import { formatCurrency, formatDateTime } from '@/lib/format'

type Props = { params: Promise<{ id: string }> }

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between gap-4 py-2.5 border-b last:border-0'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className='text-sm font-medium'>{value ?? '—'}</span>
    </div>
  )
}

const txTypeBadge = (type: string): 'success' | 'destructive' | 'info' | 'warning' | 'secondary' => {
  const map: Record<string, 'success' | 'info' | 'secondary' | 'warning' | 'destructive'> = {
    coop_purchase: 'success',
    member_purchase: 'info',
    transfer: 'secondary',
    coop_sale: 'warning',
    member_sale: 'destructive',
  }
  return map[type] ?? 'secondary'
}

export default async function MemberSharesPage({ params }: Props) {
  const { id: memberId } = await params

  const [account, summary, statementResult] = await Promise.all([
    getMemberShareAccount(memberId),
    getMemberShareAccountSummary(memberId),
    getMemberShareStatement(memberId, { page: 1, limit: 50 }),
  ])

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center gap-3'>
        <BackButton href='/organization/members' />
        <div>
          <h1 className='text-xl font-semibold'>Share Account</h1>
          <p className='text-sm text-muted-foreground font-mono'>Member ID: {memberId}</p>
        </div>
      </div>

      {!account ? (
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground text-sm'>
            No share account found for this member.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium text-muted-foreground uppercase tracking-widest'>
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row label='Account Number' value={<span className='font-mono'>{account.account_number}</span>} />
              <Row label='Total Shares' value={account.total_shares} />
              <Row label='Total Value' value={formatCurrency(account.total_value)} />
              {summary && (
                <>
                  <Row label='Total Bought' value={summary.total_bought} />
                  <Row label='Total Sold' value={summary.total_sold} />
                  <Row label='Transactions' value={summary.transaction_count} />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm font-medium text-muted-foreground uppercase tracking-widest'>
                Statement
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              {statementResult?.data?.length === 0 ? (
                <p className='text-sm text-muted-foreground text-center py-8'>No transactions yet.</p>
              ) : (
                <div className='divide-y'>
                  {statementResult?.data && statementResult?.data?.map((tx) => (
                    <div key={tx.id} className='flex items-center justify-between px-6 py-3'>
                      <div className='flex items-center gap-3'>
                        <Badge variant={txTypeBadge(tx.transaction_type)} className='capitalize text-xs'>
                          {tx.transaction_type.replace(/_/g, ' ')}
                        </Badge>
                        <span className='text-sm text-muted-foreground'>{tx.notes ?? '—'}</span>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-medium'>{tx.number_of_shares} shares</p>
                        <p className='text-sm text-muted-foreground'>{formatCurrency(tx.amount)}</p>
                        <p className='text-xs text-muted-foreground'>{formatDateTime(tx.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
