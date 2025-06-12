
-- Add promotional fields to existing_loans table
ALTER TABLE public.existing_loans 
ADD COLUMN promotional_rate DECIMAL(5,2),
ADD COLUMN promotional_end_date DATE,
ADD COLUMN post_promotional_rate DECIMAL(5,2),
ADD COLUMN has_promotional_period BOOLEAN DEFAULT false;

-- Create table for promotional loan alerts
CREATE TABLE public.promotional_loan_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  existing_loan_id UUID REFERENCES public.existing_loans NOT NULL,
  alert_type TEXT NOT NULL, -- 'promotional_ending', 'rate_increase', 'cost_impact'
  days_until_change INTEGER,
  current_monthly_payment DECIMAL(15,2),
  future_monthly_payment DECIMAL(15,2),
  monthly_increase DECIMAL(15,2),
  total_cost_increase DECIMAL(15,2),
  alert_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_read BOOLEAN DEFAULT false,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for promotional_loan_alerts
ALTER TABLE public.promotional_loan_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for promotional_loan_alerts
CREATE POLICY "Users can view their own promotional loan alerts" 
  ON public.promotional_loan_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own promotional loan alerts" 
  ON public.promotional_loan_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own promotional loan alerts" 
  ON public.promotional_loan_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_promotional_loan_alerts_user_id ON public.promotional_loan_alerts(user_id);
CREATE INDEX idx_promotional_loan_alerts_loan_id ON public.promotional_loan_alerts(existing_loan_id);
CREATE INDEX idx_promotional_loan_alerts_active ON public.promotional_loan_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_existing_loans_promotional ON public.existing_loans(has_promotional_period) WHERE has_promotional_period = true;

-- Create function to calculate promotional loan costs
CREATE OR REPLACE FUNCTION public.calculate_promotional_cost_increase(
  loan_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  loan_record RECORD;
  days_remaining INTEGER;
  monthly_increase DECIMAL(15,2);
  total_increase DECIMAL(15,2);
  result JSONB;
BEGIN
  -- Get loan details
  SELECT * INTO loan_record
  FROM public.existing_loans
  WHERE id = loan_id AND has_promotional_period = true;
  
  IF NOT FOUND THEN
    RETURN '{"error": "Loan not found or no promotional period"}'::JSONB;
  END IF;
  
  -- Calculate days remaining in promotional period
  days_remaining := EXTRACT(DAY FROM (loan_record.promotional_end_date - CURRENT_DATE));
  
  IF days_remaining <= 0 THEN
    RETURN '{"error": "Promotional period has ended"}'::JSONB;
  END IF;
  
  -- Calculate monthly payment increase
  monthly_increase := (
    (loan_record.remaining_amount * loan_record.post_promotional_rate / 100 / 12) -
    (loan_record.remaining_amount * loan_record.promotional_rate / 100 / 12)
  );
  
  -- Calculate total cost increase for remaining term
  total_increase := monthly_increase * loan_record.remaining_term_months;
  
  result := jsonb_build_object(
    'days_remaining', days_remaining,
    'current_rate', loan_record.promotional_rate,
    'future_rate', loan_record.post_promotional_rate,
    'monthly_increase', monthly_increase,
    'total_increase', total_increase,
    'promotional_end_date', loan_record.promotional_end_date
  );
  
  RETURN result;
END;
$$;
