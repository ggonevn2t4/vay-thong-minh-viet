
export interface FinancialData {
  monthly_income: number;
  monthly_expenses: number;
  existing_debts: number;
  credit_score?: number;
  employment_type: string;
  work_experience_years: number;
  desired_loan_amount: number;
  loan_purpose: string;
  preferred_term_months: number;
}

export interface AIAnalysis {
  risk_score: number;
  debt_to_income_ratio: number;
  affordability_score: number;
  recommendations: string[];
  warnings: string[];
}

export interface LoanOptimization {
  optimal_amount: number;
  optimal_term: number;
  recommended_banks: string[];
  expected_interest_rate_range: { min: number; max: number };
}

export interface BankApprovalPrediction {
  bank_name: string;
  approval_probability: number;
  predicted_interest_rate: number;
  required_documents: string[];
}
