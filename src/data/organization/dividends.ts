import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { DividendDeclaration, DividendAccount, DividendAccountSummary, DividendTransaction, DeclarationSummary } from '@/types/dividends'
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

export const getDividendDeclaration = async (id: string): Promise<DividendDeclaration | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations/${id}`, {
        method: 'GET',
        withToken: true,
        tag: `dividend-declaration-${id}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as DividendDeclaration
}

export const getDeclarationSummary = async (id: string): Promise<DeclarationSummary | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations/${id}/summary`, {
        method: 'GET',
        withToken: true,
        tag: `dividend-declaration-summary-${id}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as DeclarationSummary
}

export const getMemberDividendAccount = async (memberId: string): Promise<DividendAccount | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/accounts/${memberId}`, {
        method: 'GET',
        withToken: true,
        tag: `dividend-account-${memberId}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as DividendAccount
}

export const getMemberDividendSummary = async (memberId: string): Promise<DividendAccountSummary | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/accounts/${memberId}/summary`, {
        method: 'GET',
        withToken: true,
        tag: `dividend-account-summary-${memberId}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as DividendAccountSummary
}

type StatementParams = { page?: number; limit?: number }

export const getMemberDividendStatement = async (
    memberId: string,
    params: StatementParams = {}
) => {
    const query = buildQuery({ page: params.page, limit: params.limit })
    const response = await makeApiRequest(getBaseUrl(), `/dividends/accounts/${memberId}/statement${query}`, {
        method: 'GET',
        withToken: true,
        tag: `dividend-statement-${memberId}`,
    })
    if (!response?.ok) {
        const d = await response?.json().catch(() => null)
        return { error: d?.message || 'Failed to fetch statement', data: [] as DividendTransaction[], total: 0 }
    }
    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as DividendTransaction[],
    }
}
