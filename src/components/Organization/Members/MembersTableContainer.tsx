import { cookies } from 'next/headers'
import { getMembers } from '@/data/organization/members'
import { decodeToken } from '@/lib/decode-token'
import { Card } from '@/components/ui/card'
import MembersList from './MembersList'

type SearchParams = Record<string, string | string[] | undefined>

const MembersTableContainer = async ({
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

  const result = await getMembers(orgId, { page, limit: pageSize, search })

  return (
    <Card>
      <MembersList
        data={result.data}
        total={result.total}
        organizationId={orgId ?? ''}
      />
    </Card>
  )
}

export default MembersTableContainer
