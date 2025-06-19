
export type LoanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'reviewing';

// Define a type that handles both successful profile data and potential errors
export interface SupabaseRawLoanApplication {
  id: string;
  amount: number;
  term_months: number;
  loan_type: string;
  status: string;
  monthly_income: number | null;
  employment_type: string | null;
  purpose: string | null;
  created_at: string;
  user_id: string;
  offers_generated_at: string | null;
  total_offers_count: number;
  customer_education_completed: boolean;
  profiles?: {
    full_name: string;
    phone: string;
  } | null | any; // Using 'any' to handle SelectQueryError objects
}

// Processed type after filtering and validation
export interface RawLoanApplicationWithProfile {
  id: string;
  amount: number;
  term_months: number;
  loan_type: string;
  status: string;
  monthly_income: number | null;
  employment_type: string | null;
  purpose: string | null;
  created_at: string;
  user_id: string;
  offers_generated_at: string | null;
  total_offers_count: number;
  customer_education_completed: boolean;
  profiles?: {
    full_name: string;
    phone: string;
  } | null;
}

export interface ReviewData {
  review_status: LoanStatus;
  review_notes: string;
  approval_amount: string;
  approved_interest_rate: string;
  approved_term_months: string;
  conditions: string;
}
