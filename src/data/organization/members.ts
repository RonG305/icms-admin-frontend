import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { Member } from '@/types/member'
import { buildQuery } from '@/utils/buildQuery'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL
const emptyList = (message: string) => ({ error: message, data: [] as Member[], total: 0 })

type MemberListParams = {
    page?: number
    limit?: number
    search?: string
}

export const getMemberById = async (id: string) => {
    if (!getBaseUrl()) return null

    const response = await makeApiRequest(getBaseUrl(), `/members/${id}`, {
        method: 'GET',
        withToken: true,
        tag: `member-${id}`,
    })

    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as Member
}

export const getMembers = async (
    orgId: string | undefined,
    params: MemberListParams = {}
) => {
    if (!getBaseUrl()) return emptyList('Organization service not configured')
    if (!orgId) return emptyList('Organization ID not found')

    const query = buildQuery({
        page: params.page,
        limit: params.limit,
        search: params.search,
    })

    const response = await makeApiRequest(getBaseUrl(), `/members/${orgId}${query}`, {
        method: 'GET',
        withToken: true,
        tag: `members-${orgId}`,
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || 'Failed to fetch members')
    }

    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as Member[],
    }
}
