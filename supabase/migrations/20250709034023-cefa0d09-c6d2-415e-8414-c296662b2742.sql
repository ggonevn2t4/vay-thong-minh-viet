-- Create home loan survey responses table
CREATE TABLE public.home_loan_survey_responses (
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
  
  -- Property Information
  property_type TEXT, -- apartment, house, villa, etc.
  property_location TEXT,
  property_value NUMERIC,
  down_payment_amount NUMERIC,
  loan_amount_needed NUMERIC,
  loan_term_years INTEGER,
  
  -- Financial Information
  existing_loans JSONB DEFAULT '[]'::jsonb,
  monthly_expenses NUMERIC,
  savings_amount NUMERIC,
  other_assets JSONB DEFAULT '[]'::jsonb,
  
  -- Preferences
  preferred_banks JSONB DEFAULT '[]'::jsonb,
  interest_rate_preference TEXT, -- fixed, variable, mixed
  payment_schedule_preference TEXT, -- monthly, quarterly
  loan_purpose TEXT, -- investment, primary_residence, etc.
  
  -- Additional Information
  previous_property_ownership BOOLEAN DEFAULT false,
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

-- Create car loan survey responses table
CREATE TABLE public.car_loan_survey_responses (
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
  
  -- Car Information
  car_type TEXT, -- new, used
  car_brand TEXT,
  car_model TEXT,
  car_value NUMERIC,
  down_payment_amount NUMERIC,
  loan_amount_needed NUMERIC,
  loan_term_years INTEGER,
  
  -- Financial Information
  existing_loans JSONB DEFAULT '[]'::jsonb,
  monthly_expenses NUMERIC,
  savings_amount NUMERIC,
  current_vehicle_info JSONB DEFAULT '{}'::jsonb,
  
  -- Preferences
  preferred_banks JSONB DEFAULT '[]'::jsonb,
  interest_rate_preference TEXT,
  payment_schedule_preference TEXT,
  insurance_requirement TEXT,
  
  -- Additional Information
  driving_experience_years INTEGER,
  previous_car_loans BOOLEAN DEFAULT false,
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

-- Enable RLS for both tables
ALTER TABLE public.home_loan_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_loan_survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for home loan survey
CREATE POLICY "Users can manage their own home loan survey responses"
  ON public.home_loan_survey_responses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for car loan survey
CREATE POLICY "Users can manage their own car loan survey responses"
  ON public.car_loan_survey_responses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_home_loan_survey_responses_updated_at
  BEFORE UPDATE ON public.home_loan_survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_car_loan_survey_responses_updated_at
  BEFORE UPDATE ON public.car_loan_survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create real-time notifications table for better notification system
CREATE TABLE public.real_time_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, success, warning, error
  action_url TEXT,
  action_label TEXT,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  metadata JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.real_time_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for real-time notifications
CREATE POLICY "Users can view their own real-time notifications"
  ON public.real_time_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own real-time notifications"
  ON public.real_time_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- System can insert notifications for users
CREATE POLICY "System can insert real-time notifications"
  ON public.real_time_notifications
  FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger for notifications
CREATE TRIGGER update_real_time_notifications_updated_at
  BEFORE UPDATE ON public.real_time_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();