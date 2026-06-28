'use server'

import { BASE_URLS } from '@/api/base'
import { makeApiRequest } from '@/api/main'
import { revalidateTag } from 'next/cache'

const getBaseUrl = () => BASE_URLS.ORGANIZATION_URL

export const reviewExitRequest = async (
    id: string,
    data: { decision: string; reviewed_by: string; notes?: string }
) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/exit-requests/${id}/review`, {
        method: 'PATCH',
        withToken: true,
        body: data,
        tag: 'review-exit-request',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to review exit request' }
    }
    revalidateTag('exit-requests', 'default')
    return json
}

export const settleExitRequest = async (id: string, data?: { notes?: string }) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/exit-requests/${id}/settle`, {
        method: 'PATCH',
        withToken: true,
        body: data ?? {},
        tag: 'settle-exit-request',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to settle exit request' }
    }
    revalidateTag('exit-requests', 'default')
    return json
}

export const submitExitRequest = async (data: {
    member_id: string
    reason: string
    reason_details?: string
    notes?: string
}) => {
    const response = await makeApiRequest(getBaseUrl(), `/members/exit-requests`, {
        method: 'POST',
        withToken: true,
        body: data,
        tag: 'submit-exit-request',
    })

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to submit exit request' }
    }
    revalidateTag('exit-requests', 'default')
    return json
}

export const cancelExitRequest = async (id: string, memberId: string) => {
    const response = await makeApiRequest(
        getBaseUrl(),
        `/members/exit-requests/${id}/cancel?member_id=${memberId}`,
        {
            method: 'PATCH',
            withToken: true,
            tag: 'cancel-exit-request',
        }
    )

    const json = await response?.json().catch(() => null)
    if (!response?.ok) {
        return { error: json?.message || json?.error || 'Failed to cancel exit request' }
    }
    revalidateTag('exit-requests', 'default')
    return json
}
