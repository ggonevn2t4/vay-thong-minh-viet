
-- Create advisor profiles table
CREATE TABLE public.advisor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  -- Personal Information
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  job_title TEXT,
  years_experience INTEGER,
  certifications TEXT[],
  languages TEXT[],
  
  -- Bank Information
  bank_name TEXT NOT NULL,
  branch_name TEXT,
  branch_address TEXT,
  bank_employee_id TEXT,
  department TEXT,
  
  -- Self Introduction
  bio TEXT,
  specializations TEXT[],
  achievements TEXT[],
  client_testimonials JSONB DEFAULT '[]'::JSONB,
  
  -- Interest Rate Information
  loan_types JSONB DEFAULT '{}'::JSONB, -- Store loan types with their rates
  rate_update_frequency TEXT DEFAULT 'weekly',
  last_rate_update TIMESTAMP WITH TIME ZONE,
  
  -- Professional Status
  is_verified BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]'::JSONB,
  availability_status TEXT DEFAULT 'available',
  working_hours JSONB DEFAULT '{}'::JSONB,
  
  -- Performance Metrics
  total_clients_helped INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;

-- Advisors can view and edit their own profiles
CREATE POLICY "Advisors can manage their own profiles" 
  ON public.advisor_profiles 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Authenticated users can view all advisor profiles
CREATE POLICY "Authenticated users can view advisor profiles" 
  ON public.advisor_profiles 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Public users can view verified advisor profiles
CREATE POLICY "Public users can view verified advisor profiles" 
  ON public.advisor_profiles 
  FOR SELECT 
  TO anon
  USING (is_verified = true);

-- Add trigger for updated_at
CREATE TRIGGER advisor_profiles_updated_at
  BEFORE UPDATE ON public.advisor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for better performance
CREATE INDEX idx_advisor_profiles_user_id ON public.advisor_profiles(user_id);
CREATE INDEX idx_advisor_profiles_bank_name ON public.advisor_profiles(bank_name);
CREATE INDEX idx_advisor_profiles_verified ON public.advisor_profiles(is_verified);
