
-- Drop the overly restrictive policy for documents
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.documents;

-- Drop older, granular policies if they exist from previous migrations, to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can upload their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
DROP POLICY IF EXISTS "Advisors and Admins can update documents for review" ON public.documents;


-- RLS policy for users to view their own documents
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS policy for users to create documents for themselves
CREATE POLICY "Users can create their own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policy for users to delete their own documents
CREATE POLICY "Users can delete their own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policy for users to update their own documents
CREATE POLICY "Users can update their own documents"
  ON public.documents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS policy for advisors and admins to update documents (for review)
CREATE POLICY "Advisors and Admins can update documents for review"
  ON public.documents
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));
