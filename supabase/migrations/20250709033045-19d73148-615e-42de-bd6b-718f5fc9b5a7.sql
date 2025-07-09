-- Create company_bank_accounts table to store company banking information
CREATE TABLE public.company_bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  branch_name TEXT,
  bank_code TEXT,
  account_type TEXT DEFAULT 'business',
  currency TEXT DEFAULT 'VND',
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.company_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies - only admins can manage company bank accounts
CREATE POLICY "Only admins can manage company bank accounts"
  ON public.company_bank_accounts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Public can view active company bank accounts (for payment instructions)
CREATE POLICY "Public can view active company bank accounts"
  ON public.company_bank_accounts
  FOR SELECT
  USING (is_active = true);

-- Insert company bank information
INSERT INTO public.company_bank_accounts (
  bank_name,
  account_holder_name,
  account_number,
  branch_name,
  is_primary,
  notes
) VALUES (
  'Ngân hàng Sacombank (Sài Gòn Thương Tín)',
  'Công Ty Cổ Phần Công Nghệ Finzy',
  '9269',
  'Chi Nhánh Sài Gòn Thương Tín',
  true,
  'Tài khoản chính của công ty cho các giao dịch thanh toán'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_bank_accounts_updated_at
  BEFORE UPDATE ON public.company_bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();