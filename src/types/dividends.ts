export interface DividendDeclaration {
    id: string;
    organization_id: string;
    financial_year: string;
    total_pool_amount: string;
    status: 'declared' | 'distributed';
    per_share_amount?: string;
    declared_by?: string;
    declared_at?: string;
    payment_deadline?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface DividendAccount {
    id: string;
    member_id: string;
    account_number: string;
    balance: string;
    total_earned: string;
    total_withdrawn: string;
    total_reinvested: string;
    created_at?: string;
    updated_at?: string;
}

export interface DividendAccountSummary {
    account_number: string;
    balance: string;
    total_earned: string;
    total_withdrawn: string;
    total_reinvested: string;
    transaction_count: number;
}

export interface DividendTransaction {
    id: string;
    member_id: string;
    declaration_id?: string;
    transaction_type: 'credit' | 'withdrawal' | 'reinvestment';
    amount: string;
    balance_after: string;
    notes?: string;
    payment_reference?: string;
    processed_by?: string;
    created_at: string;
}

export interface DeclarationSummary {
    declaration_id: string;
    financial_year: string;
    total_pool_amount: string;
    per_share_amount: string;
    total_distributed: string;
    member_count: number;
    status: string;
}
