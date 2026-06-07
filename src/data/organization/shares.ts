import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { ShareAccount, ShareTransaction } from '@/types/shares'
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
