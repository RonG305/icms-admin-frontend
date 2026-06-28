import { cookies } from 'next/headers'
import { getShareAccounts, getPendingShareTransactions, getShareConfig } from '@/data/organization/shares'
import { decodeToken } from '@/lib/decode-token'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ShareAccountsList from './ShareAccountsList'
import PendingTransactionsList from './PendingTransactionsList'
import { ShareConfigCard } from './ShareConfigCard'

type SearchParams = Record<string, string | string[] | undefined>

const SharesTableContainer = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ''
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const cookieStore = await cookies()
  const decoded = decodeToken(cookieStore.get('token')?.value ?? '')
  const orgId = decoded?.organization_id as string | undefined
  const approvedBy = decoded?.sub ?? decoded?.user_id ?? ''

  const [accountsResult, pendingResult, shareConfig] = await Promise.all([
    getShareAccounts({
      page,
      limit: pageSize,
      organization_id: orgId,
      search: search || undefined,
    }),
    getPendingShareTransactions(orgId ?? ''),
    getShareConfig(),
  ])

  console.log("Share config : ", shareConfig)

  return (
    <div className='flex flex-col gap-6'>
      <ShareConfigCard config={shareConfig} organizationId={orgId ?? ''} />

      <Tabs defaultValue='accounts' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='accounts'>Share Accounts</TabsTrigger>
          <TabsTrigger value='pending'>
            Pending Transactions
            {pendingResult.data.length > 0 && (
              <span className='ml-2 rounded-full bg-warning/10 text-warning-foreground text-xs px-1.5 py-0.5 font-medium'>
                {pendingResult.data.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='accounts'>
          <Card>
            <ShareAccountsList data={accountsResult.data} total={accountsResult.total} />
          </Card>
        </TabsContent>

        <TabsContent value='pending'>
          <Card>
            <PendingTransactionsList data={pendingResult.data} approvedBy={approvedBy} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SharesTableContainer
