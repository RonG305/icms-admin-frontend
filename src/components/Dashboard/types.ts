

export interface DashboardStatsType {
  expected_amount: string;
  total_amount_paid_raw: string;
  total_amount_to_be_paid: string;
  total_consumption_current_month_units: string;
  unpaid_amount: string;
  overpayment: number;
  total_bills: number;
  total_customers: number;
  customers_with_debt: number;
  total_paid_customers: number;
  payment_completion_rate: string;
}