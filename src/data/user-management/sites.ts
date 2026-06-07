import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject, buildQuery } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Auth service not configured'

const getBaseUrl = () => BASE_URLS.AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type SiteListParams = { search?: string; limit?: number; offset?: number }

export const getSites = async (entityId: string, params: SiteListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = buildQuery(params)
    return apiCallList(baseUrl, `/entities/${entityId}/sites/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'sites',
        label: 'sites:list',
    })
}

export const getSite = async (entityId: string, siteId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/entities/${entityId}/sites/${siteId}/`, {
        method: 'GET',
        withToken: true,
        label: 'sites:detail',
    })
}
