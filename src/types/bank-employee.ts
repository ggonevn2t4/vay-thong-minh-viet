
export interface SupabaseLoanApplication {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface SupabaseCreditAssessment {
  id: string;
  credit_score: number;
  risk_level: string;
  assessment_date: string;
}

export interface SupabaseCustomer {
  id: string;
  full_name: string;
  phone: string;
  employment_type: string;
  monthly_income: number;
  company_name: string;
  created_at: string;
  loan_applications?: SupabaseLoanApplication[];
  customer_credit_assessments?: SupabaseCreditAssessment[];
}

export interface SupabaseLoanApplicationWithProfile {
  id: string;
  amount: number;
  term_months: number;
  loan_type: string;
  status: string;
  monthly_income: number;
  employment_type: string;
  purpose: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    phone: string;
  };
}

export interface CreditAssessment {
  credit_score: number;
  income_verification_status: string;
  employment_verification_status: string;
  debt_to_income_ratio: number;
  risk_level: string;
  assessment_notes: string;
  recommended_loan_amount: number;
  recommended_interest_rate: number;
}
