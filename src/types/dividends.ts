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
