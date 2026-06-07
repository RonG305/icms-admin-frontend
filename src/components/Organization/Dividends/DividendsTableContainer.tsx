import { cookies } from 'next/headers'
import { getDividendDeclarations } from '@/data/organization/dividends'
import { decodeToken } from '@/lib/decode-token'
import { Card } from '@/components/ui/card'
import DividendDeclarationsList from './DividendDeclarationsList'

type SearchParams = Record<string, string | string[] | undefined>

const DividendsTableContainer = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams
  const financialYear =
    (Array.isArray(params?.financial_year)
      ? params.financial_year[0]
      : params?.financial_year) || ''
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const cookieStore = await cookies()
  const decoded = decodeToken(cookieStore.get('token')?.value ?? '')
  const orgId = decoded?.organization_id as string | undefined
  const declaredBy = decoded?.sub ?? decoded?.user_id ?? ''

  const result = await getDividendDeclarations({
    page,
    limit: pageSize,
    financial_year: financialYear || undefined,
    organization_id: orgId,
  })

  return (
    <Card>
      <DividendDeclarationsList
        data={result.data}
        total={result.total}
        organizationId={orgId ?? ''}
        declaredBy={declaredBy}
      />
    </Card>
  )
}

export default DividendsTableContainer
