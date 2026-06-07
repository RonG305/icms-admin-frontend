'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Transactions service is not configured.'
const UNREACHABLE_ERROR = 'Unable to reach transactions service.'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL

const empty = (message: string) => ({ error: message })

type CommonParams = {
  entity?: string
  currency?: 'KES' | 'USD' | string
  date_from?: string
  date_to?: string
  year?: number
  month?: number
  week_of?: string
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
    const fullPath = `/analytics/${path}/${qs ? `?${qs}` : ''}`
    const response = await makeApiRequest(baseUrl, fullPath, {
      method: 'GET',
      withToken: true,
      tag,
    })
    if (!response.ok) return empty('Failed to fetch transactions analytics') as any
    return await response.json()
  } catch {
    return empty(UNREACHABLE_ERROR) as any
  }
}

export async function getTransactionsAnalyticsStats(params: CommonParams = {}) {
  return analyticsCall('transaction_stats', params, 'TransactionsAnalyticsStats')
}

export async function getTransactionsAnalyticsByStatus(params: CommonParams = {}) {
  return analyticsCall('transactions/by-status', params, 'TransactionsAnalyticsByStatus')
}

export async function getTransactionsAnalyticsByWeekday(params: CommonParams = {}) {
  return analyticsCall('transactions/by-weekday', params, 'TransactionsAnalyticsByWeekday')
}

export async function getTransactionsAnalyticsByChannel(params: CommonParams = {}) {
  return analyticsCall('payment_channels_stats', params, 'TransactionsAnalyticsByChannel')
}
