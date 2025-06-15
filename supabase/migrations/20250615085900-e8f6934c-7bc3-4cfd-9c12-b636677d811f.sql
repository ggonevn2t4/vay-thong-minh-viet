
-- Enable RLS and add policies for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Drop existing policies for offer_comparisons to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own offer comparisons" ON public.offer_comparisons;
DROP POLICY IF EXISTS "Users can create their own offer comparisons" ON public.offer_comparisons;
DROP POLICY IF EXISTS "Users can update their own offer comparisons" ON public.offer_comparisons;
DROP POLICY IF EXISTS "Users can delete their own offer comparisons" ON public.offer_comparisons;

-- Add consolidated RLS policy for offer_comparisons
CREATE POLICY "Users can manage their own offer comparisons"
  ON public.offer_comparisons
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
