'use server'

import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

interface CreatePermissionData {
    name: string
    description: string
    module: string
    action: "create" | "read" | "update" | "delete"
}

export const createPermission = async (data: CreatePermissionData) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/permission/`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'create-permission',
    })
    const json = await response?.json()
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to create permission' }
    }
    return json
}

export const updatePermission = async (id: string, data: Partial<CreatePermissionData>) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/permission/${id}/`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'update-permission',
    })
    const json = await response?.json()
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to update permission' }
    }
    return json
}

export const deletePermission = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/role-permission/permission/${id}/`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-permission',
    })
    if (!response?.ok) {
        const json = await response?.json().catch(() => null)
        return { error: json?.message || json?.error || 'Failed to delete permission' }
    }
    return { success: true }
}
