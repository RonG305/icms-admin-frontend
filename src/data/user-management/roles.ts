import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { Role } from "@/types/auth"
import { buildQuery } from "@/utils/buildQuery"

type RoleListParams = { page?: number; limit?: number; search?: string }

const getBaseUrl = () => BASE_URLS.AUTH_URL
const emptyList = (message: string) => ({ error: message, data: [] as Role[], count: 0 })

export const getRoles = async (params: RoleListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList("Auth service not configured")

    const query = buildQuery({ page: params.page, limit: params.limit, search: params.search })

    const response = await makeApiRequest(baseUrl, `/role-permission/roles${query}`, {
        method: "GET",
        withToken: true,
        tag: "roles-list",
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || "Failed to fetch roles")
    }

    const data = await response.json()
    return {
        count: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (Array.isArray(data) ? data : data.data ?? []) as Role[],
    }
}

export const getRole = async (id: string) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: "Auth service not configured" }

    const response = await makeApiRequest(baseUrl, `/role-permission/role/${id}`, {
        method: "GET",
        withToken: true,
        tag: `role-${id}`,
    })

    const data = await response?.json().catch(() => null)
    if (!response?.ok) return { error: data?.message || "Failed to fetch role" }
    return data as Role
}
