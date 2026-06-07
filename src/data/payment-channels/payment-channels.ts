import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject, buildQuery } from '@/utils/apiErrors'

const SERVICE_ERROR = 'GPX service not configured'
const getBaseUrl = () => BASE_URLS.GPX_BASE_URL
const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

export type PaymentChannelsListParams = {
    limit?: number
    offset?: number
    search?: string
    is_active?: boolean
    entity_id?:string
}

export const getAllPaymentChannels = async (params: PaymentChannelsListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = buildQuery(params as Record<string, unknown>)
    return apiCallList(baseUrl, `/core/channels/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'PaymentChannelsList',
        label: 'payment-channels:list',
    })
}

export const getPaymentChannel = async (channelId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/core/channels/${channelId}/`, {
        method: 'GET',
        withToken: true,
        label: 'payment-channels:detail',
    })
}
