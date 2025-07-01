
-- Create table for loan conversations between customers and advisors
CREATE TABLE public.loan_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id uuid REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  advisor_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active',
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for loan_conversations
ALTER TABLE public.loan_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for loan_conversations
CREATE POLICY "Users can view their own conversations" 
ON public.loan_conversations 
FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() = advisor_id);

CREATE POLICY "Users can create conversations" 
ON public.loan_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can update conversations" 
ON public.loan_conversations 
FOR UPDATE 
USING (auth.uid() = customer_id OR auth.uid() = advisor_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_loan_conversations_updated_at 
BEFORE UPDATE ON public.loan_conversations 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update advisor_profiles table to include location information
ALTER TABLE public.advisor_profiles 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS service_area text[];

-- Create index for better performance on location-based queries
CREATE INDEX IF NOT EXISTS idx_advisor_profiles_location ON public.advisor_profiles(location);
CREATE INDEX IF NOT EXISTS idx_advisor_profiles_service_area ON public.advisor_profiles USING GIN(service_area);
