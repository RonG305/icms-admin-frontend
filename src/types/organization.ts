
export interface Organization {
    id: string
    organization_name: string
    short_name?: string
    description?: string
    country?: string
    website?: string
    logo_url?: string
    date_founded?: string
    contact_person?: string
    contact_person_phone?: string
    contact_person_email?: string
    created_at: string
    updated_at: string
    status: 'active' | 'inactive' | 'suspended'
}

export interface CreateOrganizationData {
    organization_name: string
    short_name?: string
    description?: string
    country?: string
    website?: string
    logo_url?: string
    date_founded?: string
    contact_person?: string
    contact_person_phone?: string
    contact_person_email?: string
}

export interface MemberProfile {
    id: string
    user_id: string
    first_name: string
    last_name: string
    middle_name?: string
    phone_number?: string
    avatar_url?: string
    national_id?: string
    city?: string
    country?: string
    is_verified?: boolean
    created_at: string
    updated_at: string
    user: {
        email: string
        status: string
        account_type: string
        is_verified: boolean
    }
}

export interface OrganizationMember {
    id: string
    member_number: string
    organization_id: string
    profile_id: string
    category: string
    id_number?: string
    kra_pin?: string
    joined_date: string
    status: 'active' | 'inactive' | 'suspended'
    created_at: string
    updated_at: string
    share_account?: {
        account_number: string
        total_shares: number
        total_value: string
    }
    dividend_account?: {
        account_number: string
        balance: string
    }
    profile?: MemberProfile
}

export interface MembersListResponse {
    success: boolean
    message: string
    data: OrganizationMember[]
    meta: {
        total: number
        next: string | null
        previous: string | null
    }
}

export interface OrganizationListParams {
    limit?: number
    offset?: number
    search?: string
    is_active?: boolean
}

export interface MemberListParams {
    limit?: number
    offset?: number
    search?: string
    role?: string
}



export type UpdateOrganizationData = Partial<CreateOrganizationData>