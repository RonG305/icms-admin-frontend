import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { DividendDeclaration } from '@/types/dividends'
import { buildQuery } from '@/utils/buildQuery'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL
const emptyList = (message: string) => ({ error: message, data: [] as DividendDeclaration[], total: 0 })

type DividendParams = {
    page?: number
    limit?: number
    financial_year?: string
    organization_id?: string
}

export const getDividendDeclarations = async (params: DividendParams = {}) => {
    if (!getBaseUrl()) return emptyList('Organization service not configured')

    const query = buildQuery({
        page: params.page,
        limit: params.limit,
        financial_year: params.financial_year,
        organization_id: params.organization_id,
    })

    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'dividend-declarations',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || 'Failed to fetch dividend declarations')
    }

    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as DividendDeclaration[],
    }
}
