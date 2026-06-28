
import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { MemberListParams, Organization, OrganizationListParams, OrganizationMember } from "@/types/organization"
import { buildQuery } from "@/utils/buildQuery"

const SERVICE_ERROR = 'Auth service not configured'
const getBaseUrl = () => BASE_URLS.AUTH_URL
const emptyList = (message: string) => ({ error: message, data: [] as Organization[], count: 0 })
const emptyMemberList = (message: string) => ({ error: message, data: [] as OrganizationMember[], total: 0 })



export const getOrganizations = async (params?: OrganizationListParams) => {
    if (!getBaseUrl()) return emptyList(SERVICE_ERROR)

    const query = buildQuery({
        limit: params?.limit,
        offset: params?.offset,
        search: params?.search,
        is_active: params?.is_active,
    })

    const response = await makeApiRequest(getBaseUrl(), `/organization/users/${query}`, {
        method: 'GET',
        withToken: false,
        tag: 'organizations-list',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return emptyList(data?.detail || 'Failed to fetch organizations')
    }

    const data = await response.json()
    return {
        count: data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (Array.isArray(data) ? data : data.data ?? []) as Organization[],
    }
}

export const getOrganization = async (id: string) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${id}/`, {
        method: 'GET',
        withToken: true,
        tag: `organization-${id}`,
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || 'Failed to fetch organization' }
    }

    return data as Organization
}


export const getOrganizationMembers = async (orgId: string, params?: MemberListParams) => {
    if (!getBaseUrl()) return emptyMemberList(SERVICE_ERROR)

    const query = buildQuery({
        limit: params?.limit,
        offset: params?.offset,
        search: params?.search,
        role: params?.role,
    })

    const response = await makeApiRequest(getBaseUrl(), `/organization/members/${orgId}/${query}`, {
        method: 'GET',
        withToken: true,
        tag: `organization-${orgId}-members`,
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.detail || data?.message || 'Failed to fetch members', data: [] as OrganizationMember[], total: 0 }
    }

    const data = await response.json()
    console.log("Fetch organization members response: ", data)
    return {
        total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
        data: (data.data ?? (Array.isArray(data) ? data : [])) as OrganizationMember[],
    }
}



