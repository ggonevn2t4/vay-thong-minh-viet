
-- Enable RLS and add policies for the documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents"
  ON public.documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for the existing_loans table
ALTER TABLE public.existing_loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own existing loans"
  ON public.existing_loans
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for the document_requests table
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage document requests they are part of"
  ON public.document_requests
  FOR ALL
  USING (auth.uid() = customer_id OR auth.uid() = advisor_id)
  WITH CHECK (auth.uid() = customer_id OR auth.uid() = advisor_id);
