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