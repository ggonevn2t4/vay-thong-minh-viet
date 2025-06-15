
-- Enable RLS and add policies for financial_assessments
ALTER TABLE public.financial_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own financial assessments"
  ON public.financial_assessments
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS and add policies for chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat sessions"
  ON public.chat_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
