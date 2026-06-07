
import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Entity service not configured'
const UNREACHABLE_ERROR = 'Unable to reach entity service'

const getBaseUrl = () => BASE_URLS.GPX_BASE_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type IntegrationListParams = { limit?: number; offset?: number; search?: string; is_active?: boolean, parent?: string, entity_type_name?: string }
type IntegrationTypeListParams = { limit?: number; offset?: number; search?: string }


export const getAllIntegrations = async ({ limit, offset, search, is_active, parent, entity_type_name }: IntegrationListParams) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)

    const query = new URLSearchParams()
    Object.entries({ limit, offset, search, is_active }).forEach(
      ([k, v]) => v !== undefined && v !== null && query.set(k, String(v))
    )

    const queryString = query.toString()
    const entityUrl = `/credentials/applications/${queryString ? '?' + queryString : ''}`

    const response = await makeApiRequest(baseUrl, entityUrl, {
      method: 'GET',
      withToken: true,
      tag: 'IntegrationsList',
      cache: 'no-store'
    })

    const data = await response.json()
    if (!response.ok) return emptyList(data?.detail || data?.error || 'Failed to fetch integrations')
    return { count: data.count, results: data.results }
  } catch {
    return emptyList(UNREACHABLE_ERROR)
  }
}

export const getSystemApplications = async ({ search = '' }: { search?: string } = {}) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)

    const url = search
      ? `/credentials/applications?search=${encodeURIComponent(search)}`
      : `/core/integrations`

    const response = await makeApiRequest(baseUrl, url, {
      method: 'GET',
      withToken: true,
      tag: 'get-systemapplications',
      cache: 'no-store'
    })

    const data = await response.json()
    if (!response.ok) return emptyList(data?.detail || data?.error || 'Failed to fetch system applications')
    return data
  } catch {
    return emptyList(UNREACHABLE_ERROR)
  }
}


export const getSystemApplicationById = async (applicationId: string | number) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }

    const response = await makeApiRequest(baseUrl, `/credentials/applications/${applicationId}/`, {
      method: 'GET',
      withToken: true,
      tag: 'get-systemapplication-detail',
      cache: 'no-store'
    })

    const data = await response.json()
    if (!response.ok) return { error: data?.detail || data?.error || 'Failed to fetch system application' }
    return data
  } catch (error) {
    return { error: UNREACHABLE_ERROR }
  }
}