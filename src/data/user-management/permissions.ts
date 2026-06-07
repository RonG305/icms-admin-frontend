import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Auth service not configured'

const getBaseUrl = () => BASE_URLS.AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type PermissionListParams = { search?: string; limit?: number; offset?: number }

export const getPermissions = async (params: PermissionListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
    return apiCallList(baseUrl, `/permissions/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'permissions',
        label: 'permissions:list',
    })
}

export const getPermission = async (permissionId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/api/v1/permissions/${permissionId}`, {
        method: 'GET',
        withToken: true,
        label: 'permissions:detail',
    })
}
