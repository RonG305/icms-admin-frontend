import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { AuthUser, OrgUserStats } from "@/types/auth"
import { buildQuery } from "@/utils/buildQuery"

type UserListParams = { page?: number; limit?: number; search?: string }

const getBaseUrl = () => BASE_URLS.AUTH_URL
const emptyList = (message: string) => ({ error: message, data: [] as AuthUser[], count: 0 })

export const getUsers = async (params: UserListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList("Auth service not configured")

    const query = buildQuery({ page: params.page, limit: params.limit, search: params.search })

    const response = await makeApiRequest(baseUrl, `/organization/users${query}`, {
        method: "GET",
        withToken: true,
        tag: "users-list",
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || "Failed to fetch users")
    }

    const data = await response.json()
    return {
        count: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (Array.isArray(data) ? data : data.data ?? []) as AuthUser[],
    }
}

export const getOrgUserStats = async (): Promise<OrgUserStats | null> => {
    const baseUrl = BASE_URLS.AUTH_URL
    if (!baseUrl) return null

    const response = await makeApiRequest(baseUrl, `/stats/organization`, {
        method: "GET",
        withToken: true,
        tag: "org-user-stats",
    })

    if (!response?.ok) return null

    const json = await response.json()
    return (json.data as OrgUserStats) ?? null
}

export const getOrganizationUsers = async (params: UserListParams = {}) => {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList("Auth service not configured")

    const query = buildQuery({ page: params.page, limit: params.limit, search: params.search })

    const response = await makeApiRequest(baseUrl, `/organization/users${query}`, {
        method: "GET",
        withToken: true,
        tag: "org-users-list",
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.message || "Failed to fetch organization users")
    }

    const data = await response.json()
    return {
        count: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (Array.isArray(data) ? data : data.data ?? []) as AuthUser[],
    }
}
