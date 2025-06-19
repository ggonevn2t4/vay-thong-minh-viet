
-- Add CIC check tracking and warnings
CREATE TABLE public.cic_check_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cic_score INTEGER,
  cic_report_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track customer's CIC check history and warnings
CREATE TABLE public.customer_cic_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bank_name TEXT NOT NULL,
  purpose TEXT,
  impact_score INTEGER DEFAULT 0, -- Negative impact on credit score
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bank offers linked to loan applications
CREATE TABLE public.bank_loan_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  offered_amount BIGINT NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  term_months INTEGER NOT NULL,
  conditions TEXT,
  requires_cic_check BOOLEAN DEFAULT true,
  offer_expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  advisor_id UUID, -- Removed foreign key constraint for now
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer warnings and educational content
CREATE TABLE public.customer_warnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  warning_type TEXT NOT NULL CHECK (warning_type IN ('cic_check_limit', 'credit_score_impact', 'multiple_applications')),
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update loan_applications to track offer generation
ALTER TABLE public.loan_applications 
ADD COLUMN offers_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN total_offers_count INTEGER DEFAULT 0,
ADD COLUMN customer_education_completed BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.cic_check_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_cic_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_loan_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_warnings ENABLE ROW LEVEL SECURITY;

-- RLS policies for CIC check requests
CREATE POLICY "Users can view their own CIC requests" 
  ON public.cic_check_requests 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own CIC requests" 
  ON public.cic_check_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own CIC requests" 
  ON public.cic_check_requests 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

-- RLS policies for CIC history
CREATE POLICY "Users can view their own CIC history" 
  ON public.customer_cic_history 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "System can insert CIC history" 
  ON public.customer_cic_history 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for bank offers
CREATE POLICY "Users can view offers for their applications" 
  ON public.bank_loan_offers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.loan_applications 
      WHERE id = loan_application_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Advisors can create offers" 
  ON public.bank_loan_offers 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.advisor_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Advisors can update their offers" 
  ON public.bank_loan_offers 
  FOR UPDATE 
  USING (
    advisor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.advisor_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS policies for customer warnings
CREATE POLICY "Users can view their own warnings" 
  ON public.customer_warnings 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can update their own warnings" 
  ON public.customer_warnings 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

CREATE POLICY "System can create warnings" 
  ON public.customer_warnings 
  FOR INSERT 
  WITH CHECK (true);

-- Function to check CIC impact and create warnings
CREATE OR REPLACE FUNCTION public.check_cic_impact_and_warn(customer_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  recent_checks INTEGER;
  total_checks INTEGER;
  warning_message TEXT;
  impact_level TEXT;
  result JSONB;
BEGIN
  -- Count recent CIC checks (last 3 months)
  SELECT COUNT(*) INTO recent_checks
  FROM public.customer_cic_history
  WHERE customer_id = customer_uuid 
    AND check_date >= NOW() - INTERVAL '3 months';
  
  -- Count total CIC checks (last 12 months)
  SELECT COUNT(*) INTO total_checks
  FROM public.customer_cic_history
  WHERE customer_id = customer_uuid 
    AND check_date >= NOW() - INTERVAL '12 months';
  
  -- Determine impact level and create appropriate warnings
  IF recent_checks >= 3 THEN
    impact_level := 'high';
    warning_message := 'Bạn đã có ' || recent_checks || ' lần kiểm tra CIC trong 3 tháng qua. Việc kiểm tra thêm có thể ảnh hưởng nghiêm trọng đến điểm tín dụng của bạn.';
    
    INSERT INTO public.customer_warnings (customer_id, warning_type, message, severity)
    VALUES (customer_uuid, 'cic_check_limit', warning_message, 'high');
    
  ELSIF recent_checks >= 2 THEN
    impact_level := 'medium';
    warning_message := 'Bạn đã có ' || recent_checks || ' lần kiểm tra CIC gần đây. Hãy cân nhắc kỹ trước khi cho phép thêm ngân hàng kiểm tra.';
    
    INSERT INTO public.customer_warnings (customer_id, warning_type, message, severity)
    VALUES (customer_uuid, 'cic_check_limit', warning_message, 'medium');
    
  ELSE
    impact_level := 'low';
  END IF;
  
  result := jsonb_build_object(
    'recent_checks', recent_checks,
    'total_checks', total_checks,
    'impact_level', impact_level,
    'can_safely_check', recent_checks < 2,
    'warning_message', COALESCE(warning_message, 'Tình trạng tín dụng của bạn ổn định cho việc kiểm tra CIC.')
  );
  
  RETURN result;
END;
$$;

-- Function to create bank offers for a loan application
CREATE OR REPLACE FUNCTION public.generate_bank_offers(application_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  app_record RECORD;
  offer_count INTEGER := 0;
  result JSONB;
BEGIN
  -- Get application details
  SELECT * INTO app_record
  FROM public.loan_applications
  WHERE id = application_id;
  
  IF NOT FOUND THEN
    RETURN '{"error": "Application not found"}'::JSONB;
  END IF;
  
  -- Generate sample bank offers (in real implementation, this would integrate with bank APIs)
  -- Vietcombank offer
  INSERT INTO public.bank_loan_offers (
    loan_application_id, bank_name, offered_amount, interest_rate, 
    term_months, conditions, requires_cic_check, offer_expires_at
  ) VALUES (
    application_id, 'Vietcombank', app_record.amount, 8.5, 
    app_record.term_months, 'Yêu cầu tài sản đảm bảo', true, NOW() + INTERVAL '7 days'
  );
  offer_count := offer_count + 1;
  
  -- Techcombank offer
  INSERT INTO public.bank_loan_offers (
    loan_application_id, bank_name, offered_amount, interest_rate, 
    term_months, conditions, requires_cic_check, offer_expires_at
  ) VALUES (
    application_id, 'Techcombank', app_record.amount * 0.9, 9.2, 
    app_record.term_months, 'Lãi suất ưu đãi 6 tháng đầu', true, NOW() + INTERVAL '5 days'
  );
  offer_count := offer_count + 1;
  
  -- BIDV offer
  INSERT INTO public.bank_loan_offers (
    loan_application_id, bank_name, offered_amount, interest_rate, 
    term_months, conditions, requires_cic_check, offer_expires_at
  ) VALUES (
    application_id, 'BIDV', app_record.amount * 0.8, 10.1, 
    app_record.term_months, 'Không yêu cầu tài sản đảm bảo', true, NOW() + INTERVAL '10 days'
  );
  offer_count := offer_count + 1;
  
  -- Update application with offer information
  UPDATE public.loan_applications 
  SET offers_generated_at = NOW(), total_offers_count = offer_count
  WHERE id = application_id;
  
  result := jsonb_build_object(
    'success', true,
    'offers_generated', offer_count,
    'message', 'Đã tạo ' || offer_count || ' đề nghị từ các ngân hàng'
  );
  
  RETURN result;
END;
$$;

-- Add triggers for updated_at columns
CREATE TRIGGER update_cic_check_requests_updated_at
  BEFORE UPDATE ON public.cic_check_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bank_loan_offers_updated_at
  BEFORE UPDATE ON public.bank_loan_offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
