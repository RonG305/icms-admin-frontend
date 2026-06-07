'use server'

import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { CreateOrganizationData, MemberListParams, Organization, OrganizationListParams, OrganizationMember, UpdateOrganizationData } from "@/types/organization"
import { buildQuery } from "@/utils/buildQuery"

const SERVICE_ERROR = 'Organization service not configured'
const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL
const emptyList = (message: string) => ({ error: message, data: [] as Organization[], count: 0 })

export const createOrganization = async (orgData: CreateOrganizationData) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/`, {
        method: 'POST',
        withToken: true,
        body: orgData,
        tag: 'create-organization',
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || data?.message || 'Failed to create organization' }
    }

    return data as Organization
}

export const updateOrganization = async (id: string, orgData: UpdateOrganizationData) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${id}/`, {
        method: 'PATCH',
        withToken: true,
        body: orgData,
        tag: 'update-organization',
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || 'Failed to update organization' }
    }

    return data as Organization
}

export const deleteOrganization = async (id: string) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${id}/`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-organization',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.detail || 'Failed to delete organization' }
    }

    return { success: true }
}


export const removeMember = async (orgId: string, memberId: string) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${orgId}/members/${memberId}/`, {
        method: 'DELETE',
        withToken: true,
        tag: 'remove-member',
    })

    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.detail || 'Failed to remove member' }
    }

    return { success: true }
}


export const joinOrganization = async (orgId: string) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${orgId}/join/`, {
        method: 'POST',
        withToken: true,
        tag: 'join-organization',
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || data?.message || 'Failed to join organization' }
    }

    return data
}

export const acceptOrganizationInvite = async (token: string) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/invite/accept/`, {
        method: 'POST',
        withToken: true,
        body: { token },
        tag: 'accept-invite',
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || 'Invalid or expired invite' }
    }

    return data
}

export const inviteMember = async (orgId: string, payload: { email: string; role?: string }) => {
    if (!getBaseUrl()) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(getBaseUrl(), `/organizations/${orgId}/invite/`, {
        method: 'POST',
        withToken: true,
        body: payload,
        tag: 'invite-member',
    })

    const data = await response?.json().catch(() => null)

    if (!response?.ok) {
        return { error: data?.detail || 'Failed to send invite' }
    }

    return data
}
