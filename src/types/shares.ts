import { Member } from './member'

export interface ShareAccount {
    id: string;
    member_id: string;
    account_number: string;
    total_shares: number;
    total_value: string;
    organization_id?: string;
    created_at?: string;
    member?: Member;
}

export interface ShareTransaction {
    id: string;
    member_id: string;
    transaction_type: 'coop_purchase' | 'member_purchase' | 'transfer' | 'coop_sale' | 'member_sale';
    number_of_shares: number;
    amount: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    payment_reference?: string;
    notes?: string;
    approved_by?: string;
    created_at: string;
    updated_at: string;
    member?: Member;
}

export interface ShareConfig {
    id: string;
    organization_id: string;
    par_value: string;
    max_shares_per_member?: number;
    min_shares_required?: number;
    allow_member_trading: boolean;
    approval_required: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ShareAccountSummary {
    account_number: string;
    total_shares: number;
    total_value: string;
    total_bought: number;
    total_sold: number;
    transaction_count: number;
}

export interface ShareStatement {
    id: string;
    transaction_type: string;
    number_of_shares: number;
    amount: string;
    balance_after?: number;
    notes?: string;
    created_at: string;
}
