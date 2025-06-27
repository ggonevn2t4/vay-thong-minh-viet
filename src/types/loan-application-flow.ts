
export type LoanProductType = 'credit_loan' | 'mortgage_loan';

export interface LoanProduct {
  id: LoanProductType;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  requirements: string[];
}

export interface CustomQuestionForm {
  productType: LoanProductType;
  questions: QuestionField[];
}

export interface QuestionField {
  id: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface LoanApplicationFormData {
  // Basic info
  amount: number;
  term_months: number;
  purpose: string;
  product_type: LoanProductType;
  
  // Custom questions responses
  customer_questions: Record<string, any>;
  
  // Mortgage specific
  collateral_info?: Record<string, any>;
  property_value?: number;
  property_address?: string;
  loan_to_value_ratio?: number;
  
  // Personal info
  monthly_income?: number;
  employment_type?: string;
}

export interface AdvisorSelection {
  advisor_id: string;
  advisor_name: string;
  bank_name: string;
  specializations: string[];
  rating: number;
  experience_years: number;
}

export interface ConversationData {
  id: string;
  loan_application_id: string;
  customer_id: string;
  advisor_id: string;
  status: 'active' | 'closed';
  last_message_at: string;
}

export interface MessageData {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system';
  read_at?: string;
  created_at: string;
}
