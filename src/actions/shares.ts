'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { revalidateTag } from 'next/cache'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

export const buyShares = async (data: {
    member_id: string
    number_of_shares: number
    payment_reference?: string
    notes?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/transactions/buy`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'buy-shares',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to buy shares' }
    }
    revalidateTag('share-accounts', 'default')
    revalidateTag('pending-share-transactions', 'default')
    return json
}

export const sellShares = async (data: {
    member_id: string
    number_of_shares: number
    notes?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/transactions/sell`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'sell-shares',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to sell shares' }
    }
    revalidateTag('share-accounts', 'default')
    revalidateTag('pending-share-transactions', 'default')
    return json
}

export const transferShares = async (data: {
    from_member_id: string
    to_member_id: string
    number_of_shares: number
    payment_reference?: string
    notes?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/transactions/transfer`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'transfer-shares',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to transfer shares' }
    }
    revalidateTag('share-accounts', 'default')
    revalidateTag('pending-share-transactions', 'default')
    return json
}

export const processShareDecision = async (
    id: string,
    data: { decision: 'approved' | 'rejected'; approved_by: string; notes?: string }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/transactions/${id}/decision`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'share-decision',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to process share decision' }
    }
    revalidateTag('share-accounts', 'default')
    revalidateTag('pending-share-transactions', 'default')
    return json
}

export const createShareConfig = async (data: {
    par_value: string | number
    max_shares_per_member?: number
    min_shares_required?: number
    allow_member_trading?: boolean
    approval_required?: boolean
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/config`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-share-config',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to create share config' }
    }
    revalidateTag(`share-config`, 'default')
    return json
}

export const updateShareConfig = async (
    data: {
        par_value?: string | number
        max_shares_per_member?: number
        min_shares_required?: number
        allow_member_trading?: boolean
        approval_required?: boolean
    }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/shares/organization/config/update`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-share-config',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update share config' }
    }
    revalidateTag(`share-config`, 'default')
    return json
}
