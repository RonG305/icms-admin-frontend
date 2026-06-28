// {
//   "success": true,
//   "message": "Members retrieved",
//   "data": [
//     {
//       "id": "cmpzd7gej0000sx53maycx3cv",
//       "member_number": "KLIC-0006",
//       "organization_id": "cmpwf2uk60001gi53lackmjnw",
//       "profile_id": "cmpzayphs0001yo53u792ytgd",
//       "category": "member_farmer",
//       "id_number": "40009879",
//       "kra_pin": "A001234567B",
//       "joined_date": "2026-06-04T10:41:07.531Z",
//       "status": "active",
//       "created_at": "2026-06-04T10:41:07.531Z",
//       "updated_at": "2026-06-04T10:41:07.531Z",
//       "share_account": {
//         "account_number": "SHA-2026-00006",
//         "total_shares": 0,
//         "total_value": "0"
//       },
//       "dividend_account": {
//         "account_number": "DIV-00006",
//         "balance": "0"
//       },
//       "profile": {
//         "id": "cmpzayphs0001yo53u792ytgd",
//         "user_id": "cmpa1j7zc0000i053mipzap1l",
//         "first_name": "Ronald",
//         "last_name": "Nguthu",
//         "middle_name": "Mutia",
//         "phone_number": "+254790021016",
//         "alternative_phone": "+254700000000",
//         "bio": "Software Developer",
//         "gender": "male",
//         "date_of_birth": "1990-01-01T00:00:00.000Z",
//         "avatar_url": "https://example.com/avatar.jpg",
//         "national_id": "12345678",
//         "national_id_type": "national_id",
//         "organization_id": "cmpwf2uk60001gi53lackmjnw",
//         "street_address": "123 Main St",
//         "city": "Nairobi",
//         "region": "Nairobi County",
//         "postal_code": "00100",
//         "country": "Kenya",
//         "address_type": "Residence",
//         "is_primary": true,
//         "is_verified": false,
//         "date_verified": "1990-01-01T00:00:00.000Z",
//         "verified_by": "null",
//         "created_at": "2026-06-04T09:38:20.176Z",
//         "updated_at": "2026-06-04T09:38:20.176Z",
//         "user": {
//           "email": "mutiaronald138@gmail.com",
//           "status": "active",
//           "account_type": "individual",
//           "is_verified": false
//         }
//       }
//     }
//   ],
//   "meta": {
//     "total": 1,
//     "next": null,
//     "previous": null
//   }
// }

export interface Member {
    id: string;
    member_number: string;
    organization_id: string;
    user_id: string;
    category: string;
    id_number?: string;
    kra_pin?: string;
    joined_date: string;
    membership_status: string;
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    review_notes?: string | null;
    created_at: string;
    updated_at: string;
    share_account?: {
        account_number: string;
        total_shares: number;
        total_value: string;
    };
    dividend_account?: {
        account_number: string;
        balance: string;
    };
    profile?: {
        id: string;
        user_id: string;
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
        street_address?: string;
        city?: string;
        region?: string;
        postal_code?: string;
        country?: string;
        address_type?: string;
        is_primary?: boolean;
        is_verified?: boolean;
        date_verified?: string;
        verified_by?: string;
        created_at?: string;
        updated_at?: string;
        user?: {
            email: string;
            status: string;
            account_type: string;
            is_verified: boolean;
        };
    };
}

export interface MemberResponse {
    success: boolean;
    message: string;
    data: Member[];
    meta: {
        total: number;
        next: string | null;
        previous: string | null;
    };
}

export interface ExitRequest {
    id: string;
    member_id: string;
    reason: 'voluntary' | 'death' | 'expulsion' | 'incapacitation' | 'other';
    reason_details?: string;
    notes?: string;
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
    snapshot_shares?: number;
    snapshot_dividend_balance?: string;
    settlement_amount?: string;
    reviewed_by?: string;
    created_at: string;
    updated_at: string;
    member?: Member;
}