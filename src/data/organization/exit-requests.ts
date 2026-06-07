import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { ExitRequest } from '@/types/member'
import { buildQuery } from '@/utils/buildQuery'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL
const emptyList = (message: string) => ({ error: message, data: [] as ExitRequest[], total: 0 })

type ExitRequestParams = {
    page?: number
    limit?: number
    status?: string
    search?: string
    member_id?: string
}

export const getExitRequests = async (params: ExitRequestParams = {}) => {
    if (!getBaseUrl()) return emptyList('Organization service not configured')

    const query = buildQuery({
        page: params.page,
        limit: params.limit,
        status: params.status,
        search: params.search,
        member_id: params.member_id,
    })

    const response = await makeApiRequest(getBaseUrl(), `/members/exit-requests${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'exit-requests',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || 'Failed to fetch exit requests')
    }

    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as ExitRequest[],
    }
}
