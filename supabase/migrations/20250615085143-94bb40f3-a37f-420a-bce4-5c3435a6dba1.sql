
-- Enable RLS and add policies for the notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications"
  ON public.notifications
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for the wallet table
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wallet"
  ON public.wallet
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for the wallet_transactions table
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wallet transactions"
  ON public.wallet_transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.wallet
      WHERE wallet.id = wallet_transactions.wallet_id AND wallet.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.wallet
      WHERE wallet.id = wallet_transactions.wallet_id AND wallet.user_id = auth.uid()
    )
  );
