
-- Drop existing policies for loan_applications to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can create their own loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can update their own loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can delete their own loans" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can manage their own loan applications" ON public.loan_applications;

-- Add consolidated RLS policy for loan_applications
CREATE POLICY "Users can manage their own loan applications"
  ON public.loan_applications
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop existing policies for advisor_profiles to avoid conflicts
DROP POLICY IF EXISTS "Advisors can manage their own profiles" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Authenticated users can view advisor profiles" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Public users can view verified advisor profiles" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Anyone can view published advisor profiles" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Advisors can create their own profile" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Advisors can update their own profile" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Public can view verified advisor profiles" ON public.advisor_profiles;

-- Add consolidated RLS policies for advisor_profiles
CREATE POLICY "Advisors can manage their own profiles"
  ON public.advisor_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Authenticated users can view advisor profiles"
  ON public.advisor_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view verified advisor profiles"
  ON public.advisor_profiles
  FOR SELECT
  TO anon
  USING (is_verified = true);

-- Drop existing policies for knowledge_articles to avoid conflicts
DROP POLICY IF EXISTS "Everyone can view published articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Authors can view their own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Advisors and admins can create articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Authors can update their own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Authors can delete their own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Authors can update and delete their own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Public can view published knowledge articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Authors can manage their own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Advisors and Admins can create knowledge articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Advisors and Admins can create articles" ON public.knowledge_articles;

-- Add consolidated RLS policies for knowledge_articles
CREATE POLICY "Public can view published knowledge articles"
  ON public.knowledge_articles FOR SELECT USING (is_published = true);

CREATE POLICY "Authors can view their own articles"
  ON public.knowledge_articles FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles"
  ON public.knowledge_articles FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own articles"
  ON public.knowledge_articles FOR DELETE USING (auth.uid() = author_id);
  
CREATE POLICY "Advisors and Admins can create articles"
  ON public.knowledge_articles FOR INSERT WITH CHECK (
    (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'))
    AND auth.uid() = author_id
  );
