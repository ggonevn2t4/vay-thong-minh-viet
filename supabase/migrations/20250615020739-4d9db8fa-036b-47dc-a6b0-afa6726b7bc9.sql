
-- Check which policies exist and create only the missing ones

-- Enable RLS for tables that might not have it enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.existing_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table (if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON public.profiles 
      FOR SELECT 
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON public.profiles 
      FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create policies for existing_loans table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'existing_loans' AND policyname = 'Users can view their own loans'
  ) THEN
    CREATE POLICY "Users can view their own loans"
      ON public.existing_loans 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'existing_loans' AND policyname = 'Users can create their own loans'
  ) THEN
    CREATE POLICY "Users can create their own loans"
      ON public.existing_loans 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'existing_loans' AND policyname = 'Users can update their own loans'
  ) THEN
    CREATE POLICY "Users can update their own loans"
      ON public.existing_loans 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'existing_loans' AND policyname = 'Users can delete their own loans'
  ) THEN
    CREATE POLICY "Users can delete their own loans"
      ON public.existing_loans 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for loan_applications table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'loan_applications' AND policyname = 'Users can view their own loan applications'
  ) THEN
    CREATE POLICY "Users can view their own loan applications"
      ON public.loan_applications 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'loan_applications' AND policyname = 'Users can create their own loan applications'
  ) THEN
    CREATE POLICY "Users can create their own loan applications"
      ON public.loan_applications 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'loan_applications' AND policyname = 'Users can update their own loan applications'
  ) THEN
    CREATE POLICY "Users can update their own loan applications"
      ON public.loan_applications 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for advisor_profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'advisor_profiles' AND policyname = 'Anyone can view published advisor profiles'
  ) THEN
    CREATE POLICY "Anyone can view published advisor profiles"
      ON public.advisor_profiles 
      FOR SELECT 
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'advisor_profiles' AND policyname = 'Advisors can create their own profile'
  ) THEN
    CREATE POLICY "Advisors can create their own profile"
      ON public.advisor_profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'advisor_profiles' AND policyname = 'Advisors can update their own profile'
  ) THEN
    CREATE POLICY "Advisors can update their own profile"
      ON public.advisor_profiles 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for offer_comparisons table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_comparisons' AND policyname = 'Users can view their own offer comparisons'
  ) THEN
    CREATE POLICY "Users can view their own offer comparisons"
      ON public.offer_comparisons 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_comparisons' AND policyname = 'Users can create their own offer comparisons'
  ) THEN
    CREATE POLICY "Users can create their own offer comparisons"
      ON public.offer_comparisons 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_comparisons' AND policyname = 'Users can update their own offer comparisons'
  ) THEN
    CREATE POLICY "Users can update their own offer comparisons"
      ON public.offer_comparisons 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_comparisons' AND policyname = 'Users can delete their own offer comparisons'
  ) THEN
    CREATE POLICY "Users can delete their own offer comparisons"
      ON public.offer_comparisons 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for knowledge_articles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_articles' AND policyname = 'Everyone can view published articles'
  ) THEN
    CREATE POLICY "Everyone can view published articles"
      ON public.knowledge_articles 
      FOR SELECT 
      USING (is_published = true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_articles' AND policyname = 'Authors can view their own articles'
  ) THEN
    CREATE POLICY "Authors can view their own articles"
      ON public.knowledge_articles 
      FOR SELECT 
      USING (auth.uid() = author_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_articles' AND policyname = 'Advisors and admins can create articles'
  ) THEN
    CREATE POLICY "Advisors and admins can create articles"
      ON public.knowledge_articles 
      FOR INSERT 
      WITH CHECK (
        auth.uid() = author_id AND (
          public.has_role(auth.uid(), 'advisor') OR 
          public.has_role(auth.uid(), 'admin')
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_articles' AND policyname = 'Authors can update their own articles'
  ) THEN
    CREATE POLICY "Authors can update their own articles"
      ON public.knowledge_articles 
      FOR UPDATE 
      USING (auth.uid() = author_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'knowledge_articles' AND policyname = 'Authors can delete their own articles'
  ) THEN
    CREATE POLICY "Authors can delete their own articles"
      ON public.knowledge_articles 
      FOR DELETE 
      USING (auth.uid() = author_id);
  END IF;
END $$;
