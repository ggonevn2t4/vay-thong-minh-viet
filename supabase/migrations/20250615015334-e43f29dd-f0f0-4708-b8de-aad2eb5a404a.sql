
-- Create wallet table for both customers and advisors
CREATE TABLE public.wallet (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'VND',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES public.wallet(id) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'fee', 'reward')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document requests table
CREATE TABLE public.document_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users NOT NULL,
  advisor_id UUID REFERENCES auth.users,
  loan_application_id UUID REFERENCES public.loan_applications(id),
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'uploaded', 'approved', 'rejected')),
  file_url TEXT,
  notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create offer comparisons table
CREATE TABLE public.offer_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  comparison_name TEXT NOT NULL,
  loan_amount DECIMAL(15,2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  loan_purpose TEXT,
  offers JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge articles table for guidance content
CREATE TABLE public.knowledge_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for wallet
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet" ON public.wallet
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.wallet
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert wallets" ON public.wallet
  FOR INSERT WITH CHECK (true);

-- Add RLS policies for wallet transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wallet 
      WHERE wallet.id = wallet_transactions.wallet_id 
      AND wallet.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert wallet transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (true);

-- Add RLS policies for document requests
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own document requests" ON public.document_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Advisors can view assigned document requests" ON public.document_requests
  FOR SELECT USING (auth.uid() = advisor_id);

CREATE POLICY "Customers can create document requests" ON public.document_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Advisors and customers can update document requests" ON public.document_requests
  FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = advisor_id);

-- Add RLS policies for offer comparisons
ALTER TABLE public.offer_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own offer comparisons" ON public.offer_comparisons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own offer comparisons" ON public.offer_comparisons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offer comparisons" ON public.offer_comparisons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own offer comparisons" ON public.offer_comparisons
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for knowledge articles
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published articles" ON public.knowledge_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authors can view their own articles" ON public.knowledge_articles
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Advisors and admins can create articles" ON public.knowledge_articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('advisor', 'admin')
    )
  );

CREATE POLICY "Authors can update their own articles" ON public.knowledge_articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Create function to automatically create wallet on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create wallet for new user
  INSERT INTO public.wallet (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to create wallet on user creation
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_wallet
  BEFORE UPDATE ON public.wallet
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_wallet_transactions
  BEFORE UPDATE ON public.wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_offer_comparisons
  BEFORE UPDATE ON public.offer_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_knowledge_articles
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
