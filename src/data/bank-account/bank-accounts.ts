import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

export interface BankAccount {
    id: string
    name: string
    account?: string
    account_number: string
    financial_institution?: string
    routing_number?: string | null
    aba_number?: string | null
    swift_number?: string | null
    account_type?: string
    is_locked?: boolean
    is_hidden?: boolean
    currency?: string
    created_at?: string
    updated_at?: string
}

export interface BankAccountsResponse {
    count: number
    results: BankAccount[]
    error?: string
}

interface ListParams {
    limit?: number
    offset?: number
    search?: string
    financial_institution?: string
    account_type?: string
    entity_id?: string | null
    is_active?: boolean
}

export const getAllBankAccounts = async ({
    limit = 10,
    offset = 0,
    search = '',
    financial_institution = '',
    account_type = '',
    entity_id,
    is_active,
}: ListParams = {}): Promise<BankAccountsResponse> => {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    params.append('offset', String(offset))
    if (search) params.append('search', search)
    if (financial_institution) params.append('financial_institution', financial_institution)
    if (account_type) params.append('account_type', account_type)
    if (entity_id) params.append('entity_id', entity_id)
    if (is_active !== undefined) params.append('is_active', String(is_active))

    const response = await makeApiRequest(
        BASE_URLS.GPX_BASE_URL,
        `/core/bank-accounts/?${params.toString()}`,
        { method: 'GET', withToken: true, tag: 'BankAccounts' }
    )

    if (!response.ok) {
        const e = await response.json().catch(() => null)
        return { count: 0, results: [], error: e?.detail || 'Failed to fetch bank accounts' }
    }

    const data = await response.json()
    return {
        count: data.count ?? (Array.isArray(data) ? data.length : 0),
        results: Array.isArray(data) ? data : (data.results ?? []),
    }
}
