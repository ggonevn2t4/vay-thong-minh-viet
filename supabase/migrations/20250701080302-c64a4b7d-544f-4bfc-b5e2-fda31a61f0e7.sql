
-- Create messages table for the conversation messages (if not exists)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text',
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for messages if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages'
  ) THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

-- Add trigger to update updated_at timestamp for messages (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_messages_updated_at'
  ) THEN
    CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON public.messages 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Update loan_applications table to ensure we have required fields
ALTER TABLE public.loan_applications 
ADD COLUMN IF NOT EXISTS advisor_id uuid,
ADD COLUMN IF NOT EXISTS customer_questions jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS advisor_notes text;

-- Enable RLS for loan_applications if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'loan_applications'
  ) THEN
    ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create/update policies for loan_applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.loan_applications;
CREATE POLICY "Users can view their own applications" 
ON public.loan_applications 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = advisor_id);

DROP POLICY IF EXISTS "Users can create their own applications" ON public.loan_applications;
CREATE POLICY "Users can create their own applications" 
ON public.loan_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own applications" ON public.loan_applications;
CREATE POLICY "Users can update their own applications" 
ON public.loan_applications 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = advisor_id);
