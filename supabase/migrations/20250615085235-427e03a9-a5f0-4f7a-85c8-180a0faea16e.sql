
-- Enable RLS and add policies for ai_consultation_sessions
ALTER TABLE public.ai_consultation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI consultation sessions"
  ON public.ai_consultation_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for financial_analysis_reports
ALTER TABLE public.financial_analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own financial analysis reports"
  ON public.financial_analysis_reports
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for interest_rate_alerts
ALTER TABLE public.interest_rate_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own interest rate alerts"
  ON public.interest_rate_alerts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for loan_optimization_alerts
ALTER TABLE public.loan_optimization_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own loan optimization alerts"
  ON public.loan_optimization_alerts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for loan_optimization_analysis
ALTER TABLE public.loan_optimization_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own loan optimization analysis"
  ON public.loan_optimization_analysis
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for promotional_loan_alerts
ALTER TABLE public.promotional_loan_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own promotional loan alerts"
  ON public.promotional_loan_alerts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
