import { cookies } from 'next/headers'
import { getOrganizationMembers } from '@/data/organization/organization'
import OrganizationMemebersList from './OrganizationMemebersList'
import { decodeToken } from '@/lib/decode-token'
import { Card } from '@/components/ui/card'
type SearchParams = Record<string, string | string[] | undefined>

const OrganizationMembersTable = async ({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ''
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10
  const offset = (page - 1) * pageSize

  const cookieStore = await cookies()
  const orgId = cookieStore.get('organization_id')?.value ?? ''
  const decodedToken = decodeToken(cookieStore.get('token')?.value ?? '')
  const organizationId = decodedToken?.organization_id
  console.log("Organization ID from cookies: ", decodedToken?.organization_id)
  console.log("Decoded Token: ", decodedToken)

  const members = await getOrganizationMembers(organizationId, {
    limit: pageSize,
    offset,
    search,
  })

  return (
    <Card>
      <OrganizationMemebersList data={members.data} total={members.total} />
    </Card>
  )
}

export default OrganizationMembersTable
