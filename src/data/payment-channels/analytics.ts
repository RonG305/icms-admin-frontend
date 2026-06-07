'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Integrations service is not configured.'
const UNREACHABLE_ERROR = 'Unable to reach integrations service.'

const getBaseUrl = () => BASE_URLS.GPX_BASE_URL

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
    const fullPath = `/integrations/analytics/${path}/${qs ? `?${qs}` : ''}`
    const response = await makeApiRequest(baseUrl, fullPath, {
      method: 'GET',
      withToken: true,
      tag,
    })
    if (!response.ok) return empty('Failed to fetch integrations analytics') as any
    return await response.json()
  } catch {
    return empty(UNREACHABLE_ERROR) as any
  }
}

export async function getIntegrationsAnalyticsSummary(params: CommonParams = {}) {
  return analyticsCall('summary', params, 'IntegrationsAnalyticsSummary')
}

export async function getIntegrationsAnalyticsByType(params: CommonParams = {}) {
  return analyticsCall('by-type', params, 'IntegrationsAnalyticsByType')
}

export async function getIntegrationsAnalyticsByStatus(params: CommonParams = {}) {
  return analyticsCall('by-status', params, 'IntegrationsAnalyticsByStatus')
}
