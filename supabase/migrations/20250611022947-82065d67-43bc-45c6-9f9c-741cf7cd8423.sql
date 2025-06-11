
-- Create table for storing existing loan information
CREATE TABLE public.existing_loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  bank_name TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  current_amount DECIMAL(15,2) NOT NULL,
  remaining_amount DECIMAL(15,2) NOT NULL,
  current_interest_rate DECIMAL(5,2) NOT NULL,
  remaining_term_months INTEGER NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  original_loan_date DATE,
  loan_purpose TEXT,
  additional_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing loan optimization analysis
CREATE TABLE public.loan_optimization_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  existing_loan_id UUID REFERENCES public.existing_loans NOT NULL,
  consultation_session_id UUID REFERENCES public.ai_consultation_sessions,
  current_loan_cost JSONB DEFAULT '{}',
  optimization_recommendations JSONB DEFAULT '{}',
  potential_savings JSONB DEFAULT '{}',
  recommended_actions JSONB DEFAULT '{}',
  alternative_offers JSONB DEFAULT '{}',
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.5,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for loan optimization alerts
CREATE TABLE public.loan_optimization_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  existing_loan_id UUID REFERENCES public.existing_loans NOT NULL,
  alert_type TEXT NOT NULL, -- 'rate_drop', 'better_terms', 'refinance_opportunity'
  alert_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.existing_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_optimization_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_optimization_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for existing_loans
CREATE POLICY "Users can view their own existing loans" 
  ON public.existing_loans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own existing loans" 
  ON public.existing_loans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own existing loans" 
  ON public.existing_loans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own existing loans" 
  ON public.existing_loans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for loan_optimization_analysis
CREATE POLICY "Users can view their own loan optimization analysis" 
  ON public.loan_optimization_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan optimization analysis" 
  ON public.loan_optimization_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for loan_optimization_alerts
CREATE POLICY "Users can view their own loan optimization alerts" 
  ON public.loan_optimization_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan optimization alerts" 
  ON public.loan_optimization_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan optimization alerts" 
  ON public.loan_optimization_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_existing_loans_user_id ON public.existing_loans(user_id);
CREATE INDEX idx_loan_optimization_analysis_user_id ON public.loan_optimization_analysis(user_id);
CREATE INDEX idx_loan_optimization_analysis_existing_loan_id ON public.loan_optimization_analysis(existing_loan_id);
CREATE INDEX idx_loan_optimization_alerts_user_id ON public.loan_optimization_alerts(user_id);
CREATE INDEX idx_loan_optimization_alerts_active ON public.loan_optimization_alerts(is_active) WHERE is_active = true;

-- Add trigger for updating timestamps
CREATE TRIGGER update_existing_loans_updated_at
  BEFORE UPDATE ON public.existing_loans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
