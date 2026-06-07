import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Auth service not configured'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type ProfileListParams = { search?: string; limit?: number; offset?: number }

export const getProfiles = async (entityId: string, params: ProfileListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
    return apiCallList(baseUrl, `/entities/${entityId}/entity-profiles/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'profiles',
        label: 'profiles:list',
    })
}

export const getProfileSites = async (entityId: string, profileId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/profiles/${profileId}/sites`, {
        method: 'GET',
        withToken: true,
        label: 'profiles:sites',
    })
}

export const getProfilePermissions = async (entityId: string, profileId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/profiles/${profileId}/permissions/`, {
        method: 'GET',
        withToken: true,
        label: 'profiles:permissions',
    })
}

export const getProfileRoles = async (entityId: string, profileId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/profiles/${profileId}/roles/`, {
        method: 'GET',
        withToken: true,
        label: 'profiles:roles',
    })
}

export const getProfileGroups = async (entityId: string, profileId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/profiles/${profileId}/groups/`, {
        method: 'GET',
        withToken: true,
        label: 'profiles:groups',
    })
}

export const getPermissionMemberships = async (entityId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/api/v1/entities/${entityId}/profile-permission-membership/`, {
        method: 'GET',
        withToken: true,
        tag: 'permission-memberships',
        label: 'profiles:permission-memberships',
    })
}

export const getPermissionMembership = async (entityId: string, membershipId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/api/v1/entities/${entityId}/profile-permission-membership/${membershipId}`, {
        method: 'GET',
        withToken: true,
        label: 'profiles:permission-membership',
    })
}
