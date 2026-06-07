import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'

const SERVICE_ERROR = 'Entity service not configured'
const UNREACHABLE_ERROR = 'Unable to reach entity service'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type EntityListParams = { limit?: number; offset?: number; search?: string; is_active?: boolean, parent?: string, entity_type_name?: string }
type EntityTypeListParams = { limit?: number; offset?: number; search?: string }

export type EntityStats = { total: number; active: number; inactive: number }

const emptyStats = (): EntityStats => ({ total: 0, active: 0, inactive: 0 })


export const getAllEntities = async ({ limit, offset, search, is_active, parent, entity_type_name }: EntityListParams) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const query = new URLSearchParams()
    Object.entries({ limit, offset, search, is_active, parent, entity_type_name }).forEach(
      ([k, v]) => v !== undefined && v !== null && query.set(k, String(v))
    )
    const entityUrl = `/entities/?${query.toString()}`
    const response = await makeApiRequest(baseUrl, entityUrl, {
      method: 'GET',
      withToken: true,
      tag: 'EntitiesList',
    })
    const data = await response.json()
    if (!response.ok) return emptyList(data?.detail || data?.error || 'Failed to fetch entities')
    return { count: data.count, results: data.results }
  } catch {
    return emptyList(UNREACHABLE_ERROR)
  }
}

export const getEntitiesByType = async (type: string, params: EntityListParams) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const { limit, offset, search, is_active, parent } = params
    const response = await makeApiRequest(baseUrl, `/entities/?type=${type}&limit=${limit}&offset=${offset}&search=${search}&is_active=${is_active}&parent=${parent}`, {
      method: 'GET',
      withToken: true,
      tag: `EntitiesByType-${type}`,
    })
    const data = await response.json()
    if (!response.ok) return emptyList(data?.detail || data?.error || `Failed to fetch entities of type ${type}`)
    return { count: data.count, results: data.results }
  } catch {
    return emptyList(UNREACHABLE_ERROR)
  }
}

export const getEntityById = async (id: string) => {
  if (!id) return { error: 'Entity id is required' }
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { error: SERVICE_ERROR }
    const response = await makeApiRequest(baseUrl, `/entities/${id}/`, {
      method: 'GET',
      withToken: true,
      tag: `Entity-${id}`,
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      return { error: data?.detail || data?.error || 'Failed to fetch entity details' }
    }
    return data ?? { error: 'Empty response from entity service' }
  } catch {
    return { error: UNREACHABLE_ERROR }
  }
}

export const getEntitiesStats = async (entity_type?: string): Promise<EntityStats & { error?: string }> => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return { ...emptyStats(), error: SERVICE_ERROR }
    const query = new URLSearchParams()
    if (entity_type) query.set('entity_type', entity_type)
    const qs = query.toString()
    const url = `/entities/stats/${qs ? `?${qs}` : ''}`
    const response = await makeApiRequest(baseUrl, url, {
      method: 'GET',
      withToken: true,
      tag: entity_type ? `EntitiesStats-${entity_type}` : 'EntitiesStats',
    })
    const data = await response.json()
    if (!response.ok) return { ...emptyStats(), error: data?.detail || data?.error || 'Failed to fetch entity stats' }
    return { total: Number(data?.total ?? 0), active: Number(data?.active ?? 0), inactive: Number(data?.inactive ?? 0) }
  } catch {
    return { ...emptyStats(), error: UNREACHABLE_ERROR }
  }
}

export const getEntityTypeIdByName = async (name: string): Promise<string | undefined> => {
  const res = await getAllEntityTypes({ limit: 100, offset: 0, search: name })
  const match = (res.results as Array<{ id: string; name: string }>).find(
    t => t?.name?.toLowerCase() === name.toLowerCase()
  )
  return match?.id
}

export const getAllEntityTypes = async ({ limit, offset, search }: EntityTypeListParams) => {
  try {
    const baseUrl = getBaseUrl()
    if (!baseUrl) return emptyList(SERVICE_ERROR)
    const response = await makeApiRequest(baseUrl, `/entities/types/?limit=${limit}&offset=${offset}&search=${search}`, {
      method: 'GET',
      withToken: true,
      tag: 'EntityTypesList',
    })
    const data = await response.json()
    if (!response.ok) return emptyList(data?.detail || data?.error || 'Failed to fetch entity types')
    return { count: data.count, results: data.results }
  } catch {
    return emptyList(UNREACHABLE_ERROR)
  }
}