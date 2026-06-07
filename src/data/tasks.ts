import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

export const getAllTasks = async ({limit, offset, search}: {limit?: number, offset?: number, search?: string}) => {
    const response = await makeApiRequest(BASE_URLS.BACKOFFICE_URL, `/ticketing/tasks/?limit=${limit}&offset=${offset}&search=${search}`, {
        method: 'GET',
        withToken: true,
        tag: 'TasksList',
    })
    
    if (!response.ok) {
        const errorData =  await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch tasks'
        }
    }

      const data = await response.json()

    return  {
        count: data.count,
        results: data.results
    }
}