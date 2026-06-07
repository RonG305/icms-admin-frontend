import { cookies } from 'next/headers'
import { getOrganizationMembers } from '@/data/organization/organization'
import MemberStats from './MemberStats'
import OrganizationMembersTable from './OrganizationMembersTable'

type SearchParams = Record<string, string | string[] | undefined>

const Members = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const cookieStore = await cookies()
  const orgId = cookieStore.get('organization_id')?.value ?? ''

  const result = await getOrganizationMembers(orgId, { limit: 100 })
  const stats = {
    total_members: result.total,
    total_active_members: result.data.filter((m) => m.status === 'active').length,
    total_sacco_members: result.data.filter((m) => m.category === 'member_farmer').length,
    total_shares: result.data.reduce((sum, m) => sum + (m.share_account?.total_shares ?? 0), 0),
  }

  return (
    <div className='flex flex-col gap-6'>
      <MemberStats stats={stats} />
      <OrganizationMembersTable searchParams={searchParams} />
    </div>
  )
}

export default Members
