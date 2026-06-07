'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Invoices service is not configured.'
const UNREACHABLE_ERROR = 'Unable to reach invoices service.'

const getBaseUrl = () => BASE_URLS.GPX_BASE_URL

const empty = (message: string) => ({ error: message })

type CommonParams = {
  entity?: string
  currency?: 'KES' | 'USD' | string
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
    const fullPath = `/invoicing/analytics/${path}/${qs ? `?${qs}` : ''}`
    const response = await makeApiRequest(baseUrl, fullPath, {
      method: 'GET',
      withToken: true,
      cache: "force-cache",
      tag,
    })
    if (!response.ok) return empty('Failed to fetch invoices analytics') as any
    return await response.json()
  } catch {
    return empty(UNREACHABLE_ERROR) as any
  }
}

export async function getInvoicesAnalyticsSummary(params: CommonParams = {}) {
  return analyticsCall('summary', params, 'InvoicesAnalyticsSummary')
}

export async function getInvoicesAnalyticsByStatus(params: CommonParams = {}) {
  return analyticsCall('by-status', params, 'InvoicesAnalyticsByStatus')
}

export async function getInvoicesAnalyticsByPeriod(params: CommonParams = {}) {
  return analyticsCall('by-period', params, 'InvoicesAnalyticsByPeriod')
}
