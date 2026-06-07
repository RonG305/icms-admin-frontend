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
    console.log("Login Response Data: ", data)
    console.log("Login user: ", data)

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Failed to login'
        }
    }
    const cookieStore = await cookies()
    cookieStore.set("token", data.accessToken, { httpOnly: true, secure: true, sameSite: "lax" })
    return data
}

// export const updateProfile = async (profileId: string | number, profileData: UserProfile) => {
//     const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/profile/${profileId}/`, {
//         method: 'PATCH',
//         withToken: true,
//         body: profileData,
//         tag: 'update-profile'
//     })
//     const data = await response?.json()

//     if (!response?.ok) {
//         const errorData = data || {}
//         return {
//             error: errorData?.detail || 'Failed to update profile'
//         }
//     }
//     return data
// }

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

// export const deleteProfile = async (profileId: string | number) => {
//     const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/profile/${profileId}/`, {
//         method: 'DELETE',
//         withToken: true,
//         tag: 'delete-profile'
//     })

//     if (!response?.ok) {
//         const data = await response?.json()
//         const errorData = data || {}
//         return {
//             error: errorData?.detail || 'Failed to delete profile'
//         }
//     }
//     return { success: true }
// }
