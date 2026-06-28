'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { revalidateTag } from 'next/cache'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

export const createMember = async (data: {
    organization_id: string
    user_id: string
    category?: string
    id_number?: string
    kra_pin?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/members`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-member',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to create member' }
    }
    revalidateTag('members', 'default')
    return json
}

export const updateMember = async (
    id: string,
    data: { category?: string; id_number?: string; kra_pin?: string }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-member',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update member' }
    }
    revalidateTag('members', 'default')
    return json
}

export const updateMemberStatus = async (id: string, membership_status: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}/status`, {
        method: 'PATCH',
        withToken: true,
        body: { membership_status },
        tag: 'update-member-status',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update member status' }
    }
    revalidateTag('members', 'default')
    return json
}

export const approveMembership = async (id: string, notes?: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}/approve`, {
        method: 'PATCH',
        withToken: true,
        body: { notes },
        tag: 'approve-membership',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to approve membership' }
    }
    revalidateTag('members', 'default')
    return json
}

export const rejectMembership = async (id: string, notes?: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}/reject`, {
        method: 'PATCH',
        withToken: true,
        body: { notes },
        tag: 'reject-membership',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to reject membership' }
    }
    revalidateTag('members', 'default')
    return json
}

export const cancelMembership = async (id: string, notes?: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}/cancel`, {
        method: 'PATCH',
        withToken: true,
        body: { notes },
        tag: 'cancel-membership',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to cancel membership' }
    }
    revalidateTag('members', 'default')
    return json
}

export const deleteMember = async (id: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/${id}`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-member',
    })

    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete member' }
    }
    revalidateTag('members', 'default')
    return { success: true }
}
