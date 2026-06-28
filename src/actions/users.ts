'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { buildQuery } from '@/utils/buildQuery'

export interface AuthUser {
    id: string
    email: string
    first_name?: string
    last_name?: string
    account_type?: string
    status?: string
}

export const searchUsers = async (search: string): Promise<AuthUser[]> => {
    const baseUrl = BASE_URLS.AUTH_URL
    if (!baseUrl) return []

    const query = buildQuery({ search: search || undefined, limit: 30 })
    const response = await makeApiRequest(baseUrl, `/organization/users${query}`, {
        method: 'GET',
        withToken: true,
        tag: 'users-search',
    })

    if (!response?.ok) return []

    const data = await response.json().catch(() => null)
    console.log("Fteched users: ", data)
    const list = data?.data ?? (Array.isArray(data) ? data : [])
    return list as AuthUser[]
}
