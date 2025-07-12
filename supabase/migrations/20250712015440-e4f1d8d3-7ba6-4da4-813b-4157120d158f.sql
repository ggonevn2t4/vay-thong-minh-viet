-- Create consumer credit loan survey responses table
CREATE TABLE public.consumer_credit_loan_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  phone_number TEXT NOT NULL,
  email TEXT,
  marital_status TEXT,
  number_of_dependents INTEGER DEFAULT 0,
  
  -- Employment and Income
  employment_status TEXT NOT NULL,
  employer_name TEXT,
  job_title TEXT,
  work_experience_years INTEGER,
  monthly_salary NUMERIC,
  other_income_sources JSONB DEFAULT '[]'::jsonb,
  total_monthly_income NUMERIC,
  
  -- Credit Information
  desired_credit_limit NUMERIC,
  current_credit_cards JSONB DEFAULT '[]'::jsonb,
  existing_loans JSONB DEFAULT '[]'::jsonb,
  monthly_expenses NUMERIC,
  savings_amount NUMERIC,
  assets JSONB DEFAULT '[]'::jsonb,
  
  -- Credit Purpose and Preferences
  primary_credit_purpose TEXT,
  preferred_repayment_method TEXT,
  preferred_banks JSONB DEFAULT '[]'::jsonb,
  interest_rate_preference TEXT,
  
  -- Credit History
  previous_bank_relationships TEXT,
  credit_history_issues BOOLEAN DEFAULT false,
  credit_history_details TEXT,
  estimated_credit_score INTEGER,
  
  -- Metadata
  recommended_products JSONB DEFAULT '[]'::jsonb,
  risk_assessment JSONB DEFAULT '{}'::jsonb,
  survey_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consumer_credit_loan_survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own consumer credit loan survey responses"
  ON public.consumer_credit_loan_survey_responses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_consumer_credit_loan_survey_responses_updated_at
  BEFORE UPDATE ON public.consumer_credit_loan_survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();