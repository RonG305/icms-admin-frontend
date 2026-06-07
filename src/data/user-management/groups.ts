import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Auth service not configured'

const getBaseUrl = () => BASE_URLS.AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type GroupListParams = { search?: string; limit?: number; offset?: number }

export const getGroups = async (entityId: string, params: GroupListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
    return apiCallList(baseUrl, `/entities/${entityId}/groups/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'groups',
        label: 'groups:list',
    })
}

export const getGroup = async (entityId: string, groupId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/entities/${entityId}/groups/${groupId}`, {
        method: 'GET',
        withToken: true,
        label: 'groups:detail',
    })
}

export const getGroupPermissions = async (entityId: string, groupId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/groups/${groupId}/permissions/`, {
        method: 'GET',
        withToken: true,
        label: 'groups:permissions',
    })
}

export const getGroupMemberships = async (entityId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/group-profile-membership/`, {
        method: 'GET',
        withToken: true,
        tag: 'group-memberships',
        label: 'groups:memberships',
    })
}

export const getGroupMembership = async (entityId: string, membershipId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/entities/${entityId}/group-profile-membership/${membershipId}`, {
        method: 'GET',
        withToken: true,
        label: 'groups:membership',
    })
}
