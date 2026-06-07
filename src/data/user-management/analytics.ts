'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Users service is not configured.'
const UNREACHABLE_ERROR = 'Unable to reach users service.'

const getBaseUrl = () => BASE_URLS.AUTH_URL
const emptyList = (message: string) => ({ error: message, results: {} as unknown[], count: 0 })
const empty = (message: string) => ({ error: message })

type CommonParams = {
  entity?: string
  date_from?: string
  date_to?: string
  year?: number
  month?: number
}

const buildQuery = (params: CommonParams): string =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')

const analyticsCall = async <T = any>(
  path: string,
  params: CommonParams = {},
  tag: string,
): Promise<T | { error: string }> => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return empty(SERVICE_ERROR) as any
    const qs = buildQuery(params)
    const fullPath = `/users/analytics/${path}/${qs ? `?${qs}` : ''}`
    const response = await makeApiRequest(baseUrl, fullPath, {
      method: 'GET',
      withToken: true,
      tag,
    })
    if (!response.ok) return empty('Failed to fetch users analytics') as any
    return await response.json()
  } catch {
    return empty(UNREACHABLE_ERROR) as any
  }
}

export async function getUsersAnalyticsSummary(params: CommonParams = {}) {
  return analyticsCall('summary', params, 'UsersAnalyticsSummary')
}

export async function getUsersAnalyticsByRole(params: CommonParams = {}) {
  return analyticsCall('by-role', params, 'UsersAnalyticsByRole')
}

export async function getUsersAnalyticsByStatus(params: CommonParams = {}) {
  return analyticsCall('by-status', params, 'UsersAnalyticsByStatus')
}


export const getInvitesStats = async (params: { entity_id?: string } = {}) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    const query = new URLSearchParams()
    query.set('group_by', 'status')
    if (params.entity_id) query.set('entity_id', params.entity_id)
    const path = `/invites/stats/?${query.toString()}`
    const response = await makeApiRequest(baseUrl, path, {
      method: 'GET',
      withToken: true,
      tag: 'InvitesStats',
    })
    const data = await response.json()
    if (!response.ok) return { error: data?.detail || data?.error || 'Failed to fetch invite stats' }
    return data as { grouped_counts: Record<string, number> }
  } catch {
    return { error: UNREACHABLE_ERROR }
  }
}