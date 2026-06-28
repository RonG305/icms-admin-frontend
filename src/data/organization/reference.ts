import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { EconomicActivity, Typology, Structure, MembershipType } from '@/types/reference'
import { buildQuery } from '@/utils/buildQuery'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

type ListParams = { page?: number; limit?: number; search?: string }

function makeList<T>(tag: string, path: string) {
    return async (params: ListParams = {}) => {
        const query = buildQuery({ page: params.page, limit: params.limit, search: params.search })
        const response = await makeApiRequest(getBaseUrl(), `${path}${query}`, {
            method: 'GET',
            withToken: true,
            tag,
        })
        if (!response?.ok) {
            const d = await response?.json().catch(() => null)
            return { error: d?.message || `Failed to fetch ${tag}`, data: [] as T[], total: 0 }
        }
        const data = await response.json()
        return {
            total: data.meta?.total ?? data.count ?? (Array.isArray(data) ? data.length : 0),
            data: (data.data ?? (Array.isArray(data) ? data : [])) as T[],
        }
    }
}

export const getEconomicActivities = makeList<EconomicActivity>('economic-activities', '/economic-activities')
export const getTypologies = makeList<Typology>('typologies', '/typologies')
export const getStructures = makeList<Structure>('structures', '/structures')
export const getMembershipTypes = makeList<MembershipType>('membership-types', '/membership-types')
