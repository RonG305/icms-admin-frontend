'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { revalidateTag } from 'next/cache'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

// Economic Activities

export const createEconomicActivity = async (data: { activity_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/economic-activities`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-economic-activity',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to create economic activity' }
    revalidateTag('economic-activities', 'default')
    return json
}

export const updateEconomicActivity = async (id: string, data: { activity_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/economic-activities/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-economic-activity',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to update economic activity' }
    revalidateTag('economic-activities', 'default')
    return json
}

export const deleteEconomicActivity = async (id: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/economic-activities/${id}`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-economic-activity',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete economic activity' }
    }
    revalidateTag('economic-activities', 'default')
    return { success: true }
}

// Typologies

export const createTypology = async (data: { typology_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/typologies`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-typology',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to create typology' }
    revalidateTag('typologies', 'default')
    return json
}

export const updateTypology = async (id: string, data: { typology_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/typologies/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-typology',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to update typology' }
    revalidateTag('typologies', 'default')
    return json
}

export const deleteTypology = async (id: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/typologies/${id}`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-typology',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete typology' }
    }
    revalidateTag('typologies', 'default')
    return { success: true }
}

// Structures

export const createStructure = async (data: { structure_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/structures`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-structure',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to create structure' }
    revalidateTag('structures', 'default')
    return json
}

export const updateStructure = async (id: string, data: { structure_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/structures/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-structure',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to update structure' }
    revalidateTag('structures', 'default')
    return json
}

export const deleteStructure = async (id: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/structures/${id}`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-structure',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete structure' }
    }
    revalidateTag('structures', 'default')
    return { success: true }
}

// Membership Types

export const createMembershipType = async (data: { type_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/membership-types`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-membership-type',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to create membership type' }
    revalidateTag('membership-types', 'default')
    return json
}

export const updateMembershipType = async (id: string, data: { type_name: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/membership-types/${id}`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-membership-type',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) return { error: json?.message || json?.error || 'Failed to update membership type' }
    revalidateTag('membership-types', 'default')
    return json
}

export const deleteMembershipType = async (id: string) => {
    const response = await makeApiRequest(getBaseUrl(), `/membership-types/${id}`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-membership-type',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete membership type' }
    }
    revalidateTag('membership-types', 'default')
    return { success: true }
}
