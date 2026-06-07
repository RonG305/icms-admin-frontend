'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { revalidateTag } from 'next/cache'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

export const createDividendDeclaration = async (data: {
    financial_year: string
    total_pool_amount: string | number
    payment_deadline?: string
    notes?: string
    organization_id: string
    declared_by?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-dividend-declaration',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to create dividend declaration' }
    }
    revalidateTag('dividend-declarations')
    return json
}

export const updateDividendDeclaration = async (
    id: string,
    data: {
        total_pool_amount?: string | number
        payment_deadline?: string
        notes?: string
    }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-dividend-declaration',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update dividend declaration' }
    }
    revalidateTag('dividend-declarations')
    return json
}

export const distributeDividend = async (
    id: string,
    data?: { per_share_amount_override?: string | number }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/dividends/declarations/${id}/distribute`, {
        method: 'POST',
        withToken: true,
        body: data ?? {},
        tag: 'distribute-dividend',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to distribute dividend' }
    }
    revalidateTag('dividend-declarations')
    return json
}
