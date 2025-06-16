
-- Create table for bank employee profiles
CREATE TABLE public.bank_employee_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  hire_date DATE,
  supervisor_id UUID REFERENCES public.bank_employee_profiles(id),
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on bank employee profiles
ALTER TABLE public.bank_employee_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for bank employee profiles
CREATE POLICY "Bank employees can view their own profile" 
  ON public.bank_employee_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Bank employees can update their own profile" 
  ON public.bank_employee_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create table for loan application reviews
CREATE TABLE public.loan_application_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  review_status TEXT NOT NULL CHECK (review_status IN ('pending', 'approved', 'rejected', 'requires_documents')),
  review_notes TEXT,
  documents_requested JSONB DEFAULT '[]'::jsonb,
  approval_amount BIGINT,
  approved_interest_rate NUMERIC(5,2),
  approved_term_months INTEGER,
  conditions TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on loan application reviews
ALTER TABLE public.loan_application_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for loan application reviews
CREATE POLICY "Bank employees can view all reviews" 
  ON public.loan_application_reviews 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

CREATE POLICY "Bank employees can create reviews" 
  ON public.loan_application_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

CREATE POLICY "Bank employees can update their own reviews" 
  ON public.loan_application_reviews 
  FOR UPDATE 
  TO authenticated
  USING (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

-- Create table for customer credit assessments
CREATE TABLE public.customer_credit_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  assessor_id UUID NOT NULL REFERENCES auth.users(id),
  credit_score INTEGER,
  income_verification_status TEXT CHECK (income_verification_status IN ('pending', 'verified', 'rejected')),
  employment_verification_status TEXT CHECK (employment_verification_status IN ('pending', 'verified', 'rejected')),
  debt_to_income_ratio NUMERIC(5,2),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  assessment_notes TEXT,
  recommended_loan_amount BIGINT,
  recommended_interest_rate NUMERIC(5,2),
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on customer credit assessments
ALTER TABLE public.customer_credit_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for customer credit assessments
CREATE POLICY "Bank employees can view all assessments" 
  ON public.customer_credit_assessments 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

CREATE POLICY "Bank employees can create assessments" 
  ON public.customer_credit_assessments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

CREATE POLICY "Bank employees can update assessments they created" 
  ON public.customer_credit_assessments 
  FOR UPDATE 
  TO authenticated
  USING (
    assessor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'bank_employee'
    )
  );

-- Add updated_at trigger for bank employee profiles
CREATE TRIGGER handle_updated_at_bank_employee_profiles
  BEFORE UPDATE ON public.bank_employee_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add updated_at trigger for loan application reviews
CREATE TRIGGER handle_updated_at_loan_application_reviews
  BEFORE UPDATE ON public.loan_application_reviews
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add updated_at trigger for customer credit assessments
CREATE TRIGGER handle_updated_at_customer_credit_assessments
  BEFORE UPDATE ON public.customer_credit_assessments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
