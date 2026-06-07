import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

export interface PaymentChannel {
    id: string
    number: string
    name: string
    owner?: string
    merchant?: string
    merchant_name?: string
    account_number?: string
    payment_type: 'MOBILE' | 'CARD' | 'BANK' | 'WALLET'
    provider?: string
    provider_name?: string
    is_active: boolean
    confirmation_url?: string
    information_url?: string
    validation_url?: string
    credentials?: Record<string, any>
    created_at?: string
}

export interface CreatePaymentChannelInput {
    name: string
    owner: string
    merchant: string
    account_number?: string
    payment_type: 'MOBILE' | 'CARD' | 'BANK' | 'WALLET'
    provider: string
    is_active: boolean
    confirmation_url?: string
    information_url?: string
    validation_url?: string
    register_callbacks?: boolean
    credentials?: Record<string, any>
}

export const getPaymentChannels = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string } = {}) => {
    const params = new URLSearchParams()
    if (limit) params.append('limit', String(limit))
    if (offset) params.append('offset', String(offset))
    if (search) params.append('search', search)

    const url = `/merchants/channels/?${params.toString()}`

    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, url, {
        method: 'GET',
        withToken: true,
        tag: 'PaymentChannelsList',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch payment channels'
        }
    }

    const data = await response.json()
    return {
        count: data.count || data.length || 0,
        results: Array.isArray(data) ? data : data.results || []
    }
}


export const getPaymentChannel = async (channelId: string) => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/merchants/channels/${channelId}/`, {
        method: 'GET',
        withToken: true,
        tag: 'PaymentChannelDetail',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch payment channel'
        }
    }

    const data: PaymentChannel = await response.json()
    return data
}

export const createPaymentChannel = async (input: CreatePaymentChannelInput) => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/merchants/channels/`, {
        method: 'POST',
        withToken: true,
        body: input,
        tag: 'CreatePaymentChannel',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to create payment channel'
        }
    }

    const data: PaymentChannel = await response.json()
    return data
}

export const updatePaymentChannel = async (channelId: string, input: Partial<CreatePaymentChannelInput>) => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/merchants/channels/${channelId}/`, {
        method: 'PATCH',
        withToken: true,
        body: input,
        tag: 'UpdatePaymentChannel',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to update payment channel'
        }
    }

    const data: PaymentChannel = await response.json()
    return data
}

export const deletePaymentChannel = async (channelId: string) => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/merchants/channels/${channelId}/`, {
        method: 'DELETE',
        withToken: true,
        tag: 'DeletePaymentChannel',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to delete payment channel'
        }
    }

    return { success: true }
}

// Test payment channel credentials
export const testPaymentChannel = async (channelId: string) => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/merchants/channels/${channelId}/test/`, {
        method: 'POST',
        withToken: true,
        tag: 'TestPaymentChannel',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to test payment channel'
        }
    }

    const data = await response.json()
    return data
}
