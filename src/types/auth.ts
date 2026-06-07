export interface RegisterUserData {
  email: string;
  password: string;
  confirm_password: string;
  accept_terms_conditions: boolean;
  account_type?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone_number?: string;
  alternative_phone?: string;
  gender?: string;
  date_of_birth?: string;
  bio?: string;
  avatar_url?: string;
  national_id?: string;
  national_id_type?: string;
  street_address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  address_type?: string;
  organization_id?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number?: string;
  alternative_phone?: string;
  bio?: string;
  gender?: string;
  date_of_birth?: string;
  avatar_url?: string;
  national_id?: string;
  national_id_type?: string;
  organization_id?: string;
  street_address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  address_type?: string;
  is_primary?: boolean;
  is_verified?: boolean;
  accept_terms_conditions?: boolean;
  status: string;
  account_type: string;
  roles: string[];
  is_two_factor_enabled?: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrgUserStats {
  organization_id: string;
  users: {
    total: number;
    by_status: { active: number; inactive: number; suspended: number };
    verification: { verified: number; unverified: number; verification_rate: number };
    security: { two_factor_enabled: number; two_factor_rate: number };
    registrations: { today: number; this_month: number };
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "create" | "read" | "update" | "delete";
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
    // Basic fields
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number?: string;
  alternative_phone?: string;
  bio?: string;
  gender?: string;
  date_of_birth?: string;
  avatar_url?: string;
  national_id?: string;
  national_id_type?: string;
  // Address fields
  street_address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  address_type?: string;
//   Other fields
  is_primary?: boolean;
  is_verified?: boolean;
  date_verified?: string;
  verified_by?: string;
}