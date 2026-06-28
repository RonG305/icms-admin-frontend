'use server'

import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import { RegisterUserData } from "@/types/auth"
import { cookies } from "next/headers"

export const registerUser = async (userData: RegisterUserData) => {
    console.log("Registering user with data: ", userData)
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/register/`, {
        method: 'POST',
        body: userData,
        tag: 'register-user'
    })

    const data = await response?.json()
    console.log("Register user: ", data)

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Failed to create user account'
        }
    }
    return data
}

export const loginUser = async (email: string, password: string, organizationId?: string) => {
    const body: Record<string, string> = { email, password }
    if (organizationId) body.organization_id = organizationId

    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/login/`, {
        method: 'POST',
        body,
        tag: 'login-user'
    })

    const data = await response?.json()

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Failed to login'
        }
    }
    return { pre_auth_token: data?.data?.pre_auth_token } as { pre_auth_token: string }
}

export const verifyLoginOtp = async (preAuthToken: string, otp: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/login/verify-otp/`, {
        method: 'POST',
        body: { pre_auth_token: preAuthToken, otp },
        tag: 'verify-login-otp'
    })

    const data = await response?.json()
    console.log("Verify OTP response:", JSON.stringify(data))

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Invalid or expired OTP'
        }
    }
    const token = data?.data?.accessToken ?? data?.data?.access_token ?? data?.data?.access ?? data?.accessToken
    const cookieStore = await cookies()
    cookieStore.set("token", token, { httpOnly: true, secure: true, sameSite: "lax" })
    return data
}


export const updateUser = async (id: string, userData: Partial<RegisterUserData>) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/update/`, {
        method: 'PATCH',
        withToken: true,
        body: userData,
        tag: 'update-user',
    })
    const data = await response?.json()
    if (!response?.ok) {
        return { error: data?.message || data?.error || 'Failed to update user' }
    }
    return data
}

export const activateUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/activate/`, {
        method: 'PATCH',
        withToken: true,
        tag: 'activate-user',
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to activate user' }
    }
    return { success: true }
}

export const deactivateUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/deactivate/`, {
        method: 'PATCH',
        withToken: true,
        tag: 'deactivate-user',
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to deactivate user' }
    }
    return { success: true }
}

export const deleteUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/delete/`, {
        method: 'DELETE',
        withToken: true,
        tag: 'delete-user',
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to delete user' }
    }
    return { success: true }
}

export const logoutUser = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('token')
}
