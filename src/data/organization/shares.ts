import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { ShareAccount, ShareTransaction, ShareConfig, ShareAccountSummary, ShareStatement } from '@/types/shares'
import { buildQuery } from '@/utils/buildQuery'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL
const emptyAccountList = (message: string) => ({ error: message, data: [] as ShareAccount[], total: 0 })
const emptyTransactionList = (message: string) => ({ error: message, data: [] as ShareTransaction[], total: 0 })

type ShareAccountParams = {
    page?: number
    limit?: number
    organization_id?: string
    search?: string
}

export const getShareAccounts = async (params: ShareAccountParams = {}) => {
    if (!getBaseUrl()) return emptyAccountList('Organization service not configured')

    const query = buildQuery({
        page: params.page,
        limit: params.limit,
        organization_id: params.organization_id,
        search: params.search,
    })

    const response = await makeApiRequest(getBaseUrl(), `/shares/accounts${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'share-accounts',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyAccountList(data?.message || 'Failed to fetch share accounts')
    }

    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as ShareAccount[],
    }
}

export const getMemberShareAccount = async (memberId: string): Promise<ShareAccount | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/accounts/${memberId}`, {
        method: 'GET',
        withToken: true,
        tag: `share-account-${memberId}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as ShareAccount
}

export const getMemberShareAccountSummary = async (memberId: string): Promise<ShareAccountSummary | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/accounts/${memberId}/summary`, {
        method: 'GET',
        withToken: true,
        tag: `share-account-summary-${memberId}`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as ShareAccountSummary
}

export const getMemberShareStatement = async (memberId: string, params: { page?: number; limit?: number } = {}) => {
    const query = buildQuery({ page: params.page, limit: params.limit })
    const response = await makeApiRequest(getBaseUrl(), `/shares/accounts/${memberId}/statement${query}`, {
        method: 'GET',
        withToken: true,
        tag: `share-statement-${memberId}`,
    })
    if (!response?.ok) {
        const d = await response?.json().catch(() => null)
        return { error: d?.message || 'Failed to fetch share statement', data: [] as ShareStatement[], total: 0 }
    }
    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as ShareStatement[],
    }
}

export const getShareConfig = async (): Promise<ShareConfig | null> => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/organization/config/`, {
        method: 'GET',
        withToken: true,
        tag: `share-config`,
    })
    if (!response?.ok) return null
    const data = await response.json()
    return (data.data ?? data) as ShareConfig
}

export const getPendingShareTransactions = async (orgId: string) => {
    if (!getBaseUrl()) return emptyTransactionList('Organization service not configured')

    const response = await makeApiRequest(
        getBaseUrl(),
        `/shares/transactions/pending?organization_id=${orgId}`,
        {
            method: 'GET',
            withToken: true,
            tag: `pending-share-transactions-${orgId}`,
        }
    )

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyTransactionList(data?.message || 'Failed to fetch pending transactions')
    }

    const data = await response.json()
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as ShareTransaction[],
    }
}
