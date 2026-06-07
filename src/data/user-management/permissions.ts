import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { Permission } from "@/types/auth"
import { buildQuery } from "@/utils/buildQuery"

type PermissionListParams = { page?: number; limit?: number; search?: string }

const getBaseUrl = () => BASE_URLS.AUTH_URL
const emptyList = (message: string) => ({ error: message, data: [] as Permission[], count: 0 })

export const getPermissions = async (params: PermissionListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList("Auth service not configured")

    const query = buildQuery({ page: params.page, limit: params.limit, search: params.search })

    const response = await makeApiRequest(baseUrl, `/role-permission/permissions${query}`, {
        method: "GET",
        withToken: true,
        tag: "permissions-list",
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || "Failed to fetch permissions")
    }

    const data = await response.json()
    return {
        count: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (Array.isArray(data) ? data : data.data ?? []) as Permission[],
    }
}

export const getPermission = async (id: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: "Auth service not configured" }

    const response = await makeApiRequest(baseUrl, `/role-permission/permission/${id}`, {
        method: "GET",
        withToken: true,
        tag: `permission-${id}`,
    })

    const data = await response?.json().catch(() => null)
    if (!response?.ok) return { error: data?.message || "Failed to fetch permission" }
    return data as Permission
}
