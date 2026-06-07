import { BASE_URLS } from '@/api/base'
import { apiCall, apiCallList, apiCallObject } from '@/utils/apiErrors'
import { User } from '@/types/user'

const SERVICE_ERROR = 'Entity service not configured'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type UserListParams = { limit?: number; offset?: number; search?: string; is_active?: boolean; parent?: string; entity_id?: string }

export const getSSOOptions = async () => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return emptyList(SERVICE_ERROR)
  const res = await apiCall<any>(baseUrl, `/sso/options/`, {
    method: 'GET',
    withToken: false,
    tag: 'SSOOptions',
    label: 'sso:options',
  })
  if (!res.ok) return emptyList((res.error?.detail as string) || 'Failed to fetch SSO options')
  return res.data
}

export const getAllUsers = async ({ limit, offset, search, is_active, parent, entity_id }: UserListParams) => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return emptyList(SERVICE_ERROR)
  const qs = new URLSearchParams()
  if (limit !== undefined) qs.set('limit', String(limit))
  if (offset !== undefined) qs.set('offset', String(offset))
  if (search) qs.set('search', search)
  if (is_active !== undefined) qs.set('is_active', String(is_active))
  if (parent) qs.set('parent', parent)
  if (entity_id) qs.set('entity_id', entity_id)
  const path = `/users/?${qs.toString()}`
  const data = await apiCallList(baseUrl, path, {
    method: 'GET',
    withToken: true,
    tag: 'UsersList',
    label: 'users:list',
  })
  if (data?.error) return data
  const userStats = {
    totalUsers: data.count,
    active: (data.results as User[]).filter(u => u.is_active).length,
    inactive: (data.results as User[]).filter(u => !u.is_active).length,
  }
  return { count: data.count, results: data.results, stats: userStats }
}

export const getUserById = async (id: string) => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return { error: SERVICE_ERROR, entity: null }
  const data = await apiCallObject(baseUrl, `/users/${id}/`, {
    method: 'GET',
    withToken: true,
    tag: `User-${id}`,
    label: 'users:detail',
  })
  if (data?.error) return { error: data.error, entity: null }
  return { entity: data }
}
