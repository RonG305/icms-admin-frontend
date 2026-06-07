import { BASE_URLS } from '@/api/base'
import { apiCallList, apiCallObject } from '@/utils/apiErrors'

const SERVICE_ERROR = 'Entity service not configured'

const getBaseUrl = () => BASE_URLS.GPX_AUTH_URL

const emptyList = (message: string) => ({ error: message, results: [] as unknown[], count: 0 })

type InvitesListParams = {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
  entity_id?: string
  parent?: string
}

export const getAllUsersInvites = async ({ limit, offset, search, is_active, entity_id }: InvitesListParams) => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return emptyList(SERVICE_ERROR)
  const path = entity_id
    ? `/invites/?limit=${limit}&offset=${offset}&search=${search}&is_active=${is_active}&entity_id=${entity_id}`
    : `/invites/?limit=${limit}&offset=${offset}&search=${search}&is_active=${is_active}`
  const data = await apiCallList(baseUrl, path, {
    method: 'GET',
    withToken: true,

    tag: 'UsersInvitesList',
    label: 'invites:list',
  })
  if (data?.error) return data
  return { count: data.count, results: data.results }
}

export const getUserByInviteId = async (id: string) => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return { error: SERVICE_ERROR, entity: null }
  const data = await apiCallObject(baseUrl, `/invites/${id}/`, {
    method: 'GET',
    withToken: true,
    tag: `UserInvite-${id}`,
    label: 'invites:detail',
  })
  if (data?.error) return { error: data.error, entity: null }
  return { entity: data }
}
