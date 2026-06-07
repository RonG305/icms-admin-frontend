'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import type { DecodedUser, Profile } from '@/types/user'

export const getUser = async () => {
  try {
    if (!BASE_URLS.AUTH_URL) return null
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/user/`, {
      method: 'GET',
      withToken: true,
      cache: 'no-store',
    })
    if (!response.ok) return null
    const data = await response.json()
    if (!data?.id) return null
    return data
  } catch {
    return null
  }
}


export const getActiveProfile = async (): Promise<DecodedUser | null> => {
  try {
    const { cookies } = await import('next/headers')
    const token = (await cookies()).get('token')?.value
    if (!token) return null
    const { jwtDecode } = await import('jwt-decode')
    const decoded = jwtDecode<DecodedUser>(token)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null
    const profile = decoded
    return profile
  } catch {
    return null
  }
}


export const getActiveEntityId = async (): Promise<string | undefined> => {
  const profile = await getActiveProfile()
  return profile?.ea ?? undefined
}

