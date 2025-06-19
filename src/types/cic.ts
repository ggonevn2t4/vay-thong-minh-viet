
export interface CICCheckRequest {
  id: string;
  customer_id: string;
  bank_name: string;
  loan_application_id?: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  requested_at: string;
  approved_at?: string;
  completed_at?: string;
  cic_score?: number;
  cic_report_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CustomerCICHistory {
  id: string;
  customer_id: string;
  check_date: string;
  bank_name: string;
  purpose?: string;
  impact_score: number;
  created_at: string;
}

export interface BankLoanOffer {
  id: string;
  loan_application_id: string;
  bank_name: string;
  offered_amount: number;
  interest_rate: number;
  term_months: number;
  conditions?: string;
  requires_cic_check: boolean;
  offer_expires_at?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  advisor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerWarning {
  id: string;
  customer_id: string;
  warning_type: 'cic_check_limit' | 'credit_score_impact' | 'multiple_applications';
  message: string;
  severity: 'low' | 'medium' | 'high';
  is_acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
}

export interface CICImpactResult {
  recent_checks: number;
  total_checks: number;
  impact_level: 'low' | 'medium' | 'high';
  can_safely_check: boolean;
  warning_message: string;
}
