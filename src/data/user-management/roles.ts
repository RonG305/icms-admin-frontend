import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Auth service not configured'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL;

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type RoleListParams = { search?: string; limit?: number; offset?: number }

type ManagePermissionsBody = { action: string; permissions: string[] }

export const getRoles = async (entityId: string, params: RoleListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
    return apiCallList(baseUrl, `/entities/${entityId}/roles/?${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'roles',
        label: 'roles:list',
    })
}

export const getRolePermissions = async (entityId: string, roleId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/roles/${roleId}/permissions/`, {
        method: 'GET',
        withToken: true,
        label: 'roles:permissions',
    })
}

export const manageRolePermissions = async (entityId: string, roleId: string, body: ManagePermissionsBody) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    return apiCallObject(baseUrl, `/entities/${entityId}/roles/${roleId}/manage-permissions/`, {
        method: 'POST',
        body,
        withToken: true,
        label: 'roles:manage-permissions',
    })
}

export const getRoleSites = async (entityId: string, roleId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/roles/${roleId}/sites/`, {
        method: 'GET',
        withToken: true,
        label: 'roles:sites',
    })
}

export const getRoleMemberships = async (entityId: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    return apiCallList(baseUrl, `/entities/${entityId}/profile-role-membership/`, {
        method: 'GET',
        withToken: true,
        tag: 'role-memberships',
        label: 'roles:memberships',
    })
}
