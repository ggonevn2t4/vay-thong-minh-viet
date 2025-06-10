
-- Tạo bảng lưu trữ phiên tư vấn AI
CREATE TABLE public.ai_consultation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'financial_analysis',
  status TEXT NOT NULL DEFAULT 'active',
  financial_data JSONB DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  risk_assessment JSONB DEFAULT '{}',
  loan_optimization JSONB DEFAULT '{}',
  bank_approval_predictions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo bảng lưu trữ cảnh báo lãi suất
CREATE TABLE public.interest_rate_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  bank_name TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  current_rate DECIMAL(5,2) NOT NULL,
  alert_threshold DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo bảng lưu trữ phân tích tài chính chi tiết
CREATE TABLE public.financial_analysis_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  consultation_session_id UUID REFERENCES public.ai_consultation_sessions,
  income_analysis JSONB DEFAULT '{}',
  expense_analysis JSONB DEFAULT '{}',
  debt_analysis JSONB DEFAULT '{}',
  credit_score_factors JSONB DEFAULT '{}',
  improvement_suggestions JSONB DEFAULT '{}',
  loan_capacity JSONB DEFAULT '{}',
  optimal_loan_structure JSONB DEFAULT '{}',
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.ai_consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_rate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_analysis_reports ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho ai_consultation_sessions
CREATE POLICY "Users can view their own consultation sessions" 
  ON public.ai_consultation_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation sessions" 
  ON public.ai_consultation_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultation sessions" 
  ON public.ai_consultation_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Tạo policies cho interest_rate_alerts
CREATE POLICY "Users can view their own interest rate alerts" 
  ON public.interest_rate_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interest rate alerts" 
  ON public.interest_rate_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interest rate alerts" 
  ON public.interest_rate_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interest rate alerts" 
  ON public.interest_rate_alerts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Tạo policies cho financial_analysis_reports
CREATE POLICY "Users can view their own financial analysis reports" 
  ON public.financial_analysis_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own financial analysis reports" 
  ON public.financial_analysis_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX idx_ai_consultation_sessions_user_id ON public.ai_consultation_sessions(user_id);
CREATE INDEX idx_ai_consultation_sessions_status ON public.ai_consultation_sessions(status);
CREATE INDEX idx_interest_rate_alerts_user_id ON public.interest_rate_alerts(user_id);
CREATE INDEX idx_interest_rate_alerts_active ON public.interest_rate_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_financial_analysis_reports_user_id ON public.financial_analysis_reports(user_id);
CREATE INDEX idx_financial_analysis_reports_session_id ON public.financial_analysis_reports(consultation_session_id);
