
-- Add 'bank_employee' to the list of possible user roles
ALTER TYPE public.app_role ADD VALUE 'bank_employee';

-- Add a column to store points balance in the user's wallet
ALTER TABLE public.wallet ADD COLUMN points_balance INTEGER NOT NULL DEFAULT 0;

-- Drop the old check constraint on wallet_transactions
ALTER TABLE public.wallet_transactions DROP CONSTRAINT wallet_transactions_transaction_type_check;

-- Add a new check constraint to include 'points_purchase' as a transaction type
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_transaction_type_check
CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'fee', 'reward', 'points_purchase'));

-- Create an enum for different types of point transactions
CREATE TYPE public.points_transaction_type AS ENUM ('purchase', 'spend', 'reward', 'refund', 'adjustment');

-- Create a new table to keep a history of all points transactions
CREATE TABLE public.points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type points_transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on the new points_transactions table
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own points transactions
CREATE POLICY "Users can view their own points transactions"
ON public.points_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Allow the system to insert new points transactions
CREATE POLICY "System can insert points transactions"
ON public.points_transactions
FOR INSERT
WITH CHECK (true);

