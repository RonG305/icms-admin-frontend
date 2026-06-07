import { cookies } from 'next/headers'
import { getExitRequests } from '@/data/organization/exit-requests'
import { decodeToken } from '@/lib/decode-token'
import { Card } from '@/components/ui/card'
import ExitRequestsList from './ExitRequestsList'

type SearchParams = Record<string, string | string[] | undefined>

const ExitRequestsTableContainer = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ''
  const status = (Array.isArray(params?.status) ? params.status[0] : params?.status) || ''
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const cookieStore = await cookies()
  const decoded = decodeToken(cookieStore.get('token')?.value ?? '')
  const reviewedBy = decoded?.sub ?? decoded?.user_id ?? ''

  const result = await getExitRequests({
    page,
    limit: pageSize,
    search: search || undefined,
    status: status || undefined,
  })

  return (
    <Card>
      <ExitRequestsList
        data={result.data}
        total={result.total}
        reviewedBy={reviewedBy}
      />
    </Card>
  )
}

export default ExitRequestsTableContainer
