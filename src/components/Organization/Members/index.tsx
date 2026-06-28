import { cookies } from 'next/headers'
import { getMembers } from '@/data/organization/members'
import { decodeToken } from '@/lib/decode-token'
import MemberStats from './MemberStats'
import MembersTableContainer from './MembersTableContainer'

type SearchParams = Record<string, string | string[] | undefined>

const Members = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const cookieStore = await cookies()
  const decoded = decodeToken(cookieStore.get('token')?.value ?? '')
  const orgId = decoded?.organization_id as string | undefined

  const result = await getMembers(orgId, { limit: 100 })
  const stats = {
    total_members: result.total,
    total_active_members: result.data.filter((m) => m.membership_status === 'active').length,
    total_sacco_members: result.data.filter((m) => m.category === 'member_farmer').length,
    total_shares: result.data.reduce((sum, m) => sum + (m.share_account?.total_shares ?? 0), 0),
  }

  return (
    <div className='flex flex-col gap-6'>
      <MemberStats stats={stats} />
      <MembersTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Members
