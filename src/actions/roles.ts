'use server'

import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

interface CreateRoleData {
    name: string
    description: string
    status: "active" | "inactive"
    permissions: string[]
}

export const createRole = async (data: CreateRoleData) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/role/`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-role',
    })
    const json = await response?.json()
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to create role' }
    }
    return json
}

export const updateRole = async (id: string, data: Partial<CreateRoleData>) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/role/${id}/`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-role',
    })
    const json = await response?.json()
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update role' }
    }
    return json
}

export const activateRole = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/role/${id}/activate`, {
        method: 'PATCH',
        withToken: true,
        body: { status: 'active' },
        tag: 'activate-role',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to activate role' }
    }
    return json
}

export const deactivateRole = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/role/${id}/deactivate`, {
        method: 'PATCH',
        withToken: true,
        body: { status: 'inactive' },
        tag: 'deactivate-role',
    })
    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to deactivate role' }
    }
    return json
}

export const deleteRole = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/role/${id}/delete`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-role',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete role' }
    }
    return { success: true }
}
