-- Create credit card survey responses table
CREATE TABLE public.credit_card_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  -- Personal Information
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
  monthly_salary DECIMAL(15,2),
  other_income_sources JSONB DEFAULT '[]'::JSONB,
  total_monthly_income DECIMAL(15,2),
  
  -- Financial Information
  existing_credit_cards JSONB DEFAULT '[]'::JSONB,
  existing_loans JSONB DEFAULT '[]'::JSONB,
  monthly_expenses DECIMAL(15,2),
  savings_amount DECIMAL(15,2),
  assets JSONB DEFAULT '{}'::JSONB,
  
  -- Credit Card Preferences
  desired_credit_limit DECIMAL(15,2),
  primary_card_usage TEXT,
  preferred_benefits JSONB DEFAULT '[]'::JSONB,
  annual_fee_preference TEXT,
  
  -- Additional Information
  previous_bank_relationships TEXT,
  credit_history_issues BOOLEAN DEFAULT false,
  credit_history_details TEXT,
  
  -- System fields
  estimated_credit_score INTEGER,
  risk_assessment JSONB DEFAULT '{}'::JSONB,
  recommended_products JSONB DEFAULT '[]'::JSONB,
  survey_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.credit_card_survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own survey responses" 
ON public.credit_card_survey_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own survey responses" 
ON public.credit_card_survey_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" 
ON public.credit_card_survey_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_credit_card_survey_responses_updated_at
BEFORE UPDATE ON public.credit_card_survey_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();