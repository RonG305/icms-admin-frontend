
import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Entity service not configured'
const UNREACHABLE_ERROR = 'Unable to reach entity service'

const getBaseUrl = () => BASE_URLS.GPX_BASE_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type TransactionListParams = { limit?: number; offset?: number; search?: string; status?: string; is_active?: boolean, parent?: string, entity_id?: string }


export const getAllTransactions = async ({ limit, offset, search, status, entity_id }: TransactionListParams) => {
    try {
        const baseUrl = getBaseUrl()
        if (!baseUrl) return emptyList(SERVICE_ERROR)

        const query = new URLSearchParams()
        Object.entries({ limit, offset, search, entity_id }).forEach(
            ([k, v]) => v !== undefined && v !== null && query.set(k, String(v))
        )

        const queryString = query.toString()
        const entityUrl = `/transactions/${queryString ? '?' + queryString : ''}`

        const response = await makeApiRequest(baseUrl, entityUrl, {
            method: 'GET',
            withToken: true,
            tag: 'transaction-list',
            cache: 'no-store'
        })

        const data = await response.json()
        if (!response.ok) return emptyList(data?.detail || data?.error || 'Failed to fetch transactions')
        return { count: data.count, results: data.results }
    } catch {
        return emptyList(UNREACHABLE_ERROR)
    }
}

export const getTransactionById = async (transactionId: string | number) => {
    try {
        const baseUrl = getBaseUrl()
        if (!baseUrl) return { error: SERVICE_ERROR }

        const response = await makeApiRequest(baseUrl, `/transactions/${transactionId}`, {
            method: 'GET',
            withToken: true,
            tag: 'get-transaction-detail',
            cache: 'no-store'
        })

        const data = await response.json()
        if (!response.ok) return { error: data?.detail || data?.error || 'Failed to fetch transaction' }
        return data
    } catch (error) {
        return { error: UNREACHABLE_ERROR }
    }
}